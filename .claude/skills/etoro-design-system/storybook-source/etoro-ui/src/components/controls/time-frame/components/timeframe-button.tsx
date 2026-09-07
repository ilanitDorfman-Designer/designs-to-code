import * as Haptics from 'expo-haptics';
import React, { useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { TimeFrameButtonProps } from '../api';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function TimeFrameButton({ frame, isSelected, onPress, fontSize, colors, withHaptics = true }: TimeFrameButtonProps) {
  const scale = useSharedValue(1);
  const selectedProgress = useSharedValue(isSelected ? 1 : 0);
  const rgbValues = React.useMemo(() => {
    const textColor = colors.textPrimaryNeutral;
    if (textColor && textColor.startsWith('#') && textColor.length >= 7) {
      const rgb = textColor.slice(1).match(/.{2}/g);
      return rgb ? rgb.map((x: string) => parseInt(x, 16)) : [128, 128, 128];
    }
    return [128, 128, 128]; // Fallback gray
  }, [colors.textPrimaryNeutral]);

  // Update animation when selection changes
  useEffect(() => {
    selectedProgress.value = withSpring(isSelected ? 1 : 0, {
      damping: 15,
      stiffness: 150,
    });
  }, [isSelected, selectedProgress]);

  const handlePress = () => {
    if (withHaptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  // Handle press animations
  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  // Animated styles for the button container
  const animatedButtonStyle = useAnimatedStyle(() => {
    const borderOpacity = selectedProgress.value;
    const backgroundOpacity = selectedProgress.value * 0.1;

    // 🎯 Use pre-computed RGB values (no parsing during animation)
    const [r, g, b] = rgbValues;

    return {
      transform: [{ scale: scale.value }],
      borderWidth: 1,
      borderColor: `rgba(${r}, ${g}, ${b}, ${borderOpacity})`,
      backgroundColor: `rgba(${r}, ${g}, ${b}, ${backgroundOpacity})`,
    };
  });

  return (
    <AnimatedPressable
      style={[styles.button, animatedButtonStyle]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      testID={`timeframe-button-${frame}`}
      accessibilityRole="button"
      accessibilityLabel={`Select ${frame} timeframe`}
    >
      <Animated.Text
        style={[
          styles.text,
          {
            color: isSelected ? colors.textPrimaryNeutral : `${colors.textPrimaryNeutral}80`,
            fontSize: fontSize,
          },
        ]}
        testID={`timeframe-text-${frame}`}
      >
        {frame}
      </Animated.Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 44, // Ensure consistent button sizes
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
