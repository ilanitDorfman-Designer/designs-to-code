import { useEffect } from 'react';
import { Easing, interpolate, interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

interface UseInputAnimationsProps {
  isFocused: boolean;
  value: string;
  hasError: boolean;
  hasPrefix: boolean;
  prefixWidth?: number;
  errorBorderColor: string;
  defaultBorderColor: string;
  filledInputBorderColor?: string;
}

export function useInputAnimations({
  isFocused,
  value,
  hasError,
  hasPrefix,
  prefixWidth = 32, // Default for 20px icon (20px + 6px gap)
  errorBorderColor,
  defaultBorderColor,
  filledInputBorderColor,
}: UseInputAnimationsProps) {
  // Shared values for animations - start elevated for initial animation
  const labelAnim = useSharedValue(1);
  const borderColorAnim = useSharedValue(0);

  useEffect(() => {
    // Animate the label when focused or if there is existing text
    labelAnim.value = withTiming(isFocused || value !== '' ? 1 : 0, {
      duration: 200,
      easing: Easing.out(Easing.ease),
    });
  }, [isFocused, value, labelAnim]);

  useEffect(() => {
    // Animate border color: 0 = default, 1 = filled, 2 = error
    const targetValue = hasError ? 2 : value ? 1 : 0;
    borderColorAnim.value = withTiming(targetValue, {
      duration: 200,
    });
  }, [hasError, value, borderColorAnim]);

  // Animated style for the floating label
  const animatedLabelStyle = useAnimatedStyle(() => {
    const translateY = interpolate(labelAnim.value, [0, 1], [18, -2]);
    const fontSize = interpolate(labelAnim.value, [0, 1], [20, 14]);

    /**
     * If hasPrefix, animate horizontal shift based on prefixWidth.
     * prefixWidth = iconSize + gap
     * E.g. 20px icon: 32px (20px icon + 12px gap), 24px icon: 36px (24px icon + 12px gap)
     */
    const translateX = hasPrefix
      ? interpolate(
          labelAnim.value,
          [0, 1],
          [prefixWidth, 0], // shift when unfocused, edge when focused
        )
      : 0;

    return {
      transform: [{ translateX }, { translateY }],
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
  });

  return {
    animatedLabelStyle,
    animatedBorderStyle,
  };
}
