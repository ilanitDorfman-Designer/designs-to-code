import React, { useCallback, useMemo } from 'react';
import { LayoutChangeEvent, Role, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { X2 } from '../../../core/styles/spacing';
import { EtChip } from '../chips/et-chip';
import { ChipsGroupItem, ChipsGroupSelectionMode, EtChipsGroupV2Props } from './api';
import { ScrollFadeOverlay } from './components';
import { useChipsGroupConfig, useScrollFade, useScrollSelectedChipIntoView } from './hooks';

/** Maps selection mode to accessibility role */
const SELECTION_MODE_ROLES: Record<ChipsGroupSelectionMode, Role | undefined> = {
  single: 'radiogroup',
  multi: 'group',
  none: undefined,
};

/**
 * EtChipsGroupV2 - A group of selectable chips with scroll/wrap layouts.
 *
 * Supports three selection modes:
 * - `none`: Display-only chips (non-interactive)
 * - `single`: One chip can be selected at a time (like radio buttons)
 * - `multi`: Multiple chips can be selected (like checkboxes)
 *
 * Features:
 * - Horizontal scroll with animated fade overlays (60fps on UI thread)
 * - Wrapped multi-row layout
 * - RTL support for overlays
 * - Haptic feedback on selection
 * - Customizable fade color for non-white backgrounds
 *
 * @example Non-selectable (display only)
 * ```tsx
 * <EtChipsGroupV2 items={categories} selectionMode="none" />
 * ```
 *
 * @example Single select
 * ```tsx
 * const [selected, setSelected] = useState<string | null>(null);
 * <EtChipsGroupV2
 *   items={filters}
 *   selectionMode="single"
 *   value={selected}
 *   onChange={setSelected}
 * />
 * ```
 *
 * @example Multi select with wrap layout
 * ```tsx
 * const [selected, setSelected] = useState<string[]>([]);
 * <EtChipsGroupV2
 *   items={tags}
 *   selectionMode="multi"
 *   value={selected}
 *   onChange={setSelected}
 *   layout="wrap"
 * />
 * ```
 *
 * @example Custom fade color for non-white background
 * ```tsx
 * const { colors } = useEtoroTheme();
 * <EtChipsGroupV2
 *   items={filters}
 *   selectionMode="single"
 *   value={selected}
 *   onChange={setSelected}
 *   fadeColor={colors.bgNeutralSecondary}
 * />
 * ```
 */
function EtChipsGroupV2Base(props: EtChipsGroupV2Props) {
  const {
    items,
    layout = 'scroll',
    gap = X2,
    fadeColor,
    haptics = true,
    showCloseOnSelected,
    style,
    contentContainerStyle,
    testID,
    accessibilityLabel,
    initialScrollOffsetX,
    onScrollOffsetXChange,
    scrollSelectedIntoView = false,
  } = props;

  const { selectedIds, handleSelect, selectionMode } = useChipsGroupConfig(props);

  const isScrollLayout = layout === 'scroll';
  const tracksSelection = isScrollLayout && scrollSelectedIntoView;

  // In multi mode the leftmost selection is the one worth revealing.
  const selectedId = useMemo(() => items.find((item) => selectedIds.has(item.id))?.id, [items, selectedIds]);

  // `onScrollOffsetXChange` is the only per-frame UI→JS hop, so it stays opt-in.
  // Scroll-into-view reads `scrollOffsetX` on the UI thread instead.
  const {
    startFadeOpacity,
    endFadeOpacity,
    scrollOffsetX,
    hasScrolledValue,
    scrollHandler,
    handleContentSizeChange,
    handleLayout,
    applyScrollFade,
    isRTL,
  } = useScrollFade('start', onScrollOffsetXChange, initialScrollOffsetX);

  // Restore a previously-captured horizontal position on mount. Lets a host keep
  // the rail in place across duplicated/remounted copies (e.g. a FlashList
  // sticky-header copy that would otherwise mount at offset 0).
  //
  // An explicit `0` counts as restored. It is not the same instruction as an
  // absent prop: a fresh RTL rail rests at `contentWidth - viewportWidth`, so
  // omitting the prop leaves it at the right edge while `0` pins it to the left.
  const hasInitialOffset = initialScrollOffsetX !== undefined;

  const {
    scrollRef,
    handleChipLayout,
    handleContainerLayout,
    handleContentSizeChange: handleChipsContentSizeChange,
  } = useScrollSelectedChipIntoView({
    enabled: tracksSelection,
    selectedId,
    scrollOffsetX,
    hasScrolledValue,
    isRTL,
    hasInitialOffset,
  });

  // Both readers need the container width: the fades to detect overflow, the
  // scroll-into-view to know what "visible" means.
  const handleRailLayout = (event: LayoutChangeEvent) => {
    handleLayout(event);
    handleContainerLayout(event);
  };

  const initialContentOffset = useMemo(
    () => (initialScrollOffsetX === undefined ? undefined : { x: initialScrollOffsetX, y: 0 }),
    [initialScrollOffsetX],
  );

  // `contentOffset` suppresses the initial onScroll event, so sync the fade
  // overlays to the restored position once the content width is known.
  const handleScrollContentSizeChange = useCallback(
    (width: number) => {
      handleContentSizeChange(width);
      handleChipsContentSizeChange(width);
      if (initialScrollOffsetX !== undefined) {
        applyScrollFade(initialScrollOffsetX);
      }
    },
    [handleContentSizeChange, handleChipsContentSizeChange, applyScrollFade, initialScrollOffsetX],
  );

  const renderChipItem = (item: ChipsGroupItem) => {
    const isSelected = selectedIds.has(item.id);
    const isInteractive = selectionMode !== 'none';

    const chip = (
      <EtChip
        key={item.id}
        selected={isSelected}
        onSelectionChange={isInteractive ? () => handleSelect(item.id) : undefined}
        haptics={haptics}
        showCloseOnSelected={showCloseOnSelected}
        testID={testID ? `${testID}-chip-${item.id}` : undefined}
      >
        {item.icon && <EtChip.Icon iconName={item.icon} />}
        <EtChip.Label>{item.label}</EtChip.Label>
      </EtChip>
    );

    // Only wrap when we need the measurement, so rails that don't opt in keep
    // their original (unnested) tree.
    if (!tracksSelection) return chip;

    return (
      <View key={item.id} onLayout={(event) => handleChipLayout(item.id, event.nativeEvent.layout)}>
        {chip}
      </View>
    );
  };

  const containerStyle = [styles.container, style];
  const contentStyle = [isScrollLayout ? styles.scrollContent : styles.wrapContent, { gap }, contentContainerStyle];

  if (isScrollLayout) {
    return (
      <View style={containerStyle} onLayout={handleRailLayout} testID={testID}>
        <Animated.ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          onScroll={scrollHandler}
          onContentSizeChange={handleScrollContentSizeChange}
          contentOffset={initialContentOffset}
          scrollEventThrottle={16}
          contentContainerStyle={contentStyle}
          role={SELECTION_MODE_ROLES[selectionMode]}
          accessibilityLabel={accessibilityLabel}
        >
          {items.map(renderChipItem)}
        </Animated.ScrollView>

        <ScrollFadeOverlay opacity={startFadeOpacity} position="start" fadeColor={fadeColor} testID={testID ? `${testID}-fade-start` : undefined} />
        <ScrollFadeOverlay opacity={endFadeOpacity} position="end" fadeColor={fadeColor} testID={testID ? `${testID}-fade-end` : undefined} />
      </View>
    );
  }

  // Wrap layout
  return (
    <View style={[containerStyle, contentStyle]} testID={testID} role={SELECTION_MODE_ROLES[selectionMode]} accessibilityLabel={accessibilityLabel}>
      {items.map(renderChipItem)}
    </View>
  );
}

EtChipsGroupV2Base.displayName = 'EtChipsGroupV2';

/**
 * Export with React.memo for performance optimization
 */
export const EtChipsGroupV2 = React.memo(EtChipsGroupV2Base);
EtChipsGroupV2.displayName = 'EtChipsGroupV2';

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wrapContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
});
