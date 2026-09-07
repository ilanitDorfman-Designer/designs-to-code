import { Platform } from 'react-native';

/** RenderScript blur (Android API < 31) only accepts radius in (0, 25]. */
export const ANDROID_RENDER_SCRIPT_MAX_BLUR_RADIUS = 25;

/** Matches expo-blur's default `blurReductionFactor` on Android. */
export const EXPO_BLUR_DEFAULT_REDUCTION_FACTOR = 4;

/** Android 12 (API 31) switched Dimezis BlurView from RenderScript to RenderEffect. */
export const ANDROID_RENDER_EFFECT_MIN_API = 31;

/**
 * Clamps `intensity` for `expo-blur` + `dimezisBlurView` on Android API < 31.
 * Native code passes `intensity / blurReductionFactor` to RenderScript, which crashes above 25.
 */
export function clampAndroidDimezisBlurIntensity(intensity: number, blurReductionFactor: number = EXPO_BLUR_DEFAULT_REDUCTION_FACTOR): number {
  if (Platform.OS !== 'android' || Platform.Version >= ANDROID_RENDER_EFFECT_MIN_API) {
    return intensity;
  }

  const maxIntensity = ANDROID_RENDER_SCRIPT_MAX_BLUR_RADIUS * blurReductionFactor;
  return Math.min(intensity, maxIntensity);
}
