import { Easing, FadeInLeft } from 'react-native-reanimated';

import { ANIMATION_CONFIG } from '../../../../foundations/animated-digits/animations/constants';

/**
 * Entering animation applied to the progress fill when `fillEntering` is enabled.
 * Slides + fades the filled portion in from the left.
 */
export const progressFillEntering = FadeInLeft.delay(50).duration(ANIMATION_CONFIG.FADE_DURATION);

/**
 * Timing used when the fill slides toward a new width. An ease-out curve so the
 * fill decelerates as it settles. Used by the plain (single) line variant.
 */
export const progressFillTimingConfig = {
  duration: ANIMATION_CONFIG.FADE_DURATION,
  easing: Easing.out(Easing.cubic),
} as const;

/** Duration (ms) a single section/line takes to slide to its target width. */
export const PROGRESS_FILL_DURATION = ANIMATION_CONFIG.FADE_DURATION;

/**
 * Total time (ms) the whole sectioned sweep takes, independent of how many
 * sections there are. Each section animates over a proportional slice of this
 * budget so the filled portion crosses every section at one constant speed —
 * the row reads as a single continuous line instead of jumping per section.
 */
export const PROGRESS_SECTIONED_SWEEP_DURATION = ANIMATION_CONFIG.FADE_DURATION;

/**
 * Linear easing for sectioned fills. Each section moves at the same constant
 * speed, so there is no per-section deceleration that would make the sweep
 * stutter at the gaps between sections.
 */
export const progressFillLinearEasing = Easing.linear;
