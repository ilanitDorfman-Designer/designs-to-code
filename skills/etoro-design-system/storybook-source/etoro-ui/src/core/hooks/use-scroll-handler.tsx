import {
  interpolate,
  SharedValue,
  useAnimatedReaction,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { HEADER_HEIGHT } from '../styles/constants';

/** @internal - Used by EtScreen, not typically needed by consumers */
export type AnimationType = 'fade' | 'collapse' | 'none';

interface UseScrollHandlerProps {
  /**
   * Optional external scrollY shared value to use instead of creating a new one.
   * When provided, the hook will update this shared value instead of creating its own.
   * This allows synchronizing multiple scroll-driven animations.
   */
  externalScrollY?: SharedValue<number>;
  /**
   * Minimum scroll distance in pixels to trigger direction change (prevents micro-bounces)
   * @default 5
   */
  threshold?: number;
  /**
   * Duration of direction-based animations in milliseconds
   * @default 300
   */
  animationDuration?: number;
  /**
   * Minimum scroll position before animations start (ensures expanded state at top)
   * @default 10
   */
  minScrollPosition?: number;
  /**
   * Enable direction tracking. When true, returns a `direction` SharedValue
   * that animates between 0 (scrolling down) and 1 (scrolling up).
   * @default true
   */
  enableDirectionTracking?: boolean;

  // Internal props (used by EtScreen, not typically needed by consumers)
  /** @internal */
  animationType?: AnimationType;
}

interface UseScrollHandlerReturn {
  /**
   * Scroll event handler to attach to your ScrollView
   * @example <ScrollView onScroll={handleScroll} />
   */
  handleScroll: ReturnType<typeof useAnimatedScrollHandler>;
  /**
   * Animated style for the top bar (used internally by EtScreen)
   */
  animatedHeaderStyle: ReturnType<typeof useAnimatedStyle>;
  /**
   * Shared value tracking scroll position
   */
  scrollY: SharedValue<number>;
  /**
   * Direction-based animated value (0 = scrolling down/collapsed, 1 = scrolling up/expanded)
   * Only available when enableDirectionTracking is true
   */
  direction: SharedValue<number>;
}

/**
 * Hook for managing scroll-driven animations with optional direction tracking.
 *
 * This hook provides:
 * - Scroll position tracking (scrollY)
 * - Scroll event handler (handleScroll)
 * - Direction-based animated value (direction)
 *
 * The direction value animates smoothly between:
 * - 1 = scrolling up or at top (expanded/visible)
 * - 0 = scrolling down (collapsed/hidden)
 *
 * @example
 * // Basic usage - just scroll tracking
 * const { scrollY, handleScroll } = useScrollHandler();
 *
 * @example
 * // With direction tracking for custom animations (recommended)
 * const { scrollY, handleScroll, direction } = useScrollHandler({
 *   threshold: 5,
 *   animationDuration: 300,
 *   minScrollPosition: 10,
 * });
 *
 * // Use direction for any animation
 * const animatedOpacity = useAnimatedStyle(() => ({
 *   opacity: direction.value
 * }));
 *
 * const animatedPadding = useAnimatedStyle(() => ({
 *   paddingTop: interpolate(direction.value, [0, 1], [40, 100])
 * }));
 *
 * @example
 * // With external scrollY for advanced use cases
 * const externalScrollY = useSharedValue(0);
 * const { handleScroll, direction } = useScrollHandler({
 *   externalScrollY,
 * });
 */
export function useScrollHandler({
  animationType = 'collapse',
  externalScrollY,
  threshold = 5,
  animationDuration = 300,
  minScrollPosition = 10,
  enableDirectionTracking = true,
}: UseScrollHandlerProps = {}): UseScrollHandlerReturn {
  const internalScrollY = useSharedValue(0);

  // Use external scrollY if provided, otherwise use internal
  const scrollY = externalScrollY || internalScrollY;

  // Direction tracking (0 = collapsed/hidden, 1 = expanded/visible)
  const directionValue = useSharedValue(1);
  const lastScrollY = useSharedValue(0);
  const lastDirection = useSharedValue(0); // Track last scroll direction (1 = down, -1 = up)

  useAnimatedReaction(
    () => scrollY.get(),
    (currentY, previousY) => {
      'worklet';

      if (!enableDirectionTracking) {
        return;
      }

      // Don't animate if we're at the very top
      if (currentY < minScrollPosition) {
        directionValue.set(withTiming(1, { duration: animationDuration }));
        lastDirection.set(0);
        return;
      }

      const diff = currentY - (previousY ?? 0);

      // Filter out micro-movements
      if (Math.abs(diff) < threshold) {
        return;
      }

      // Detect direction reversal (potential bounce)
      const currentDirection = diff > 0 ? 1 : -1;
      const isReversal = lastDirection.get() !== 0 && currentDirection !== lastDirection.get();

      // If this is a reversal and it's happening rapidly (likely a bounce),
      // require a larger movement threshold to confirm the direction change
      if (isReversal) {
        const bounceThreshold = threshold * 4;

        if (Math.abs(diff) < bounceThreshold) {
          // Not enough movement to confirm reversal - ignore it
          return;
        }
      }

      lastDirection.set(currentDirection);
      lastScrollY.set(currentY);

      if (diff > 0) {
        // Scrolling down - collapse/hide (animate to 0)
        directionValue.set(withTiming(0, { duration: animationDuration }));
      } else if (diff < 0) {
        // Scrolling up - expand/show (animate to 1)
        directionValue.set(withTiming(1, { duration: animationDuration }));
      }
    },
    [threshold, animationDuration, minScrollPosition, enableDirectionTracking],
  );

  const handleScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      const currentY = event.contentOffset.y;
      scrollY.set(currentY);
    },
  });

  const animatedHeaderStyle = useAnimatedStyle(() => {
    if (animationType === 'fade') {
      return {
        opacity: directionValue.get(),
      };
    } else if (animationType === 'collapse') {
      return {
        transform: [
          {
            translateY: interpolate(directionValue.get(), [0, 1], [-HEADER_HEIGHT, 0]),
          },
        ],
      };
    }
    return {};
  });

  return {
    handleScroll,
    animatedHeaderStyle,
    scrollY,
    direction: directionValue,
  };
}
