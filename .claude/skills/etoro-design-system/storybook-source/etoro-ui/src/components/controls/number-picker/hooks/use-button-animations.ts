import { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

export const useButtonAnimations = () => {
  // Animated values for button press feedback
  const buttonScale = useSharedValue(1);

  // Enhanced button press animation with better feedback
  const handleButtonPressIn = () => {
    // buttonScale.value = withSpring(0.92, buttonPressInConfig);
  };

  const handleButtonPressOut = () => {
    // buttonScale.value = withSpring(1, buttonPressOutConfig);
  };

  // Animated style for button scale
  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  return {
    buttonAnimatedStyle,
    handleButtonPressIn,
    handleButtonPressOut,
  };
};
