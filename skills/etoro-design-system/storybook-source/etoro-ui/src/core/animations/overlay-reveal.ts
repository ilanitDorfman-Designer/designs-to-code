import { Extrapolation, interpolate, type SharedValue, useAnimatedStyle } from 'react-native-reanimated';

/** Scroll offset (px) at which the reveal starts ramping in. */
export const OVERLAY_REVEAL_APPEAR_START = 40;

/** Scroll offset (px) at which the reveal is fully in. */
export const OVERLAY_REVEAL_APPEAR_END = 80;

/** Initial vertical offset (px): the element starts slightly below and rises into place. */
const OVERLAY_REVEAL_TRANSLATE_Y = 10;

/** Initial scale: a subtle scale-up so the element settles in rather than snapping. */
const OVERLAY_REVEAL_SCALE = 0.92;

/**
 * Scroll-driven "rise in from slightly below" reveal — the Home page's compact-header
 * motion (opacity 0→1, translateY 10→0, scale 0.92→1 across the scroll band). Share it
 * between any scroll-pinned overlay element (compact summaries, ticker badges) so they
 * all reveal with the same motion.
 *
 * @param scrollY The screen's scroll position shared value.
 * @param revealOffset Extra scroll distance to add before the reveal starts.
 *
 * @example
 * ```tsx
 * const revealStyle = useOverlayRevealStyle(scrollY);
 * return <Animated.View style={[styles.container, revealStyle]}>{...}</Animated.View>;
 * ```
 */
export function useOverlayRevealStyle(scrollY: SharedValue<number>, revealOffset = 0) {
  return useAnimatedStyle(() => {
    const range = [OVERLAY_REVEAL_APPEAR_START + revealOffset, OVERLAY_REVEAL_APPEAR_END + revealOffset];
    return {
      opacity: interpolate(scrollY.get(), range, [0, 1], Extrapolation.CLAMP),
      transform: [
        { translateY: interpolate(scrollY.get(), range, [OVERLAY_REVEAL_TRANSLATE_Y, 0], Extrapolation.CLAMP) },
        { scale: interpolate(scrollY.get(), range, [OVERLAY_REVEAL_SCALE, 1], Extrapolation.CLAMP) },
      ],
    };
  });
}
