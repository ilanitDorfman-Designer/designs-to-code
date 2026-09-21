import { forwardRef, memo, type ReactNode, type RefObject, useImperativeHandle, useMemo, useRef } from 'react';
import { StyleSheet, type TextInput, View } from 'react-native';

import { X1, X2 } from '../../../core/styles/spacing';
import type { EtPhoneInputHandle, EtPhoneInputProps } from './api/types';
import { PhoneInputContext } from './contexts';
import { usePhoneInputConfig, usePhoneInputState } from './hooks';
import { ErrorText, NumberField, PrefixSection } from './subcomponents';

interface EtPhoneInputProviderProps extends Omit<EtPhoneInputProps, 'style'> {
  children: ReactNode;
  numberInputRef?: RefObject<TextInput | null>;
}

function EtPhoneInputProviderBase({
  prefix,
  isoCode,
  placeholder,
  defaultValue = '',
  value: controlledValue,
  selection,
  onSelectionChange,
  error = null,
  showVirtualKeyboard = true,
  disabled = false,
  prefixDisabled = false,
  autoFocus = false,
  onChangeText,
  onFocus,
  onBlur,
  onSubmitEditing,
  onPrefixPress,
  testID,
  numberInputRef: numberInputRefProp,
  children,
}: EtPhoneInputProviderProps) {
  const fallbackNumberInputRef = useRef<TextInput>(null);
  const numberInputRef = numberInputRefProp ?? fallbackNumberInputRef;
  const { currentValue, isFocused, handleChangeText, handleFocus, handleBlur, handleSubmitEditing } = usePhoneInputState({
    defaultValue,
    onChangeText,
    onFocus,
    onBlur,
    onSubmitEditing,
  });

  const {
    hasError,
    prefixTextColor,
    numberTextColor,
    placeholderTextColor,
    prefixBorderColor,
    borderColor,
    backgroundColor,
    cursorColor,
    errorTextColor,
  } = usePhoneInputConfig({
    currentValue,
    error,
    isFocused,
    disabled,
    prefixDisabled,
  });

  // Selection control is meaningful only in controlled mode — caret control
  // without text control creates an inconsistent UX where the parent dictates
  // the caret while RN owns the text. Gate the props so the documented
  // anti-pattern (see AGENTS.mdc — "❌ Passing `selection` without `value`")
  // simply cannot trigger, regardless of how the consumer wires the API.
  const isControlled = controlledValue !== undefined;
  const effectiveSelection = isControlled ? selection : undefined;
  const effectiveOnSelectionChange = isControlled ? onSelectionChange : undefined;

  const contextValue = useMemo(
    () => ({
      prefix,
      isoCode,
      placeholder,
      defaultValue,
      controlledValue,
      selection: effectiveSelection,
      prefixTextColor,
      numberTextColor,
      placeholderTextColor,
      prefixBorderColor,
      borderColor,
      backgroundColor,
      cursorColor,
      disabled,
      prefixDisabled,
      autoFocus,
      showVirtualKeyboard,
      handleChangeText,
      handleFocus,
      handleBlur,
      handleSubmitEditing,
      handleSelectionChange: effectiveOnSelectionChange,
      onPrefixPress,
      hasError,
      errorTextColor,
      error,
      testID,
      numberInputRef,
    }),
    [
      prefix,
      isoCode,
      placeholder,
      defaultValue,
      controlledValue,
      effectiveSelection,
      prefixTextColor,
      numberTextColor,
      placeholderTextColor,
      prefixBorderColor,
      borderColor,
      backgroundColor,
      cursorColor,
      disabled,
      prefixDisabled,
      autoFocus,
      showVirtualKeyboard,
      handleChangeText,
      handleFocus,
      handleBlur,
      handleSubmitEditing,
      effectiveOnSelectionChange,
      onPrefixPress,
      hasError,
      errorTextColor,
      error,
      testID,
      numberInputRef,
    ],
  );

  return <PhoneInputContext.Provider value={contextValue}>{children}</PhoneInputContext.Provider>;
}

EtPhoneInputProviderBase.displayName = 'EtPhoneInput.Provider';

export const EtPhoneInputProvider = memo(EtPhoneInputProviderBase);

// Simplified default component for backward compatibility
const EtPhoneInputBase = forwardRef<EtPhoneInputHandle, EtPhoneInputProps>(function EtPhoneInputBase(
  {
    prefix,
    isoCode,
    placeholder,
    defaultValue = '',
    value: controlledValue,
    selection,
    onSelectionChange,
    error = null,
    showVirtualKeyboard = true,
    disabled = false,
    prefixDisabled = false,
    autoFocus = false,
    onChangeText,
    onFocus,
    onBlur,
    onSubmitEditing,
    onPrefixPress,
    style,
    testID,
  },
  ref,
) {
  const numberInputRef = useRef<TextInput>(null);

  useImperativeHandle(
    ref,
    () => ({
      blur: () => {
        numberInputRef.current?.blur();
      },
    }),
    [],
  );

  return (
    <EtPhoneInputProvider
      prefix={prefix}
      isoCode={isoCode}
      placeholder={placeholder}
      defaultValue={defaultValue}
      value={controlledValue}
      selection={selection}
      onSelectionChange={onSelectionChange}
      error={error}
      showVirtualKeyboard={showVirtualKeyboard}
      disabled={disabled}
      prefixDisabled={prefixDisabled}
      autoFocus={autoFocus}
      onChangeText={onChangeText}
      onFocus={onFocus}
      onBlur={onBlur}
      onSubmitEditing={onSubmitEditing}
      onPrefixPress={onPrefixPress}
      testID={testID}
      numberInputRef={numberInputRef}
    >
      <View style={[styles.container, style]} testID={testID}>
        <View style={styles.inputRow}>
          <PrefixSection />
          <NumberField />
        </View>
        <ErrorText />
      </View>
    </EtPhoneInputProvider>
  );
});

EtPhoneInputBase.displayName = 'EtPhoneInput';

const EtPhoneInputMemo = memo(EtPhoneInputBase);

// Compound component pattern - expose subcomponents and Provider
export const EtPhoneInput = Object.assign(EtPhoneInputMemo, {
  Provider: EtPhoneInputProvider,
  PrefixSection,
  NumberField,
  ErrorText,
}) as typeof EtPhoneInputMemo & {
  Provider: typeof EtPhoneInputProvider;
  PrefixSection: typeof PrefixSection;
  NumberField: typeof NumberField;
  ErrorText: typeof ErrorText;
};

const styles = StyleSheet.create({
  container: {
    gap: X1,
    direction: 'ltr', // Force LTR layout on RTL devices (prefix left, number right)
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: X2,
  },
});
