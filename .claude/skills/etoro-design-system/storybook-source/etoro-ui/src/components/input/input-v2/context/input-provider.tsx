import { PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TextInput } from 'react-native';

import { useEtoroTheme } from '../../../../core/hooks';
import { InputType, InputVariant } from '../api/types';
import { useInputAnimations } from '../hooks/use-input-animations';
import { useInputState } from '../hooks/use-input-state';
import { getInputBorderColors } from '../utils/get-input-border-colors';
import { InputConfigContext } from './config-context';
import { InputStateContext } from './state-context';
import { InputValueContext } from './value-context';

export interface InputProviderProps extends PropsWithChildren {
  defaultValue?: string;
  type?: InputType;
  variant?: InputVariant;
  error?: string | null;
  disabled?: boolean;
  readonly?: boolean;
  maxLength?: number;
  staticLabel?: boolean;
  passwordShowAccessibilityLabel?: string;
  passwordHideAccessibilityLabel?: string;
  passwordToggleAccessibilityHint?: string;
  defaultPasswordVisible?: boolean;
}

/**
 * Composes input config, value, interaction state, and shared Reanimated label/border styles for EtInput v2.
 */
export function InputProvider({
  children,
  defaultValue = '',
  type = 'text',
  variant = 'underline',
  error = null,
  disabled = false,
  readonly = false,
  maxLength = undefined,
  staticLabel = false,
  passwordShowAccessibilityLabel,
  passwordHideAccessibilityLabel,
  passwordToggleAccessibilityHint,
  defaultPasswordVisible = false,
}: InputProviderProps) {
  const { colors } = useEtoroTheme();
  const [currentValue, setCurrentValue] = useState(defaultValue);

  useEffect(() => {
    setCurrentValue(defaultValue);
  }, [defaultValue]);

  const inputRef = useRef<TextInput | null>(null);
  const hasValue = currentValue.length > 0;

  const { isFocused, isPasswordVisible, handleFocus, handleBlur, handlePasswordVisibility } = useInputState({
    haptics: true,
    disabled,
    initialPasswordVisible: defaultPasswordVisible,
  });

  const registerInputRef = useCallback((node: TextInput | null) => {
    inputRef.current = node;
  }, []);

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const setValue = useCallback((value: string) => {
    setCurrentValue(value);
  }, []);

  const borderColors = getInputBorderColors(colors, { disabled, readonly, error });

  const { animatedBorderStyle, animatedLabelContainerStyle, animatedFieldRowStyle, animatedLabelTextStyle } = useInputAnimations({
    isFocused,
    hasValue,
    staticLabel,
    unfocusedBorderColor: borderColors.unfocused,
    focusedBorderColor: borderColors.focused,
    idleLabelColor: colors.carbon600,
    compactLabelColor: colors.carbon600,
  });

  const configValue = useMemo(
    () => ({
      type,
      variant,
      defaultValue,
      maxLength,
      error,
      disabled,
      readonly,
      staticLabel,
      passwordShowAccessibilityLabel,
      passwordHideAccessibilityLabel,
      passwordToggleAccessibilityHint,
    }),
    [
      type,
      variant,
      defaultValue,
      maxLength,
      error,
      disabled,
      readonly,
      staticLabel,
      passwordShowAccessibilityLabel,
      passwordHideAccessibilityLabel,
      passwordToggleAccessibilityHint,
    ],
  );

  const stateValue = useMemo(
    () => ({
      isFocused,
      isPasswordVisible,
      hasValue,
      handleFocus,
      handleBlur,
      handlePasswordVisibility,
      animatedBorderStyle,
      animatedLabelContainerStyle,
      animatedFieldRowStyle,
      animatedLabelTextStyle,
      registerInputRef,
      focusInput,
    }),
    [
      isFocused,
      isPasswordVisible,
      hasValue,
      handleFocus,
      handleBlur,
      handlePasswordVisibility,
      animatedBorderStyle,
      animatedLabelContainerStyle,
      animatedFieldRowStyle,
      animatedLabelTextStyle,
      registerInputRef,
      focusInput,
    ],
  );

  const valueContextValue = useMemo(
    () => ({
      currentValue,
      setValue,
    }),
    [currentValue, setValue],
  );

  return (
    <InputConfigContext.Provider value={configValue}>
      <InputStateContext.Provider value={stateValue}>
        <InputValueContext.Provider value={valueContextValue}>{children}</InputValueContext.Provider>
      </InputStateContext.Provider>
    </InputConfigContext.Provider>
  );
}
