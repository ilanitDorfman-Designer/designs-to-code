import { forwardRef } from 'react';
import { Platform, StyleSheet, TextInput } from 'react-native';

import { useEtoroTheme } from '../../../../core/hooks/use-etoro-theme';
import { DatepickerFieldProps } from '../../api/types';
import { useDatepickerConfig, useDatepickerInteraction, useDatepickerValue } from '../../context';

export const InputFieldDisplay = forwardRef<TextInput, DatepickerFieldProps>(function InputFieldDisplay(
  { placeholder, testID, accessibilityLabel, accessibilityHint },
  ref,
) {
  const { colors } = useEtoroTheme();
  const { disabled, readonly } = useDatepickerConfig();
  const { isFocused, isCompact, handleOpenPicker } = useDatepickerInteraction();
  const { formattedValue } = useDatepickerValue();

  const isEditable = !disabled && !readonly;
  // Match InputV2: hide value color when empty & idle so the floating label is the only chrome.
  const textColor = !isCompact ? 'transparent' : disabled ? colors.carbon500 : colors.carbon900;

  return (
    <TextInput
      ref={ref}
      style={[
        styles.input,
        {
          color: textColor,
        },
      ]}
      value={formattedValue}
      placeholder={isFocused ? placeholder : undefined}
      placeholderTextColor={colors.carbon400}
      editable={false}
      onPressIn={isEditable ? handleOpenPicker : undefined}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityRole="button"
      accessibilityState={{ disabled: !isEditable }}
    />
  );
});

InputFieldDisplay.displayName = 'EtDatepicker.Field';

const styles = StyleSheet.create({
  input: {
    height: Platform.OS === 'ios' ? 24 : 28,
    flex: 1,
    fontSize: 16,
    padding: 0,
    margin: 0,
  },
});
