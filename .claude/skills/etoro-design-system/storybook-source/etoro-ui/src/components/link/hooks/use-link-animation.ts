import { useCallback } from 'react';
import { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const SPRING_CONFIG = {
  damping: 15,
  stiffness: 300,
};

const PRESSED_SCALE = 0.95;
const DEFAULT_SCALE = 1;

/**
 * Hook to manage link press animation
 * Provides scale animation between enabled and pressed states
 */
export function useLinkAnimation() {
  const scale = useSharedValue(DEFAULT_SCALE);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(PRESSED_SCALE, SPRING_CONFIG);
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(DEFAULT_SCALE, SPRING_CONFIG);
  }, [scale]);

  return {
    animatedStyle,
    handlePressIn,
    handlePressOut,
  };
}
