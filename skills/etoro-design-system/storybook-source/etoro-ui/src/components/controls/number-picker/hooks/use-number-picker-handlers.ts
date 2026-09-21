import * as Haptics from 'expo-haptics';
import { useCallback } from 'react';

interface UseNumberPickerHandlersProps {
  value: number;
  onValueChange: (_value: number) => void;
  min: number;
  max: number;
  step: number;
  disabled?: boolean;
  haptics?: boolean;
}

export const useNumberPickerHandlers = ({ value, onValueChange, min, max, step, disabled, haptics }: UseNumberPickerHandlersProps) => {
  const handleIncrement = useCallback(() => {
    if (disabled) return;

    const newValue = Math.min(value + step, max);
    if (newValue !== value) {
      if (haptics) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      onValueChange(newValue);
    }
  }, [value, step, max, disabled, haptics, onValueChange]);

  const handleDecrement = useCallback(() => {
    if (disabled) return;

    const newValue = Math.max(value - step, min);
    if (newValue !== value) {
      if (haptics) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      onValueChange(newValue);
    }
  }, [value, step, min, disabled, haptics, onValueChange]);

  // Check if buttons should be disabled
  const isDecrementDisabled = disabled || value <= min;
  const isIncrementDisabled = disabled || value >= max;

  return {
    handleIncrement,
    handleDecrement,
    isDecrementDisabled,
    isIncrementDisabled,
  };
};
