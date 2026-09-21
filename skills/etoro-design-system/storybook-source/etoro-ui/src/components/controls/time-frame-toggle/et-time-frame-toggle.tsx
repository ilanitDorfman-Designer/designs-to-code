import { TimeFrame } from '@etoro/common/types';
import { useCallback, useEffect, useRef, useState } from 'react';
import { LayoutChangeEvent, LayoutRectangle, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useDerivedValue, useSharedValue, withSpring } from 'react-native-reanimated';

import { computeScrollIntoViewX } from '../../../utils/compute-scroll-into-view-x';
import { ScrollFadeOverlay } from '../chips-group-v2/components/scroll-fade-overlay';
import { useScrollFade } from '../chips-group-v2/hooks/use-scroll-fade';
import {
  DEFAULT_ANIMATION_CONFIG,
  DEFAULT_FONT_SIZE,
  DEFAULT_INDICATOR_SIZE,
  EtTimeFrameToggleProps,
  OptionLayout,
  TimeFrameOption as TimeFrameOptionType,
} from './api';
import { CircularIndicator, FloatingLabel, TimeFrameOption } from './components';

/**
 * Interpolates the indicator's position and width across the two adjacent
 * option rectangles, driven by the fractional `progress`. Reading measured
 * layouts (rather than `containerWidth / count`) keeps the indicator aligned
 * when options have intrinsic, label-driven widths.
 */
function getIndicatorMetrics(layouts: OptionLayout[], progress: number): OptionLayout {
  'worklet';
  if (layouts.length === 0) return { x: 0, width: 0 };

  const lastIndex = layouts.length - 1;
  let lower: number;
  let upper: number;
  if (progress <= 0) {
    lower = 0;
    upper = lastIndex > 0 ? 1 : 0;
  } else if (progress >= lastIndex) {
    lower = lastIndex > 0 ? lastIndex - 1 : 0;
    upper = lastIndex;
  } else {
    lower = Math.floor(progress);
    upper = lower + 1;
  }

  const lowerLayout = layouts[lower] ?? { x: 0, width: 0 };
  const upperLayout = layouts[upper] ?? lowerLayout;
  const fraction = progress - lower;

  return {
    x: lowerLayout.x + fraction * (upperLayout.x - lowerLayout.x),
    width: lowerLayout.width + fraction * (upperLayout.width - lowerLayout.width),
  };
}

export function EtTimeFrameToggle<T = TimeFrame>({
  options,
  selectedId,
  onSelectionChange,
  showLabel = false,
  fontSize = DEFAULT_FONT_SIZE,
  indicatorSize = DEFAULT_INDICATOR_SIZE,
  style,
  haptics = true,
  animationConfig = DEFAULT_ANIMATION_CONFIG,
  testID = 'time-frame-toggle',
  selectedColor,
  unselectedColor,
  scrollable = false,
  scrollAnchorEnd = false,
  showScrollFade,
  scrollFadeColor,
  optionHorizontalPadding,
  labelVariant,
}: EtTimeFrameToggleProps<T>) {
  const selectedIndex = options.findIndex((opt) => opt.id === selectedId);
  const selectedOption = options[selectedIndex];

  // Identity of the current option SET — drives the scroll re-anchor effects below.
  const optionsKey = options.map((option) => option.id).join('|');

  // --- Indicator: spring-driven circular ring (shared with the rest of the app) ---
  // Measured layouts live in a SharedValue so the indicator worklet picks up changes without a
  // React re-render. `layoutsReady` (React state) gates the first paint so the indicator never
  // flashes at zero width, and gates the scroll effects below.
  const optionLayouts = useSharedValue<OptionLayout[]>([]);
  const layoutsRef = useRef<OptionLayout[]>([]);
  const reportedRef = useRef<Set<number>>(new Set());
  const [layoutsReady, setLayoutsReady] = useState(false);

  // Fractional index of the selected option, initialised to the current selection so the indicator
  // is already in place on its first paint.
  const selectedProgress = useSharedValue(selectedIndex < 0 ? 0 : selectedIndex);
  const intendedTargetRef = useRef(-1);

  const enableAnimation = animationConfig.enableAnimation !== false;
  const springConfig = animationConfig.springConfig ?? DEFAULT_ANIMATION_CONFIG.springConfig;

  const animateToIndex = useCallback(
    (index: number) => {
      if (index < 0 || intendedTargetRef.current === index) return;
      // Snap on the first placement so the indicator doesn't slide in from index 0 on mount;
      // spring on every change afterwards.
      const isFirstSet = intendedTargetRef.current < 0;
      intendedTargetRef.current = index;
      if (isFirstSet || !enableAnimation) {
        selectedProgress.value = index;
        return;
      }
      selectedProgress.value = withSpring(index, springConfig);
    },
    [selectedProgress, enableAnimation, springConfig],
  );

  // --- Scroll machinery: horizontal scroll, end-anchoring, edge fades, scroll-into-view ---
  const showScrollFadeEffective = showScrollFade ?? scrollable;
  // When end-anchoring, keep the row hidden until the initial scroll-to-end has applied, so it
  // appears already positioned on the trailing (selected) chip instead of flashing from the start
  // and jumping. Non-anchored toggles are visible immediately.
  const needsAnchor = scrollable && scrollAnchorEnd;
  const [anchored, setAnchored] = useState(!needsAnchor);

  const scrollRef = useRef<Animated.ScrollView>(null);
  const scrollOffsetRef = useRef(0);
  const viewportWidthRef = useRef(0);

  const handleScrollOffsetChange = useCallback((offsetX: number) => {
    scrollOffsetRef.current = offsetX;
  }, []);

  const {
    startFadeOpacity,
    endFadeOpacity,
    scrollHandler,
    handleContentSizeChange,
    handleLayout: handleScrollFadeLayout,
    applyScrollFade,
  } = useScrollFade(scrollAnchorEnd ? 'end' : 'start', handleScrollOffsetChange);

  const handleOptionLayout = useCallback(
    (index: number, layout: LayoutRectangle) => {
      const existing = layoutsRef.current[index];
      if (existing && existing.x === layout.x && existing.width === layout.width) return;

      layoutsRef.current[index] = { x: layout.x, width: layout.width };
      optionLayouts.value = layoutsRef.current.slice();
      reportedRef.current.add(index);

      if (!layoutsReady && reportedRef.current.size >= options.length) {
        setLayoutsReady(true);
      }
    },
    [optionLayouts, layoutsReady, options.length],
  );

  // Capture viewport width (and feed the scroll-fade gradients) — the scroll math below needs it.
  // Indicator placement is layout-driven and does not depend on this.
  const handleContainerLayout = useCallback(
    (event: LayoutChangeEvent) => {
      viewportWidthRef.current = event.nativeEvent.layout.width;
      if (showScrollFadeEffective) {
        handleScrollFadeLayout(event);
      }
    },
    [showScrollFadeEffective, handleScrollFadeLayout],
  );

  // Drives the spring whenever the selection changes (and once layouts are measured). The press path
  // flows through `selectedId`, so this is the single place that moves the indicator.
  useEffect(() => {
    if (selectedIndex < 0 || !layoutsReady) return;
    animateToIndex(selectedIndex);
  }, [selectedIndex, layoutsReady, animateToIndex]);

  const indicator = useDerivedValue<OptionLayout>(() => getIndicatorMetrics(optionLayouts.value, selectedProgress.value));

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicator.value.x }],
    width: Math.max(indicator.value.width, indicatorSize),
  }));

  const showIndicator = layoutsReady && selectedIndex >= 0;

  const handleOptionPress = useCallback(
    (option: TimeFrameOptionType<T>) => {
      onSelectionChange?.(option);
    },
    [onSelectionChange],
  );

  const scrollToEnd = useCallback(
    (animated: boolean) => {
      const layouts = layoutsRef.current;
      const lastLayout = layouts[layouts.length - 1];
      const viewportWidth = viewportWidthRef.current;
      if (!lastLayout || viewportWidth <= 0) {
        return;
      }

      const contentWidth = lastLayout.x + lastLayout.width;
      const targetScrollX = Math.max(0, contentWidth - viewportWidth);
      scrollRef.current?.scrollTo({ x: targetScrollX, animated });
      scrollOffsetRef.current = targetScrollX;

      if (showScrollFadeEffective) {
        handleContentSizeChange(contentWidth);
        applyScrollFade(targetScrollX);
      }
    },
    [applyScrollFade, handleContentSizeChange, showScrollFadeEffective],
  );

  // Re-hide while (re)anchoring so the row is only revealed once it has been scrolled to the end.
  useEffect(() => {
    setAnchored(!needsAnchor);
  }, [optionsKey, needsAnchor]);

  // Initial end-anchor: position to the trailing edge while still hidden, then reveal on the next
  // frame — once the instant scroll has actually applied — so entering bar mode shows the end
  // immediately with no visible left→right scroll.
  useEffect(() => {
    if (!scrollable || !scrollAnchorEnd || !layoutsReady) {
      return;
    }
    scrollToEnd(false);
    const raf = requestAnimationFrame(() => setAnchored(true));
    return () => cancelAnimationFrame(raf);
  }, [scrollable, scrollAnchorEnd, layoutsReady, optionsKey, scrollToEnd]);

  // Scroll the selected chip into view on selection change.
  useEffect(() => {
    if (!scrollable || !layoutsReady || selectedIndex < 0) {
      return;
    }
    // During the initial end-anchor the row is positioned instantly (and is still hidden); skip the
    // animated scroll-into-view so entering the toggle doesn't visibly scroll to the trailing chip.
    if (needsAnchor && !anchored) {
      return;
    }

    const layout = layoutsRef.current[selectedIndex];
    if (!layout) {
      return;
    }

    const targetScrollX = computeScrollIntoViewX({
      chipX: layout.x,
      chipWidth: layout.width,
      viewportWidth: viewportWidthRef.current,
      scrollX: scrollOffsetRef.current,
    });

    if (targetScrollX == null) {
      return;
    }

    scrollRef.current?.scrollTo({ x: targetScrollX, animated: true });
  }, [scrollable, layoutsReady, selectedIndex, selectedId, needsAnchor, anchored]);

  const optionNodes = options.map((option, index) => (
    <TimeFrameOption<T>
      key={option.id as string}
      option={option}
      isSelected={option.id === selectedId}
      onPress={() => handleOptionPress(option)}
      onLayout={(layout) => handleOptionLayout(index, layout)}
      haptics={haptics}
      fontSize={fontSize}
      size={indicatorSize}
      selectedColor={selectedColor}
      unselectedColor={unselectedColor}
      horizontalPadding={optionHorizontalPadding}
      labelVariant={labelVariant}
    />
  ));

  // The indicator and label live INSIDE the options row so they scroll in lockstep with the chips
  // when `scrollable`. Their translateX is the option's x within this row, so the coordinate system
  // is identical in both scroll and non-scroll modes.
  //
  // That translateX is PHYSICAL (onLayout.x), so the row is LTR-locked (see styles below) and both
  // anchor with `left: 0` — the same physical-left coordinate system in LTR and RTL apps.
  const optionsWrapper = (
    <View style={[scrollable ? styles.scrollableContent : styles.optionsContainer, !anchored && styles.hiddenUntilAnchored]}>
      {showLabel && showIndicator && selectedOption?.value !== undefined && <FloatingLabel value={selectedOption.value} indicator={indicator} />}

      {showIndicator && (
        <Animated.View pointerEvents="none" style={[styles.indicatorContainer, indicatorStyle]}>
          <CircularIndicator size={indicatorSize} borderColor={selectedColor} />
        </Animated.View>
      )}

      {optionNodes}
    </View>
  );

  return (
    <View
      style={[styles.container, scrollable && styles.scrollableRoot, style]}
      onLayout={handleContainerLayout}
      testID={testID}
      accessibilityRole="radiogroup"
    >
      {scrollable ? (
        <Animated.ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.scrollableContainer}
          scrollEventThrottle={16}
          onScroll={showScrollFadeEffective ? scrollHandler : undefined}
          onContentSizeChange={showScrollFadeEffective ? handleContentSizeChange : undefined}
        >
          {optionsWrapper}
        </Animated.ScrollView>
      ) : (
        optionsWrapper
      )}

      {scrollable && showScrollFadeEffective && anchored ? (
        <>
          <ScrollFadeOverlay
            opacity={startFadeOpacity}
            position="start"
            fadeColor={scrollFadeColor}
            testID={testID ? `${testID}-fade-start` : undefined}
          />
          <ScrollFadeOverlay opacity={endFadeOpacity} position="end" fadeColor={scrollFadeColor} testID={testID ? `${testID}-fade-end` : undefined} />
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollableRoot: {
    direction: 'ltr',
  },
  hiddenUntilAnchored: {
    opacity: 0,
  },
  indicatorContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  optionsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // Keep chip layout + indicator/label translateX in physical LTR so RTL left/right
    // swap can't send the selected pill / period-% badge off-screen.
    direction: 'ltr',
    zIndex: 2,
  },
  scrollableContainer: {
    flex: 1,
    direction: 'ltr',
  },
  scrollableContent: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    direction: 'ltr',
    zIndex: 2,
  },
});
