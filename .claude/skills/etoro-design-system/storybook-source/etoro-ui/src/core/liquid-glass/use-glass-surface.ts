import { Platform } from 'react-native';

import { clampAndroidDimezisBlurIntensity } from '../../utils/android-blur-intensity';
import { useEtoroTheme } from '../hooks/use-etoro-theme';
import { useLiquidGlass } from './use-liquid-glass';

/** Blur props applied to ambient glass surfaces (tab bar, Tori FABs, sheets) on non-Liquid-Glass platforms. */
export type GlassSurfaceBlurProps = {
  intensity: number;
  tint: 'dark' | 'light';
  blurReductionFactor?: number;
  experimentalBlurMethod?: 'dimezisBlurView';
};

const ANDROID_DARK_BLUR_PROPS: GlassSurfaceBlurProps = {
  blurReductionFactor: 1,
  experimentalBlurMethod: 'dimezisBlurView',
  intensity: 95,
  tint: 'dark',
};
const ANDROID_LIGHT_BLUR_PROPS: GlassSurfaceBlurProps = {
  blurReductionFactor: 2,
  experimentalBlurMethod: 'dimezisBlurView',
  intensity: 58,
  tint: 'light',
};
const DEFAULT_DARK_BLUR_PROPS: GlassSurfaceBlurProps = {
  intensity: 32,
  tint: 'dark',
};
// Light mode needs a light blur tint, otherwise the non-Liquid-Glass surface renders as a dark gray slab.
const DEFAULT_LIGHT_BLUR_PROPS: GlassSurfaceBlurProps = {
  intensity: 32,
  tint: 'light',
};
// On non-Liquid-Glass platforms the surface is a low-intensity blur, which looks very transparent.
// A semi-opaque scrim over the blur keeps a hint of blur while making the surface more solid.
// Android light mode needs a brighter white treatment so it doesn't read as gray/heavy.
const SCRIM_OPACITY = 0.4;
const SCRIM_OPACITY_ANDROID_LIGHT = 0.3;
// Neutral gray fallback made the Android light-mode surface look muddy.
// Use a white fill there while preserving the subtler default fallback elsewhere.
const DEFAULT_LIGHT_FALLBACK_BACKGROUND = 'rgba(0,0,0,0.08)';
const ANDROID_LIGHT_FALLBACK_BACKGROUND = 'rgba(255,255,255,0.76)';

export interface GlassSurface {
  supportsLiquidGlass: boolean;
  /** Blur rendered as the base of the surface on non-Liquid-Glass platforms. */
  blurProps: GlassSurfaceBlurProps;
  /** Solid fill rendered behind the blur on non-Liquid-Glass platforms. */
  fallbackBackgroundColor: string;
  /** Color of the scrim layered over the blur on non-Liquid-Glass platforms. */
  scrimColor: string;
  /** Opacity of the scrim layered over the blur on non-Liquid-Glass platforms. */
  scrimOpacity: number;
}

/**
 * Shared glass-surface recipe for ambient chrome (bottom tab bar, Tori FABs,
 * signal sheet). On Liquid Glass devices consumers render the native glass and
 * ignore the fallback values; everywhere else they layer, bottom to top:
 * `fallbackBackgroundColor` fill → `blurProps` BlurView → `scrimColor` at
 * `scrimOpacity`. Centralized here so every Tori/tab-bar glass surface stays
 * visually consistent across platforms and themes.
 */
export function useGlassSurface(): GlassSurface {
  const { colors, dark: isDarkMode } = useEtoroTheme();
  const { supportsLiquidGlass } = useLiquidGlass();

  const blurProps = isDarkMode
    ? Platform.OS === 'android'
      ? ANDROID_DARK_BLUR_PROPS
      : DEFAULT_DARK_BLUR_PROPS
    : Platform.OS === 'android'
      ? ANDROID_LIGHT_BLUR_PROPS
      : DEFAULT_LIGHT_BLUR_PROPS;

  const safeIntensity = clampAndroidDimezisBlurIntensity(blurProps.intensity, blurProps.blurReductionFactor);
  const safeBlurProps: GlassSurfaceBlurProps = safeIntensity === blurProps.intensity ? blurProps : { ...blurProps, intensity: safeIntensity };

  const fallbackBackgroundColor = !isDarkMode
    ? Platform.OS === 'android'
      ? ANDROID_LIGHT_FALLBACK_BACKGROUND
      : DEFAULT_LIGHT_FALLBACK_BACKGROUND
    : colors.bgButtonGroupPressed;

  const scrimOpacity = Platform.OS === 'android' && !supportsLiquidGlass && !isDarkMode ? SCRIM_OPACITY_ANDROID_LIGHT : SCRIM_OPACITY;

  return { supportsLiquidGlass, blurProps: safeBlurProps, fallbackBackgroundColor, scrimColor: colors.bgNeutralSecondary, scrimOpacity };
}
