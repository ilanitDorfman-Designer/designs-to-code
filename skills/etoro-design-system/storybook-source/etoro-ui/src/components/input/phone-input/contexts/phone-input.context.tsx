import { createContext, type ReactNode, type RefObject, useContext } from 'react';
import type { TextInput } from 'react-native';

export interface PhoneInputContextValue {
  // Display values
  prefix: string;
  isoCode: string;
  placeholder: string;
  defaultValue: string;

  // Styling
  prefixTextColor: string;
  numberTextColor: string;
  placeholderTextColor: string;
  prefixBorderColor: string;
  borderColor: string;
  backgroundColor: string;
  cursorColor: string;
  errorTextColor: string;

  // State flags
  disabled: boolean;
  prefixDisabled: boolean;
  autoFocus: boolean;
  hasError: boolean;
  showVirtualKeyboard: boolean;

  // Controlled value (when provided, NumberField uses `value` instead of `defaultValue`)
  controlledValue?: string;

  // Controlled selection — when provided alongside `controlledValue`, gives the parent
  // authority over caret/selection (used for cursor-aware editing with custom keyboards).
  selection?: { start: number; end?: number };

  // Error — string or any ReactNode (e.g. a <Trans> element with inline slots).
  error: ReactNode | null;

  // Handlers
  handleChangeText: (text: string) => void;
  handleFocus: () => void;
  handleBlur: () => void;
  handleSubmitEditing: () => void;
  handleSelectionChange?: (selection: { start: number; end: number }) => void;
  onPrefixPress?: () => void;

  // Test ID
  testID?: string;

  /** Native number field ref — used by the imperative `blur()` handle. */
  numberInputRef: RefObject<TextInput | null>;
}

export const PhoneInputContext = createContext<PhoneInputContextValue | null>(null);

export function usePhoneInputContext() {
  const context = useContext(PhoneInputContext);
  if (!context) {
    throw new Error('usePhoneInputContext must be used within PhoneInputContext.Provider');
  }
  return context;
}
