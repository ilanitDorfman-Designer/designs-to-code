import { useRef } from 'react';
import { I18nManager } from 'react-native';
import { interpolate, useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';

/** Threshold in pixels for determining scroll position at edges */
const EDGE_THRESHOLD = 1;

/**
 * Hook to manage scroll fade overlays with overflow detection and RTL support.
 * Uses Reanimated SharedValues for 60fps smooth animations on the UI thread.
 *
 * Based on the chips-group-v2 pattern, adapted for tabs.
 *
 * Returns:
 * - `startFadeOpacity` / `endFadeOpacity`: SharedValues (0-1) for fade overlay opacity
 * - `scrollHandler`: Animated scroll handler for Animated.ScrollView
 * - `handleContentSizeChange`: Callback for ScrollView's onContentSizeChange
 * - `handleLayout`: Callback for container's onLayout
 */
export function useScrollFade() {
  // SharedValues for smooth UI-thread animations
  const startFadeOpacity = useSharedValue(0);
  const endFadeOpacity = useSharedValue(0);

  // Use refs to track dimensions (avoids stale closure issues)
  const dimensionsRef = useRef({ contentWidth: 0, layoutWidth: 0 });

  const isRTL = I18nManager.isRTL;

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
      // Content overflows - show end fade (or start fade in RTL)
      if (isRTL) {
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

      if (!hasOverflow) {
        startFadeOpacity.value = 0;
        endFadeOpacity.value = 0;
        return;
      }

      const scrollX = contentOffset.x;

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

  return {
    startFadeOpacity,
    endFadeOpacity,
    scrollHandler,
    handleContentSizeChange,
    handleLayout,
    isRTL,
  };
}
