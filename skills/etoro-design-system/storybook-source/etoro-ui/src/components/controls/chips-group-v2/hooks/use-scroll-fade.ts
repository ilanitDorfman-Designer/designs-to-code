import { etInject } from '@etoro/common/di/core';
import { LOCALIZATION_LANGUAGE_MANAGER_TOKEN } from '@etoro/common/infra/translations';
import { useCallback, useRef } from 'react';
import { interpolate, runOnJS, useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';

/** Threshold in pixels for determining scroll position at edges */
const EDGE_THRESHOLD = 1;

/** Which scroll edge is visible before the user scrolls (when content overflows). */
export type ScrollFadeInitialAnchor = 'start' | 'end';

function computeFadeOpacities(scrollX: number, maxScrollX: number): { startOpacity: number; endOpacity: number } {
  const startOpacity = Math.min(1, Math.max(0, scrollX / 20));
  const endOpacity = Math.min(1, Math.max(0, (maxScrollX - scrollX) / 20));
  return { startOpacity, endOpacity };
}

/**
 * Hook to manage scroll fade overlays with overflow detection and RTL support.
 * Uses Reanimated SharedValues for 60fps smooth animations on the UI thread.
 *
 * Returns:
 * - `startFadeOpacity` / `endFadeOpacity`: SharedValues (0-1) for fade overlay opacity
 * - `scrollOffsetX`: SharedValue tracking the live horizontal offset, seeded with
 *   `initialScrollOffsetX` for rails mounted at a restored position
 * - `scrollHandler`: Animated scroll handler for Animated.ScrollView
 * - `handleContentSizeChange`: Callback for ScrollView's onContentSizeChange
 * - `handleLayout`: Callback for container's onLayout
 * - `applyScrollFade`: Sync fade opacity after programmatic scroll (no onScroll event)
 */
export function useScrollFade(initialAnchor: ScrollFadeInitialAnchor = 'start', onScrollX?: (offsetX: number) => void, initialScrollOffsetX = 0) {
  // SharedValues for smooth UI-thread animations
  const startFadeOpacity = useSharedValue(0);
  const endFadeOpacity = useSharedValue(0);
  // Mirrors the offset on the UI thread so readers that only need it on demand
  // can poll it instead of paying a `runOnJS` hop on every scroll frame. Seeded
  // from the restored offset: a `contentOffset` mount suppresses the first
  // `onScroll`, so nothing else would report where the rail actually starts.
  const scrollOffsetX = useSharedValue(initialScrollOffsetX);
  // Tracks whether a real native scroll event has ever reported `scrollOffsetX`.
  // A fresh RTL rail natively rests at the *right* edge (contentOffset.x ===
  // contentWidth - layoutWidth) without ever firing `onScroll` to say so — so
  // consumers (e.g. scroll-into-view) must not trust `scrollOffsetX`'s LTR-only
  // `0` default as "the rail is scrolled to its start" until this flips true.
  const hasScrolledValue = useSharedValue(false);
  const onScrollXRef = useRef(onScrollX);
  onScrollXRef.current = onScrollX;

  // Use refs to track dimensions (avoids stale closure issues)
  const dimensionsRef = useRef({ contentWidth: 0, layoutWidth: 0 });

  const localizationService = etInject(LOCALIZATION_LANGUAGE_MANAGER_TOKEN);
  const isRTL = localizationService.getCurrentDirection() === 'rtl';

  /**
   * Updates fade opacity based on current dimensions.
   * Called whenever either dimension changes to ensure initial state is correct.
   */
  const updateInitialFadeState = () => {
    const { contentWidth, layoutWidth } = dimensionsRef.current;

    // Only update if both dimensions are valid
    if (contentWidth <= 0 || layoutWidth <= 0) return;

    const hasOverflow = contentWidth > layoutWidth + EDGE_THRESHOLD;

    if (hasOverflow) {
      // Content overflows — show fade on the edge that still has hidden content.
      if (initialAnchor === 'end') {
        if (isRTL) {
          startFadeOpacity.value = 0;
          endFadeOpacity.value = 1;
        } else {
          startFadeOpacity.value = 1;
          endFadeOpacity.value = 0;
        }
      } else if (isRTL) {
        startFadeOpacity.value = 1;
        endFadeOpacity.value = 0;
      } else {
        startFadeOpacity.value = 0;
        endFadeOpacity.value = 1;
      }
    } else {
      // No overflow - hide both fades
      startFadeOpacity.value = 0;
      endFadeOpacity.value = 0;
    }
  };

  /**
   * Animated scroll handler - runs on UI thread for 60fps performance.
   * Computes fade opacity based on scroll position.
   */
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      'worklet';
      // Handle both Reanimated format (no nativeEvent) and test mock format (with nativeEvent)
      const scrollEvent = (event as any).nativeEvent ?? event;
      const { contentOffset, contentSize, layoutMeasurement } = scrollEvent;
      const maxScrollX = contentSize.width - layoutMeasurement.width;
      const hasOverflow = maxScrollX > EDGE_THRESHOLD;

      hasScrolledValue.value = true;
      scrollOffsetX.value = contentOffset.x;

      if (!hasOverflow) {
        startFadeOpacity.value = 0;
        endFadeOpacity.value = 0;
        return;
      }

      const scrollX = contentOffset.x;

      if (onScrollXRef.current) {
        runOnJS(onScrollXRef.current)(scrollX);
      }

      // Calculate opacity based on distance from edge (0-20px range for smooth fade)
      const startOpacity = interpolate(scrollX, [0, 20], [0, 1], 'clamp');
      const endOpacity = interpolate(scrollX, [maxScrollX - 20, maxScrollX], [1, 0], 'clamp');

      // In RTL, scroll direction is reversed
      if (isRTL) {
        startFadeOpacity.value = endOpacity; // "Start" is visual right in RTL
        endFadeOpacity.value = startOpacity; // "End" is visual left in RTL
      } else {
        startFadeOpacity.value = startOpacity;
        endFadeOpacity.value = endOpacity;
      }
    },
  });

  /**
   * Updates content width and re-evaluates fade state.
   * Called from ScrollView's onContentSizeChange.
   */
  const handleContentSizeChange = (width: number) => {
    dimensionsRef.current.contentWidth = width;
    updateInitialFadeState();
  };

  /**
   * Updates layout width and re-evaluates fade state.
   * Called on container layout changes.
   */
  const handleLayout = (event: { nativeEvent: { layout: { width: number } } }) => {
    const { width } = event.nativeEvent.layout;
    dimensionsRef.current.layoutWidth = width;
    updateInitialFadeState();
  };

  const applyScrollFade = useCallback(
    (scrollX: number) => {
      const { contentWidth, layoutWidth } = dimensionsRef.current;
      if (contentWidth <= 0 || layoutWidth <= 0) {
        return;
      }

      const maxScrollX = contentWidth - layoutWidth;
      if (maxScrollX <= EDGE_THRESHOLD) {
        startFadeOpacity.value = 0;
        endFadeOpacity.value = 0;
        return;
      }

      const { startOpacity, endOpacity } = computeFadeOpacities(scrollX, maxScrollX);

      if (isRTL) {
        startFadeOpacity.value = endOpacity;
        endFadeOpacity.value = startOpacity;
      } else {
        startFadeOpacity.value = startOpacity;
        endFadeOpacity.value = endOpacity;
      }
    },
    [endFadeOpacity, isRTL, startFadeOpacity],
  );

  return {
    startFadeOpacity,
    endFadeOpacity,
    scrollOffsetX,
    hasScrolledValue,
    scrollHandler,
    handleContentSizeChange,
    handleLayout,
    applyScrollFade,
    isRTL,
  };
}
