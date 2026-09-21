import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';

import { useEtoroTheme } from '../../../core/hooks';
// Import our modular architecture
import { EtNumberPickerProps } from './api';
import { DecrementButton, IncrementButton, NumberDisplay } from './components';
import { useButtonAnimations, useContainerWidth, useNumberPickerHandlers } from './hooks';
import { getDigitsFromValue, getSizeDimensions } from './utils';

/** @deprecated not actively maintained — no AGENTS.mdc */
export function EtNumberPicker({ state, appearance, interaction, style, accessibility }: EtNumberPickerProps) {
  const { colors } = useEtoroTheme();

  // Extract configuration values with defaults
  const value = state.value;
  const onValueChange = state.onValueChange;
  const min = state.min ?? 0;
  const max = state.max ?? 100;
  const step = state.step ?? 1;
  const disabled = state.disabled ?? false;
  const size = appearance?.size ?? 'medium';
  const buttonColor = appearance?.buttonColor;
  const textColor = appearance?.textColor;
  const backgroundColor = appearance?.backgroundColor;
  const haptics = interaction?.haptics ?? true;
  const containerStyle = style?.style;
  const testID = accessibility?.testID;
  const accessibilityLabel = accessibility?.accessibilityLabel;

  // Get size-based dimensions
  const dimensions = getSizeDimensions(size);

  // Break down number into individual digits for sliding animation
  const digits = useMemo(() => getDigitsFromValue(value), [value]);

  // Track previous value to determine animation direction
  const prevValue = useSharedValue(value);
  const animationDirection = useMemo(() => {
    const direction = value > prevValue.value ? 'up' : 'down';
    prevValue.value = value;
    return direction;
  }, [value, prevValue]);

  // Use hooks for functionality
  const { handleIncrement, handleDecrement, isDecrementDisabled, isIncrementDisabled } = useNumberPickerHandlers({
    value,
    onValueChange,
    min,
    max,
    step,
    disabled,
    haptics,
  });

  const { buttonAnimatedStyle, handleButtonPressIn, handleButtonPressOut } = useButtonAnimations();
  const { containerAnimatedStyle } = useContainerWidth(digits, dimensions.numberFontSize);

  return (
    <View
      style={[
        styles.container,
        {
          height: dimensions.containerHeight,
          paddingHorizontal: dimensions.containerPadding,
          backgroundColor: backgroundColor || colors.bgNeutralQuaternary || '#2A2A2A',
          shadowColor: colors.bgNeutralPrimary,
        },
        containerStyle,
      ]}
      testID={testID}
      accessibilityLabel={accessibilityLabel || `Number picker, current value ${value}`}
      accessibilityRole="adjustable"
      accessibilityValue={{ min, max, now: value }}
    >
      {/* Decrement Button */}
      <DecrementButton
        onPress={handleDecrement}
        disabled={isDecrementDisabled}
        dimensions={dimensions}
        buttonColor={buttonColor || colors.actionBrandText || '#4A9EFF'}
        buttonTextColor={colors.textInvertedPrimaryNeutral}
        animatedStyle={buttonAnimatedStyle}
        onPressIn={handleButtonPressIn}
        onPressOut={handleButtonPressOut}
        testID={`${testID}-decrement`}
      />

      {/* Number Display with Sliding Digits and Animated Width */}
      <NumberDisplay
        digits={digits}
        dimensions={dimensions}
        textColor={textColor || colors.textPrimaryNeutral || '#FFFFFF'}
        animationDirection={animationDirection}
        containerAnimatedStyle={containerAnimatedStyle}
      />

      {/* Increment Button */}
      <IncrementButton
        onPress={handleIncrement}
        disabled={isIncrementDisabled}
        dimensions={dimensions}
        buttonColor={buttonColor || colors.actionBrandText || '#4A9EFF'}
        buttonTextColor={colors.textInvertedPrimaryNeutral}
        animatedStyle={buttonAnimatedStyle}
        onPressIn={handleButtonPressIn}
        onPressOut={handleButtonPressOut}
        testID={`${testID}-increment`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
});
