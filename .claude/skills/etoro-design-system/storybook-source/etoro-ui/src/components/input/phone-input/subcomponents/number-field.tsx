import { memo, useCallback } from 'react';
import type { NativeSyntheticEvent, TextInputSelectionChangeEventData } from 'react-native';
import { InputAccessoryView, Platform, StyleSheet, TextInput, useColorScheme, View } from 'react-native';

import { X4 } from '../../../../core/styles/spacing';
import { getTextInputPlatformStyle, getTextInputSubmitBehavior } from '../../utils/text-input-platform-props';
import { usePhoneInputContext } from '../contexts';

const BOX_HEIGHT = 64;
const INPUT_ACCESSORY_ID = 'phone-input-empty-accessory';

function NumberFieldBase() {
  const {
    defaultValue,
    controlledValue,
    selection,
    placeholder,
    numberTextColor,
    placeholderTextColor,
    borderColor,
    backgroundColor,
    cursorColor,
    disabled,
    autoFocus,
    showVirtualKeyboard,
    handleChangeText,
    handleFocus,
    handleBlur,
    handleSubmitEditing,
    handleSelectionChange,
    testID,
    numberInputRef,
  } = usePhoneInputContext();

  const scheme = useColorScheme();

  // Bridge the native event payload into the simpler `{ start, end }` shape that
  // consumers receive — keeps the public API decoupled from RN's event types.
  const onNativeSelectionChange = useCallback(
    (e: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => {
      handleSelectionChange?.({ start: e.nativeEvent.selection.start, end: e.nativeEvent.selection.end });
    },
    [handleSelectionChange],
  );

  return (
    <>
      <TextInput
        ref={numberInputRef}
        style={[
          styles.input,
          getTextInputPlatformStyle(),
          {
            color: numberTextColor,
            borderColor,
            backgroundColor,
          },
          disabled && styles.disabled,
        ]}
        {...(controlledValue !== undefined ? { value: controlledValue } : { defaultValue })}
        // Only forward `selection` when the parent opted into controlled-cursor mode.
        // Passing it unconditionally would fight the native keyboard's own caret
        // tracking on screens that don't use a custom keypad.
        {...(selection !== undefined ? { selection } : {})}
        placeholder={placeholder}
        showSoftInputOnFocus={showVirtualKeyboard}
        placeholderTextColor={placeholderTextColor}
        keyboardType="phone-pad"
        keyboardAppearance={scheme === 'dark' ? 'dark' : 'light'}
        returnKeyType="done"
        submitBehavior={getTextInputSubmitBehavior()}
        cursorColor={cursorColor}
        selectionColor={cursorColor}
        editable={!disabled}
        autoFocus={autoFocus}
        onChangeText={handleChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onSubmitEditing={handleSubmitEditing}
        onSelectionChange={handleSelectionChange ? onNativeSelectionChange : undefined}
        accessibilityLabel="Phone number"
        testID={testID ? `${testID}-number` : undefined}
        {...(Platform.OS === 'ios' && showVirtualKeyboard === false ? { inputAccessoryViewID: INPUT_ACCESSORY_ID } : {})}
      />
      {Platform.OS === 'ios' && showVirtualKeyboard === false && (
        <InputAccessoryView nativeID={INPUT_ACCESSORY_ID}>
          <View />
        </InputAccessoryView>
      )}
    </>
  );
}

NumberFieldBase.displayName = 'EtPhoneInput.NumberField';

export const NumberField = memo(NumberFieldBase);

const styles = StyleSheet.create({
  input: {
    flex: 1,
    height: BOX_HEIGHT,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: X4,
    paddingVertical: 13, // per Figma
    fontSize: 18,
    fontWeight: '500',
    fontVariant: ['lining-nums'],
    textAlign: 'left', // LTR on RTL devices
    writingDirection: 'ltr',
  },
  disabled: {
    opacity: 0.6,
  },
});
