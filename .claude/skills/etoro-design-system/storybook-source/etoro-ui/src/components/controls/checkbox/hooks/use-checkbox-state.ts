import * as Haptics from 'expo-haptics';
import { useCallback, useEffect } from 'react';
import { interpolate, interpolateColor, useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated';

import { CheckboxValue, CheckboxVariant } from '../api/types';
import { ANIMATION_DURATION, EASING } from '../utils/animation-constants';
import { CheckboxColors } from '../utils/get-checkbox-colors';

export interface UseCheckboxStateParams {
  value: CheckboxValue; // Union type that works with all variants
  disabled: boolean;
  haptics: boolean;
  onChange: (checked: boolean) => void;
  colors: CheckboxColors;
  variant: CheckboxVariant;
}

export interface UseCheckboxStateReturn {
  checkAnimationValue: ReturnType<typeof useSharedValue<number>>;
  animatedContainerStyle: ReturnType<typeof useAnimatedStyle>;
  handlePress: () => void;
  isChecked: boolean;
  isIndeterminate: boolean;
}

/**
 * Manages checkbox animation and press handlers for controlled value.
 */
export function useCheckboxState({ value, disabled, haptics, onChange, colors, variant }: UseCheckboxStateParams): UseCheckboxStateReturn {
  // Derive states from value
  const isChecked = value === true;
  // Indeterminate only supported for square variant (used for background fill)
  const isIndeterminate = value === 'indeterminate' && variant === 'square';
  const hasFilledBackground = isChecked || isIndeterminate;

  // Animation value for check icon (shows when checked)
  const checkAnimationValue = useSharedValue(isChecked ? 1 : 0);

  // Animation value for background (shows when checked OR indeterminate)
  const backgroundAnimationValue = useSharedValue(hasFilledBackground ? 1 : 0);

  // Shared value for error state (needed for worklet)
  const isErrorShared = useDerivedValue(() => (value === 'error' ? 1 : 0), [value]);

  // Update check icon animation when checked state changes
  useEffect(() => {
    checkAnimationValue.value = withTiming(isChecked ? 1 : 0, {
      duration: ANIMATION_DURATION,
      easing: EASING,
    });
  }, [isChecked, checkAnimationValue]);

  // Update background animation when filled state changes
  useEffect(() => {
    backgroundAnimationValue.value = withTiming(hasFilledBackground ? 1 : 0, {
      duration: ANIMATION_DURATION,
      easing: EASING,
    });
  }, [hasFilledBackground, backgroundAnimationValue]);

  // Press handler: toggle value, emit boolean
  // true -> false, false/error/indeterminate -> true
  const handlePress = useCallback(() => {
    if (disabled) return;

    if (haptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    const nextChecked = !isChecked;
    onChange(nextChecked);
  }, [disabled, haptics, isChecked, onChange]);

  // Animated container style
  const animatedContainerStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(backgroundAnimationValue.value, [0, 1], ['transparent', colors.checked]);

    // Error state: use error color for border
    // Normal state: animate between unchecked and checked colors
    const normalBorderColor = interpolateColor(backgroundAnimationValue.value, [0, 1], [colors.unchecked, colors.checked]);

    const borderColor = isErrorShared.value === 1 ? colors.error : normalBorderColor;

    const scale = interpolate(backgroundAnimationValue.value, [0, 0.5, 1], [1, 0.95, 1]);

    return {
      backgroundColor,
      borderColor,
      transform: [{ scale }],
    };
  }, [colors.checked, colors.unchecked, colors.error]);

  return {
    checkAnimationValue,
    animatedContainerStyle,
    handlePress,
    isChecked,
    isIndeterminate,
  };
}
