import * as Haptics from 'expo-haptics';
import { useCallback } from 'react';
import { interpolateColor, type SharedValue, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

/**
 * Manages chip state and press handlers
 */
export function useChipState({
  haptics,
  selected,
  selectedProgress,
  colors,
  onPress,
  onSelectionChange,
}: {
  haptics: boolean;
  selected: boolean;
  selectedProgress: SharedValue<number>;
  colors: {
    transparent: string;
    carbon900: string;
  };
  onPress?: () => void;
  onSelectionChange?: (_selected: boolean) => void;
}) {
  // Animation state
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.get() }],
    backgroundColor: interpolateColor(selectedProgress.get(), [0, 1], [colors.transparent, colors.carbon900]),
  }));

  // Animation handlers
  const handlePressIn = useCallback(() => {
    scale.set(withSpring(0.975, { damping: 50, stiffness: 500 }));
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.set(withSpring(1, { damping: 50, stiffness: 500 }));
  }, [scale]);

  // Press handler
  const handlePress = useCallback(() => {
    if (haptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    if (onSelectionChange) {
      onSelectionChange(!selected);
    }

    if (onPress) {
      onPress();
    }
  }, [haptics, selected, onPress, onSelectionChange]);

  return {
    animatedStyle,
    handlePressIn,
    handlePressOut,
    handlePress,
  };
}
