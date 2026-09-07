import { useCallback, useEffect } from 'react';
import { cancelAnimation, interpolateColor, useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated';

const ANIMATION_DURATION = 150;

/**
 * Hook for managing button press animation with smooth color transitions
 *
 * @param normalColor - Background color in normal state
 * @param pressedColor - Background color when pressed
 * @returns Animation handlers and animated style
 */
export function useButtonPressAnimation({ normalColor, pressedColor }: { normalColor: string; pressedColor: string }) {
  const pressed = useSharedValue(0);

  // Use derived value to ensure colors are reactive to theme changes
  const colors = useDerivedValue(() => [normalColor, pressedColor]);

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(pressed.value, [0, 1], colors.value),
  }));

  const handlePressIn = useCallback(() => {
    pressed.value = withTiming(1, { duration: ANIMATION_DURATION });
  }, [pressed]);

  const handlePressOut = useCallback(() => {
    pressed.value = withTiming(0, { duration: ANIMATION_DURATION });
  }, [pressed]);

  // Cleanup: cancel animations on unmount
  useEffect(() => {
    return () => {
      cancelAnimation(pressed);
    };
  }, [pressed]);

  return {
    animatedStyle,
    handlePressIn,
    handlePressOut,
  };
}
