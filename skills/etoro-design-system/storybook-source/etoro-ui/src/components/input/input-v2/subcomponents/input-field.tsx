import { useCallback, useEffect } from 'react';
import { FocusEvent, Platform, StyleSheet, TextInput, useColorScheme } from 'react-native';

import { useEtoroTheme } from '../../../../core/hooks';
import { InputFieldProps } from '../api/types';
import { useInputConfig, useInputInteraction, useInputValue } from '../context';
import { getInputFieldPlatformProps, getInputFieldPlatformStyle, getInputFieldSubmitBehavior } from '../utils/input-field-platform-props';
import { getKeyboardType } from '../utils/keyboard-types';
import { sanitizeInputText } from '../utils/sanitize-input';

/**
 * Native `TextInput` wired to input context: focus/blur, password visibility, value sync, and compact/idle text color.
 */
export function InputField({ ref, onChangeText, onBlur, onFocus, onSubmitEditing, placeholder, value, ...textInputProps }: InputFieldProps) {
  const { colors } = useEtoroTheme();

  // Use selective hooks for optimal performance
  const { maxLength, disabled, readonly, defaultValue, type: inputType, staticLabel } = useInputConfig();
  const { isPasswordVisible, handleFocus, handleBlur, isFocused, hasValue, registerInputRef } = useInputInteraction();

  const mergedRef = useCallback(
    (node: TextInput | null) => {
      registerInputRef(node);
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref?.current !== undefined) {
        ref.current = node;
      }
    },
    [registerInputRef, ref],
  );

  // Need setValue to update context for character counter
  const { currentValue, setValue } = useInputValue();

  useEffect(() => {
    if (value !== undefined) {
      setValue(value);
    }
  }, [setValue, value]);

  const scheme = useColorScheme();
  const isPassword = inputType === 'password';

  const handleFocusEvent = (e: FocusEvent) => {
    handleFocus();
    onFocus?.(e);
  };

  const handleBlurEvent = (e: FocusEvent) => {
    handleBlur();
    onBlur?.(e);
  };

  const handleChangeText = (text: string) => {
    // On web, keyboardType is only a hint - strip non-numeric chars for
    // number/phone inputs so pasted/typed letters never reach consumers.
    // No-op on native (see sanitizeInputText).
    const sanitized = sanitizeInputText(inputType, text);
    setValue(sanitized);
    onChangeText?.(sanitized);
  };

  const compact = staticLabel || isFocused || hasValue;
  const textColor = !compact ? 'transparent' : disabled ? colors.carbon500 : colors.carbon900;
  const platformProps = getInputFieldPlatformProps({ onSubmitEditing, value: value ?? currentValue });

  return (
    <TextInput
      ref={mergedRef}
      style={[
        styles.input,
        getInputFieldPlatformStyle(),
        {
          color: textColor,
        },
      ]}
      defaultValue={value === undefined ? defaultValue : undefined}
      value={value}
      secureTextEntry={isPassword && !isPasswordVisible}
      onChangeText={handleChangeText}
      onFocus={handleFocusEvent}
      onBlur={handleBlurEvent}
      onSubmitEditing={onSubmitEditing}
      keyboardType={getKeyboardType(inputType)}
      keyboardAppearance={scheme === 'dark' ? 'dark' : 'light'}
      submitBehavior={getInputFieldSubmitBehavior()}
      cursorColor={colors.primary600}
      selectionColor={colors.primary600}
      placeholder={staticLabel || isFocused ? placeholder : undefined}
      placeholderTextColor={colors.carbon400}
      editable={!disabled && !readonly}
      maxLength={maxLength}
      {...platformProps}
      {...textInputProps}
    />
  );
}

InputField.displayName = 'EtInput.Field';

const styles = StyleSheet.create({
  input: {
    height: Platform.OS === 'ios' ? 24 : 28,
    flex: 1,
    fontSize: 16,
    padding: 0,
    margin: 0,
  },
});
