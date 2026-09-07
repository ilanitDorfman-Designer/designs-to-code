import { createContext, useContext } from 'react';

import { InputType, InputVariant } from '../api/types';

interface InputConfigContextValue {
  type: InputType;
  variant: InputVariant;
  defaultValue: string;
  maxLength?: number;
  error: string | null;
  disabled: boolean;
  readonly: boolean;
  staticLabel: boolean;
  passwordShowAccessibilityLabel?: string;
  passwordHideAccessibilityLabel?: string;
  passwordToggleAccessibilityHint?: string;
}

export const InputConfigContext = createContext<InputConfigContextValue | null>(null);

/**
 * Access static config props (type, disabled, readonly, etc.)
 * These rarely change, so components using only this hook won't re-render on typing.
 */
export function useInputConfig() {
  const context = useContext(InputConfigContext);
  if (!context) {
    throw new Error('Input components must be used within <Input>');
  }
  return context;
}
