import { Platform } from 'react-native';

import { clampAndroidDimezisBlurIntensity } from '../../../utils/android-blur-intensity';

/** Matches preview-container / use-glass-surface — Android dimezis reads lighter than iOS. */
export const MEDIA_CARD_ANDROID_BLUR_REDUCTION_FACTOR = 2;

export type MediaCardBlurTint = 'dark' | 'default' | 'light';

export interface MediaCardBlurLayerProps {
  intensity: number;
  tint: MediaCardBlurTint;
  experimentalBlurMethod: 'dimezisBlurView';
  blurReductionFactor?: number;
}

/**
 * Resolves {@link BlurView} props for media-card glass layers.
 *
 * On Android, `dimezisBlurView` with `dark`/`default` frosts lighter than iOS — use
 * `default` tint + scrims for standard/dark surfaces. Preserve `light` tint for
 * bright surfaces (matches {@link useGlassSurface} Android light recipe).
 */
export function resolveMediaCardBlurLayerProps(
  iosIntensity: number,
  iosTint: MediaCardBlurTint,
  androidIntensity: number = iosIntensity,
): MediaCardBlurLayerProps {
  if (Platform.OS !== 'android') {
    return { intensity: iosIntensity, tint: iosTint, experimentalBlurMethod: 'dimezisBlurView' };
  }

  return {
    intensity: clampAndroidDimezisBlurIntensity(androidIntensity, MEDIA_CARD_ANDROID_BLUR_REDUCTION_FACTOR),
    tint: iosTint === 'light' ? 'light' : 'default',
    blurReductionFactor: MEDIA_CARD_ANDROID_BLUR_REDUCTION_FACTOR,
    experimentalBlurMethod: 'dimezisBlurView',
  };
}
