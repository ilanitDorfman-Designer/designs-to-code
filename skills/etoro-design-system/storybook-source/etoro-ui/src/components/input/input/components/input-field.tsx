import { Ref } from 'react';
import { FocusEvent, Platform, StyleProp, StyleSheet, TextInput, TextInputProps, TextStyle, useColorScheme } from 'react-native';

import { getTextInputPlatformStyle, getTextInputSubmitBehavior } from '../../utils/text-input-platform-props';
import { InputType } from '../api/types';
import { getKeyboardType } from '../utils';

interface InputFieldProps {
  ref?: Ref<TextInput>;
  value: string;
  onChangeText: (_text: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  type: InputType;
  isPasswordVisible: boolean;
  isFocused: boolean;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  maxLength?: number;
  inputStyle?: StyleProp<TextStyle>;
  textColor: string;
  cursorColor: string;
  selectionColor: string;
  testID?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  textInputProps?: TextInputProps;
}

export function InputField({
  ref,
  value,
  onChangeText,
  onFocus,
  onBlur,
  type,
  isPasswordVisible,
  isFocused: _isFocused,
  placeholder,
  disabled,
  readonly,
  maxLength,
  inputStyle,
  textColor,
  cursorColor,
  selectionColor,
  testID,
  accessibilityLabel,
  accessibilityHint,
  textInputProps,
}: InputFieldProps) {
  const scheme = useColorScheme();
  const isPassword = type === 'password';

  // Focusing input triggers animation which we want to preserve
  const handleFocus = (e: FocusEvent) => {
    onFocus();
    textInputProps?.onFocus?.(e);
  };

  return (
    <TextInput
      ref={ref}
      style={[styles.input, getTextInputPlatformStyle(), { color: disabled ? textColor : textColor }, inputStyle]}
      value={value}
      secureTextEntry={isPassword && !isPasswordVisible}
      onChangeText={onChangeText}
      onBlur={onBlur}
      keyboardType={getKeyboardType(type)}
      keyboardAppearance={scheme === 'dark' ? 'dark' : 'light'}
      submitBehavior={getTextInputSubmitBehavior()}
      cursorColor={cursorColor}
      selectionColor={selectionColor}
      placeholder={placeholder}
      editable={!disabled && !readonly}
      maxLength={maxLength}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      {...textInputProps}
      // We override onFocus to ensure our animation logic is executed
      onFocus={handleFocus}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: Platform.OS === 'ios' ? 24 : 28,
    flex: 1,
    fontSize: 16,
    padding: 0,
    margin: 0,
  },
});
