import { createContext, useContext } from 'react';
import { TextStyle } from 'react-native';
import { AnimatedStyle } from 'react-native-reanimated';

export interface DatepickerStateContextValue {
  isFocused: boolean;
  isPickerOpen: boolean;
  hasValue: boolean;
  /**
   * `isFocused || hasValue`. Single source of truth for "label is in compact position and
   * value is visible" — consumed by label typography, display text color, and animation driver.
   * Kept distinct from `isFocused` per D9: `isFocused` is a color-lift signal (only true while
   * the native picker modal covers the field), whereas `isCompact` drives the label-lift.
   */
  isCompact: boolean;
  handleOpenPicker: () => void;
  handleClosePicker: () => void;
  animatedLabelContainerStyle: AnimatedStyle<{
    paddingTop: number;
  }>;
  animatedLabelTextStyle: AnimatedStyle<TextStyle>;
  animatedBorderStyle: AnimatedStyle<{
    borderWidth: number;
    borderColor: string;
    borderRadius: number;
  }>;
  animatedFieldRowStyle: AnimatedStyle<{
    paddingTop: number;
  }>;
}

export const DatepickerStateContext = createContext<DatepickerStateContextValue | null>(null);

/**
 * Access interaction state (focus, picker visibility, hasValue, handlers, animations)
 * Changes on picker open/close and empty↔filled transitions.
 */
export function useDatepickerInteraction() {
  const context = useContext(DatepickerStateContext);
  if (!context) {
    throw new Error('Datepicker components must be used within <Datepicker>');
  }
  return context;
}
