import { useEffect } from 'react';
import { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { calculateRequiredWidth, containerWidthConfig, getDigitWidth } from '../utils';

export const useContainerWidth = (digits: number[], fontSize: number) => {
  // Animated container width based on digit count
  const containerWidth = useSharedValue(0);

  // Initialize container width
  // useEffect(() => {
  //   const digitWidth = getDigitWidth(fontSize);
  //   const initialWidth = calculateRequiredWidth(digits.length, digitWidth);
  //   containerWidth.value = initialWidth;
  // }, [containerWidth, digits, fontSize]); // Only on mount

  // Update container width when digit count changes
  useEffect(() => {
    const digitWidth = getDigitWidth(fontSize);
    const requiredWidth = calculateRequiredWidth(digits.length, digitWidth);

    // Slight delay to coordinate with digit animations
    const timer = setTimeout(() => {
      containerWidth.value = withSpring(requiredWidth, containerWidthConfig);
    }, 0); // Small delay for better coordination

    return () => clearTimeout(timer);
  }, [digits, fontSize, containerWidth]);

  // Animated style for container width
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    width: containerWidth.value,
  }));

  return {
    containerAnimatedStyle,
  };
};
