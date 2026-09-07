import { useEffect } from 'react';
import { Easing, interpolate, interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

interface UseTimepickerAnimationsProps {
  isFocused: boolean;
  hasValue: boolean;
  hasError: boolean;
  errorBorderColor: string;
  defaultBorderColor: string;
  filledInputBorderColor?: string;
}

export function useTimepickerAnimations({
  isFocused,
  hasValue,
  hasError,
  errorBorderColor,
  defaultBorderColor,
  filledInputBorderColor,
}: UseTimepickerAnimationsProps) {
  // Shared values for animations
  const labelAnim = useSharedValue(hasValue ? 1 : 0);
  const borderColorAnim = useSharedValue(hasError ? 2 : hasValue ? 1 : 0);

  useEffect(() => {
    // Animate the label when focused or if there is existing value
    labelAnim.value = withTiming(isFocused || hasValue ? 1 : 0, {
      duration: 200,
      easing: Easing.out(Easing.ease),
    });
  }, [isFocused, labelAnim, hasValue]);

  useEffect(() => {
    // Animate border color: 0 = default, 1 = filled, 2 = error
    const targetValue = hasError ? 2 : hasValue ? 1 : 0;
    borderColorAnim.value = withTiming(targetValue, {
      duration: 200,
    });
  }, [hasError, borderColorAnim, hasValue]);

  // Animated style for the floating label container (transform)
  const animatedLabelContainerStyle = useAnimatedStyle(() => {
    const translateY = interpolate(labelAnim.value, [0, 1], [18, -2]);

    return {
      transform: [{ translateY }],
    };
  });

  // Animated style for the floating label text (fontSize)
  const animatedLabelTextStyle = useAnimatedStyle(() => {
    const fontSize = interpolate(labelAnim.value, [0, 1], [20, 14]);

    return {
      fontSize,
    };
  });

  // Animated style for the border color with smooth transitions
  const animatedBorderStyle = useAnimatedStyle(() => {
    const borderBottomColor = interpolateColor(
      borderColorAnim.value,
      [0, 1, 2],
      [defaultBorderColor, filledInputBorderColor || defaultBorderColor, errorBorderColor],
    );

    return {
      borderBottomColor,
    };
  }, [defaultBorderColor, filledInputBorderColor, errorBorderColor]);

  return {
    animatedLabelContainerStyle,
    animatedLabelTextStyle,
    animatedBorderStyle,
  };
}
