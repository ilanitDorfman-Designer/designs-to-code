import { Easing } from 'react-native-reanimated';

import { ANIMATION_CONFIG } from '../../../../foundations/animated-digits/animations/constants';

/**
 * Timing used when the fill slides toward a new width. An ease-out curve so
 * the fill decelerates as it settles (same feel as EtProgressV2's line fill).
 */
export const stepIndicatorFillTimingConfig = {
  duration: ANIMATION_CONFIG.FADE_DURATION,
  easing: Easing.out(Easing.cubic),
} as const;
