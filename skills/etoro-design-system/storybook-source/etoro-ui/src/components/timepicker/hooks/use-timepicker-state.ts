import * as Haptics from 'expo-haptics';
import { useCallback, useState } from 'react';

import { useTimepickerDefaults, UseTimepickerDefaultsProps } from './use-timepicker-defaults';

export type UseTimepickerStateProps = UseTimepickerDefaultsProps;

export function useTimepickerState(props?: UseTimepickerStateProps) {
  const { haptics, disabled } = useTimepickerDefaults(props);
  const [isFocused, setIsFocused] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const handleOpenPicker = useCallback(() => {
    if (disabled) {
      return;
    }
    if (haptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setIsFocused(true);
    setIsPickerOpen(true);
  }, [haptics, disabled]);

  const handleClosePicker = useCallback(() => {
    setIsFocused(false);
    setIsPickerOpen(false);
  }, []);

  return {
    isFocused,
    isPickerOpen,
    handleOpenPicker,
    handleClosePicker,
  };
}
