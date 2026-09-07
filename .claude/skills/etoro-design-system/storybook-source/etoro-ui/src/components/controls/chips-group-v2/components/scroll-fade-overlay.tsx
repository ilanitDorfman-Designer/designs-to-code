import { etInject } from '@etoro/common/di/core';
import { LOCALIZATION_LANGUAGE_MANAGER_TOKEN } from '@etoro/common/infra/translations';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';
import Animated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';

import { useEtoroTheme } from '../../../../core/hooks/use-etoro-theme';
import { makeTransparent } from '../../../../core/styles/color.utils';
import { X16 } from '../../../../core/styles/spacing';

interface ScrollFadeOverlayProps {
  /** Opacity value (0-1) as a SharedValue for smooth UI-thread animation */
  opacity: SharedValue<number>;
  /** Position of the overlay: 'start' (left in LTR, right in RTL) or 'end' */
  position: 'start' | 'end';
  /**
   * Background color for the fade gradient.
   * Use this when the component is placed on a non-white background.
   * Defaults to theme's bgNeutralPrimary.
   */
  fadeColor?: string;
  /** Test ID for testing */
  testID?: string;
}

/**
 * Fade overlay component for scroll indication.
 * Automatically handles RTL layout and uses theme-based gradients
 * that adapt to light/dark mode.
 *
 * Uses SharedValue for opacity to enable 60fps animations on the UI thread.
 */
export function ScrollFadeOverlay({ opacity, position, fadeColor, testID }: ScrollFadeOverlayProps) {
  const { colors } = useEtoroTheme();
  const localizationService = etInject(LOCALIZATION_LANGUAGE_MANAGER_TOKEN);
  const isRTL = localizationService.getCurrentDirection() === 'rtl';

  // Animated opacity style - runs on UI thread for smooth 60fps animation
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  // Determine visual position (flip for RTL)
  const visualPosition = isRTL ? (position === 'start' ? 'right' : 'left') : position === 'start' ? 'left' : 'right';

  // Use provided fadeColor or fall back to theme's primary background
  const solidColor = fadeColor ?? colors.backgroundBase;
  const transparentColor = makeTransparent(solidColor);

  // Gradient: solid at edge -> transparent across most of the overlay.
  // A longer ramp makes chip-scroll overflow more visible without adding a hard edge.
  const gradientColors: [string, string, string] =
    visualPosition === 'left' ? [solidColor, transparentColor, transparentColor] : [transparentColor, transparentColor, solidColor];
  const gradientLocations: [number, number, number] = visualPosition === 'left' ? [0, 0.75, 1] : [0, 0.25, 1];

  return (
    <Animated.View
      style={[styles.overlay, visualPosition === 'left' ? styles.left : styles.right, animatedStyle]}
      pointerEvents="none"
      testID={testID}
    >
      <LinearGradient
        colors={gradientColors}
        locations={gradientLocations}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={StyleSheet.absoluteFill}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: X16,
    zIndex: 1,
  },
  left: { left: 0 },
  right: { right: 0 },
});
