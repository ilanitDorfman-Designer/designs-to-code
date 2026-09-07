import { memo, useCallback, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, scrollTo, useAnimatedRef, useSharedValue } from 'react-native-reanimated';

import { useEtoroTheme } from '../../core/hooks';
import { InstrumentIslandContext } from './api/context';
import { EtInstrumentIslandProps, InstrumentIslandContextValue } from './api/types';
import { useExpansionAnimation, useIslandLayout, useIslandState } from './hooks';
import { IslandCollapsed, IslandGlow, IslandLabel, IslandRail, IslandShell } from './subcomponents';
import { clampIndex, EXPANDED_PADDING_BOTTOM, EXPANDED_PADDING_TOP, EXPANDED_PADDING_X, LABEL_GAP, SNAP_INTERVAL } from './utils';

const LONG_PRESS_DELAY_MS = 250;
/** Horizontal travel (px) before a hold turns into a scrub that commits on release. */
const SCRUB_THRESHOLD = 8;

/**
 * `EtInstrumentIsland` — a Dynamic-Island-style instrument switcher.
 *
 * At rest it's a compact "pill": the focused instrument framed by neighbour
 * dots. Long-pressing springs it open into a frosted **Liquid Glass** island
 * holding a center-snapping rail of instruments — the centered one enlarges
 * and is named beneath. Tapping outside collapses it back. The edges glow with
 * a slowly-rotating, breathing chromatic light, mirroring iOS 27's Liquid
 * Glass Dynamic Island.
 *
 * Data-driven and presentational: it renders the `items` it's handed and
 * reports focus / activation / expansion through callbacks. It owns no
 * business logic.
 *
 * @example
 * ```tsx
 * <EtInstrumentIsland
 *   items={[
 *     { id: 'btc', symbol: 'BTC', label: 'Bitcoin', imageUrl: btcLogo, accentColor: '#F7931A' },
 *     { id: 'aapl', symbol: 'AAPL', label: 'Apple', imageUrl: aaplLogo },
 *     { id: 'nvda', symbol: 'NVDA', label: 'Nvidia', imageUrl: nvdaLogo },
 *   ]}
 *   focusedId={focusedId}
 *   onFocusChange={setFocusedId}
 *   onItemPress={openInstrument}
 * />
 * ```
 */
function InstrumentIslandComponent({
  items,
  focusedId,
  defaultFocusedId,
  onFocusChange,
  onItemPress,
  isExpanded,
  defaultExpanded,
  onExpandedChange,
  expandedWidth,
  glow = true,
  haptics = true,
  dismissOnOutsidePress = true,
  style,
  accessibilityLabel,
  testID,
}: EtInstrumentIslandProps) {
  const { colors } = useEtoroTheme();
  const layout = useIslandLayout(expandedWidth, items.length);
  const state = useIslandState({
    items,
    focusedId,
    defaultFocusedId,
    onFocusChange,
    onItemPress,
    isExpanded,
    defaultExpanded,
    onExpandedChange,
    haptics,
  });
  const anim = useExpansionAnimation(state.isExpanded, layout);

  const accentColor = items[state.focusedIndex]?.accentColor;

  const [isScrubbing, setIsScrubbing] = useState(false);

  // Shared scroll position: written by the rail's scroll handler and by the
  // hold-scrub gesture (via scrollTo), read by every rail item to interpolate.
  const scrollX = useSharedValue(0);
  const scrubStart = useSharedValue(0);
  const didScrub = useSharedValue(false);
  const railRef = useAnimatedRef<Animated.ScrollView>();
  const maxOffset = Math.max(0, (items.length - 1) * SNAP_INTERVAL);

  // Refs keep the scrub handlers (and therefore the gesture) stable while still
  // reading the latest items/state on release.
  const liveRef = useRef({ items, state });
  liveRef.current = { items, state };

  const beginScrub = useCallback(() => {
    setIsScrubbing(true);
    liveRef.current.state.onExpand();
  }, []);

  const endScrub = useCallback(() => {
    const { items: liveItems, state: live } = liveRef.current;
    setIsScrubbing(false);
    if (!didScrub.value) return; // a hold without a drag leaves the island open
    const index = clampIndex(Math.round(scrollX.value / SNAP_INTERVAL), liveItems.length);
    const focused = liveItems[index];
    if (focused != null) live.commit(focused.id);
    live.onCollapse();
  }, [didScrub, scrollX]);

  const scrubGesture = useMemo(
    () =>
      Gesture.Pan()
        .activateAfterLongPress(LONG_PRESS_DELAY_MS)
        .onStart(() => {
          scrubStart.value = scrollX.value;
          didScrub.value = false;
          runOnJS(beginScrub)();
        })
        .onUpdate((event) => {
          if (Math.abs(event.translationX) > SCRUB_THRESHOLD) didScrub.value = true;
          // Dragging left (negative translation) glides toward later instruments.
          const target = Math.min(Math.max(scrubStart.value - event.translationX, 0), maxOffset);
          scrollTo(railRef, target, 0, false);
        })
        .onEnd(() => {
          runOnJS(endScrub)();
        }),
    [beginScrub, endScrub, maxOffset, scrollX, scrubStart, didScrub, railRef],
  );

  const contextValue: InstrumentIslandContextValue = useMemo(
    () => ({
      items,
      focusedId: state.focusedId,
      focusedIndex: state.focusedIndex,
      displayIndex: state.displayIndex,
      isExpanded: state.isExpanded,
      isScrubbing,
      glow,
      accentColor,
      onFocus: state.onFocus,
      onItemActivate: state.onItemActivate,
      onCross: state.onCross,
      onSettle: state.onSettle,
      commit: state.commit,
      onExpand: state.onExpand,
      onCollapse: state.onCollapse,
    }),
    [items, state, isScrubbing, glow, accentColor],
  );

  if (items.length === 0) return null;

  const innerWidth = layout.expandedWidth - EXPANDED_PADDING_X * 2;

  return (
    <View style={[styles.container, { width: layout.collapsedWidth, height: layout.collapsedHeight }, style]} testID={testID}>
      <InstrumentIslandContext.Provider value={contextValue}>
        {dismissOnOutsidePress ? (
          <Animated.View
            style={[styles.backdrop, { backgroundColor: colors.bgOverlayGeneral }, anim.backdropStyle]}
            pointerEvents={state.isExpanded ? 'auto' : 'none'}
          >
            <Pressable
              style={StyleSheet.absoluteFill}
              onPress={state.onCollapse}
              accessible={false}
              testID={testID ? `${testID}-backdrop` : undefined}
            />
          </Animated.View>
        ) : null}

        <GestureDetector gesture={scrubGesture}>
          <Animated.View
            style={[styles.shell, anim.shellStyle]}
            accessibilityRole="button"
            accessibilityLabel={accessibilityLabel}
            accessibilityState={{ expanded: state.isExpanded }}
            testID={testID ? `${testID}-trigger` : undefined}
          >
            {glow ? (
              <IslandGlow
                expansion={anim.expansion}
                shellWidth={anim.shellWidth}
                shellHeight={anim.shellHeight}
                shellRadius={anim.shellRadius}
                maxWidth={layout.expandedWidth}
                maxHeight={layout.expandedHeight}
                isExpanded={state.isExpanded}
                accentColor={accentColor}
              />
            ) : null}

            <IslandShell surfaceStyle={anim.surfaceStyle} expansion={anim.expansion} />

            <Animated.View style={[styles.layer, anim.collapsedContentStyle]} pointerEvents={state.isExpanded ? 'none' : 'auto'}>
              <IslandCollapsed />
            </Animated.View>

            <Animated.View style={[styles.layer, styles.expandedLayer, anim.expandedContentStyle]} pointerEvents={state.isExpanded ? 'auto' : 'none'}>
              <IslandRail innerWidth={innerWidth} scrollX={scrollX} scrollRef={railRef} />
              <IslandLabel />
            </Animated.View>
          </Animated.View>
        </GestureDetector>
      </InstrumentIslandContext.Provider>
    </View>
  );
}

const InstrumentIslandBase = memo(InstrumentIslandComponent);
InstrumentIslandBase.displayName = 'EtInstrumentIsland';

export const EtInstrumentIsland = InstrumentIslandBase;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  backdrop: {
    position: 'absolute',
    top: -2000,
    bottom: -2000,
    left: -2000,
    right: -2000,
  },
  shell: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  layer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expandedLayer: {
    paddingTop: EXPANDED_PADDING_TOP,
    paddingBottom: EXPANDED_PADDING_BOTTOM,
    gap: LABEL_GAP,
  },
});
