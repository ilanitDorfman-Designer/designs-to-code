import { createContext, useContext } from 'react';
import { TextInput, TextStyle, ViewStyle } from 'react-native';
import { AnimatedStyle } from 'react-native-reanimated';

interface InputStateContextValue {
  isFocused: boolean;
  isPasswordVisible: boolean;
  hasValue: boolean;
  handleFocus: () => void;
  handleBlur: () => void;
  handlePasswordVisibility: () => void;
  animatedBorderStyle: AnimatedStyle<{ borderColor: string; borderWidth: number; borderRadius: number }>;
  /** Floating label: vertical padding in the label overlay (idle → compact). */
  animatedLabelContainerStyle: AnimatedStyle<ViewStyle>;
  /** Floating label: font size, line, color, weight (idle big → compact small). */
  animatedLabelTextStyle: AnimatedStyle<TextStyle>;
  /** Pushes the value row down as the label moves to the compact (top) position. */
  animatedFieldRowStyle: AnimatedStyle<ViewStyle>;
  registerInputRef: (node: TextInput | null) => void;
  focusInput: () => void;
}

export const InputStateContext = createContext<InputStateContextValue | null>(null);

/**
 * Access interaction state (focus, password visibility, hasValue, handlers, animations)
 * Changes on focus/blur, password toggle, and empty↔filled transitions.
 */
export function useInputInteraction() {
  const context = useContext(InputStateContext);
  if (!context) {
    throw new Error('Input components must be used within <Input>');
  }
  return context;
}
