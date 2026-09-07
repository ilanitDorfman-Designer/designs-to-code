import { createContext, useContext } from 'react';
import { TextStyle } from 'react-native';
import { AnimatedStyle } from 'react-native-reanimated';

export interface TimepickerStateContextValue {
  isFocused: boolean;
  isPickerOpen: boolean;
  hasValue: boolean;
  handleOpenPicker: () => void;
  handleClosePicker: () => void;
  animatedLabelContainerStyle: AnimatedStyle<{
    transform: Array<{ translateY: number }>;
  }>;
  animatedLabelTextStyle: AnimatedStyle<TextStyle>;
  animatedBorderStyle: AnimatedStyle<{ borderBottomColor: string }>;
}

export const TimepickerStateContext = createContext<TimepickerStateContextValue | null>(null);

/**
 * Access interaction state (focus, picker visibility, hasValue, handlers, animations)
 * Changes on picker open/close and empty↔filled transitions.
 */
export function useTimepickerInteraction() {
  const context = useContext(TimepickerStateContext);
  if (!context) {
    throw new Error('Timepicker components must be used within <Timepicker>');
  }
  return context;
}
