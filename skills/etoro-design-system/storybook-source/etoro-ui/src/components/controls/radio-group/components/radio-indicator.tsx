import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { interpolate, interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { useEtoroTheme } from '../../../../core/hooks';
import { ANIMATION_DURATION, EASING } from '../../checkbox/utils/animation-constants';
import { RadioIndicatorProps } from '../api/types';
import { getRadioColors } from '../utils/get-radio-colors';

// Constants for radio button dimensions
const RADIO_SIZE = 20;
const INNER_CIRCLE_SIZE = 14;
const BORDER_RADIUS = RADIO_SIZE / 2;

/**
 * RadioIndicator - Visual radio circle with animated states
 * Internal component used by RadioOption
 */
export function RadioIndicator({ selected, disabled, error }: RadioIndicatorProps) {
  const { colors: themeColors } = useEtoroTheme();
  const colors = getRadioColors(themeColors);

  // Animation value for inner circle (shows when selected)
  const animationValue = useSharedValue(selected ? 1 : 0);

  // Update animation when selected state changes
  useEffect(() => {
    animationValue.value = withTiming(selected ? 1 : 0, {
      duration: ANIMATION_DURATION,
      easing: EASING,
    });
  }, [selected, animationValue]);

  // Animated container style (border and background)
  const animatedContainerStyle = useAnimatedStyle(() => {
    // Background: transparent when not disabled, filled when disabled
    const backgroundColor = disabled ? colors.disabledBackground : 'transparent';

    // Border color logic:
    // - Error (and not selected): error color
    // - Disabled: disabled border color
    // - Selected: selected border color
    // - Default: unchecked color
    let borderColor: string;
    if (error && !selected) {
      borderColor = colors.error;
    } else if (disabled) {
      borderColor = colors.disabledBorder;
    } else {
      borderColor = interpolateColor(animationValue.value, [0, 1], [colors.unchecked, colors.selectedBorder]);
    }

    return {
      backgroundColor,
      borderColor,
    };
  }, [colors.unchecked, colors.selectedBorder, colors.error, colors.disabledBackground, colors.disabledBorder, disabled, error, selected]);

  // Animated inner circle style (scale in/out)
  const animatedInnerCircleStyle = useAnimatedStyle(() => {
    const scale = interpolate(animationValue.value, [0, 1], [0, 1]);
    const opacity = animationValue.value;

    return {
      transform: [{ scale }],
      opacity,
    };
  }, []);

  return (
    <Animated.View style={[styles.container, animatedContainerStyle]}>
      <Animated.View style={[styles.innerCircle, { backgroundColor: colors.selectedFill }, animatedInnerCircleStyle]} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: RADIO_SIZE,
    height: RADIO_SIZE,
    borderRadius: BORDER_RADIUS,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: INNER_CIRCLE_SIZE,
    height: INNER_CIRCLE_SIZE,
    borderRadius: INNER_CIRCLE_SIZE / 2,
  },
});

RadioIndicator.displayName = 'RadioIndicator';
