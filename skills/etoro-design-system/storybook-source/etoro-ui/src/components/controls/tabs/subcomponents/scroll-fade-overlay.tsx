import { LinearGradient } from 'expo-linear-gradient';
import { I18nManager, StyleSheet } from 'react-native';
import Animated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';

import { useEtoroTheme } from '../../../../core/hooks/use-etoro-theme';
import { X3, X12 } from '../../../../core/styles/spacing';

interface ScrollFadeOverlayProps {
  /** Opacity value (0-1) as a SharedValue for smooth UI-thread animation */
  opacity: SharedValue<number>;
  /** Position of the overlay: 'start' (left in LTR, right in RTL) or 'end' */
  position: 'start' | 'end';
  /**
   * Gradient color pair [solid, transparent] for fade overlays.
   * The solid color should match the container background;
   * the transparent color should be the same hue with alpha 0.
   * Defaults to theme-appropriate values per light/dark mode.
   * @example fadeColors={[colors.bgGreyPrimary, '#E5E5E500']}
   */
  fadeColors?: [string, string];
  /** Test ID for testing */
  testID?: string;
}

/**
 * Fade overlay component for tab scroll indication.
 * Automatically handles RTL layout and uses theme-based gradients
 * that adapt to light/dark mode.
 *
 * Customized for tabs: the overlay leaves the bottom area uncovered
 * so the divider and indicator lines remain visible.
 *
 * Uses SharedValue for opacity to enable 60fps animations on the UI thread.
 */
export function ScrollFadeOverlay({ opacity, position, fadeColors, testID }: ScrollFadeOverlayProps) {
  const { colors } = useEtoroTheme();
  const isRTL = I18nManager.isRTL;

  // Animated opacity style - runs on UI thread for smooth 60fps animation
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  // Determine visual position (flip for RTL)
  const visualPosition = isRTL ? (position === 'start' ? 'right' : 'left') : position === 'start' ? 'left' : 'right';

  // Use provided color pair or fall back to theme defaults
  const [solidColor, transparentColor] = fadeColors ?? [colors.backgroundBase, `${colors.backgroundBase}00`];

  // Gradient direction: solid at edge, transparent toward center
  const gradientColors: [string, string] = visualPosition === 'left' ? [solidColor, transparentColor] : [transparentColor, solidColor];

  return (
    <Animated.View
      style={[styles.overlay, visualPosition === 'left' ? styles.left : styles.right, animatedStyle]}
      pointerEvents="none"
      testID={testID}
    >
      <LinearGradient colors={gradientColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: X3,
    width: X12,
    zIndex: 1,
  },
  left: { left: 0 },
  right: { right: 0 },
});
