import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import type { JSX } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { useEtoroTheme } from '../hooks/use-etoro-theme';
import { makeTransparent } from '../styles/color.utils';
import type { GlassSurfaceBlurProps } from './use-glass-surface';

/**
 * Density of the Android surface. A flat base layer carries most of the opacity — content behind
 * the surface should be *hinted at*, never readable (the blur it replaces obscured it almost
 * fully) — and a subtle gradient on top keeps the progressive "heavier at the base" depth cue,
 * mirroring `EtProgressivePageBlur`'s Android treatment. Consumers still layer their scrim above
 * this, so effective coverage is higher than these numbers alone.
 */
const ANDROID_BASE_OPACITY_DARK = 0.94;
const ANDROID_BASE_OPACITY_LIGHT = 0.9;
const ANDROID_FADE_OPACITY = 0.12;

export interface GlassSurfaceBlurLayerProps {
  /** The `blurProps` from {@link useGlassSurface} — consumed by the iOS BlurView branch. */
  blurProps: GlassSurfaceBlurProps;
}

/**
 * The middle layer of a non-Liquid-Glass surface (`fallbackBackgroundColor` fill → this →
 * scrim). On iOS it is the real backdrop `BlurView`. On Android it is a progressive-transparency
 * gradient instead: `dimezisBlurView` re-captures and re-blurs everything beneath the surface on
 * every draw, which made the permanently-mounted tab bar and Tori FAB the most expensive views in
 * the app during any scroll (PAH-835). The gradient composites at the cost of a plain view and
 * follows the precedent set by `EtProgressivePageBlur` / the Tori sheet backdrop, which already
 * swap blur for a gradient fade on Android.
 */
export function GlassSurfaceBlurLayer({ blurProps }: GlassSurfaceBlurLayerProps): JSX.Element {
  const { colors, dark: isDarkMode } = useEtoroTheme();

  if (Platform.OS !== 'android') {
    return <BlurView {...blurProps} style={StyleSheet.absoluteFillObject} pointerEvents="none" />;
  }

  const base = colors.bgNeutralSecondary;
  const baseOpacity = isDarkMode ? ANDROID_BASE_OPACITY_DARK : ANDROID_BASE_OPACITY_LIGHT;
  return (
    <>
      <View pointerEvents="none" style={[StyleSheet.absoluteFillObject, { backgroundColor: base, opacity: baseOpacity }]} />
      <LinearGradient
        colors={[makeTransparent(base), base]}
        style={[StyleSheet.absoluteFillObject, { opacity: ANDROID_FADE_OPACITY }]}
        pointerEvents="none"
      />
    </>
  );
}
