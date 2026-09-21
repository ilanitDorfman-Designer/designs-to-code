import * as Haptics from 'expo-haptics';
import { LayoutRectangle, Pressable, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { useEtoroTheme } from '../../../../core/hooks';
import { EtText } from '../../../../foundations/text';
import { DEFAULT_FONT_SIZE, DEFAULT_INDICATOR_SIZE, TimeFrameOption as TimeFrameOptionType } from '../api/types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface TimeFrameOptionProps<T> {
  option: TimeFrameOptionType<T>;
  isSelected: boolean;
  onPress: () => void;
  onLayout: (layout: LayoutRectangle) => void;
  haptics?: boolean;
  fontSize?: number;
  size?: number;
  selectedColor?: string;
  unselectedColor?: string;
  horizontalPadding?: number;
  labelVariant?: 'body-base-medium' | 'body-tiny-medium';
}

export function TimeFrameOption<T>({
  option,
  isSelected,
  onPress,
  onLayout,
  haptics = true,
  fontSize = DEFAULT_FONT_SIZE,
  size = DEFAULT_INDICATOR_SIZE,
  selectedColor,
  unselectedColor,
  horizontalPadding = 12,
  labelVariant = 'body-base-medium',
}: TimeFrameOptionProps<T>) {
  const { colors } = useEtoroTheme();
  const scale = useSharedValue(1);

  const handlePress = () => {
    if (isSelected) return;

    if (haptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    onPress();
  };

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 35, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 35, stiffness: 300 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const textColor = isSelected ? (selectedColor ?? colors.carbon800) : (unselectedColor ?? colors.carbon500);

  const optionStyle = {
    minWidth: size,
    height: size,
    paddingHorizontal: horizontalPadding,
  };

  return (
    <AnimatedPressable
      style={[styles.option, optionStyle, animatedStyle]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onLayout={(e) => onLayout(e.nativeEvent.layout)}
      testID={`time-frame-option-${option.id}`}
      accessibilityRole="button"
      accessibilityLabel={`Select ${option.label}`}
      accessibilityState={{ selected: isSelected }}
    >
      <EtText variant={labelVariant} allowFontScaling={false} style={{ color: textColor, fontSize }}>
        {option.label}
      </EtText>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  option: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
});
