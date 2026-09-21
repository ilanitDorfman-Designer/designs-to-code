import { memo, useEffect, useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';

import { useEtoroTheme } from '../../../core/hooks';
import { EtText } from '../../../foundations/text/et-text';
import { EtStepperProps } from './api/types';
import { StepperButton } from './subcomponents/stepper-button';

type StepperSize = 'xs' | 'sm' | 'md' | 'lg';

const SIZE_PRESETS: Record<StepperSize, { button: number; font: number; lineHeight: number; valueWidth: number; gap: number }> = {
  xs: { button: 40, font: 28, lineHeight: 28, valueWidth: 48, gap: 4 },
  sm: { button: 46, font: 40, lineHeight: 40, valueWidth: 56, gap: 6 },
  md: { button: 52, font: 50, lineHeight: 50, valueWidth: 64, gap: 8 },
  lg: { button: 60, font: 60, lineHeight: 60, valueWidth: 72, gap: 10 },
};

function EtStepperComponent({
  value,
  onChange,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  step = 1,
  disabled = false,
  size = 'md',
  haptics = true,
  testID,
}: EtStepperProps) {
  const { colors } = useEtoroTheme();
  const translateY = useSharedValue(0);
  const prevValueRef = useRef(value);
  const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRenderRef = useRef(true);
  const lastDirectionRef = useRef<1 | -1>(1);

  const sizeTokens = useMemo(() => SIZE_PRESETS[size] ?? SIZE_PRESETS.md, [size]);

  const normalizedStep = useMemo(() => {
    if (!Number.isFinite(step) || step <= 0) return 1;
    return step;
  }, [step]);

  const canDecrement = !disabled && value - normalizedStep >= min;
  const canIncrement = !disabled && value + normalizedStep <= max;

  const numberColor = useMemo(() => {
    if (disabled) return colors.actionDisabledText;
    return colors.textPrimaryNeutral;
  }, [colors.actionDisabledText, colors.textPrimaryNeutral, disabled]);

  const handleDecrement = () => {
    if (!canDecrement) return;
    onChange(value - normalizedStep);
  };

  const handleIncrement = () => {
    if (!canIncrement) return;
    onChange(value + normalizedStep);
  };

  useEffect(() => {
    // Skip initial render animation
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      prevValueRef.current = value;
      return;
    }

    const direction = value > prevValueRef.current ? -1 : 1;
    prevValueRef.current = value;
    lastDirectionRef.current = direction;

    // Debounce fast presses: run only after a short delay from the last change
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }

    animationTimeoutRef.current = setTimeout(() => {
      // start clean from 0 each time we animate
      translateY.value = 0;

      translateY.value = withSequence(
        withTiming(lastDirectionRef.current * 4, {
          duration: 300,
          easing: Easing.out(Easing.cubic),
        }),
        withTiming(0, {
          duration: 300,
          easing: Easing.inOut(Easing.cubic),
        }),
      );
    }, 160);

    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [translateY, value]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <View
      style={[styles.container, { gap: sizeTokens.gap }]}
      accessibilityRole="adjustable"
      accessibilityValue={{
        now: value,
        min: Number.isFinite(min) ? min : undefined,
        max: Number.isFinite(max) ? max : undefined,
      }}
    >
      <StepperButton
        iconName="minus"
        onPress={handleDecrement}
        enabled={canDecrement}
        size={sizeTokens.button}
        haptics={haptics}
        colors={colors}
        testID={testID ? `${testID}-decrement` : undefined}
      />
      <View style={[styles.valueWrapper, { width: sizeTokens.valueWidth }]}>
        <Animated.View style={animatedStyle}>
          <EtText
            variant="num-xxl"
            style={[
              styles.valueText,
              {
                color: numberColor,
                fontSize: sizeTokens.font,
                lineHeight: sizeTokens.lineHeight,
              },
            ]}
            numberOfLines={1}
            ellipsizeMode="clip"
          >
            {value}
          </EtText>
        </Animated.View>
      </View>
      <StepperButton
        iconName="plus"
        onPress={handleIncrement}
        enabled={canIncrement}
        size={sizeTokens.button}
        haptics={haptics}
        colors={colors}
        testID={testID ? `${testID}-increment` : undefined}
      />
    </View>
  );
}

export const EtStepper = memo(EtStepperComponent);
EtStepper.displayName = 'EtStepper';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 28,
  },
  valueWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60, // defaults; overridden per size
  },
  valueText: {
    fontSize: 60,
    lineHeight: 60,
  },
});
