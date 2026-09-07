import React, { forwardRef } from 'react';
import { Platform, StyleSheet, TextInput } from 'react-native';

import { useEtoroTheme } from '../../../../core/hooks';
import { TimepickerFieldProps } from '../../api/types';
import { useTimepickerConfig, useTimepickerInteraction, useTimepickerValue } from '../../context';

export const InputFieldDisplay = React.memo(
  forwardRef<TextInput, TimepickerFieldProps>(function InputFieldDisplay({ placeholder, testID, accessibilityLabel, accessibilityHint }, ref) {
    const { colors } = useEtoroTheme();
    const { disabled, readonly } = useTimepickerConfig();
    const { isFocused, handleOpenPicker } = useTimepickerInteraction();
    const { formattedValue } = useTimepickerValue();

    const isEditable = !disabled && !readonly;

    return (
      <TextInput
        ref={ref}
        style={[
          styles.input,
          {
            color: disabled ? colors.textSecondaryNeutral : colors.textPrimaryNeutral,
          },
        ]}
        value={formattedValue}
        placeholder={isFocused ? placeholder : undefined}
        placeholderTextColor={colors.textQuaternaryNeutral}
        editable={false}
        onPressIn={isEditable ? handleOpenPicker : undefined}
        testID={testID}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityRole="button"
        accessibilityState={{ disabled: !isEditable }}
      />
    );
  }),
);

InputFieldDisplay.displayName = 'EtTimepicker.Field';

const styles = StyleSheet.create({
  input: {
    height: Platform.OS === 'ios' ? 24 : 28,
    flex: 1,
    fontSize: 16,
    padding: 0,
    margin: 0,
  },
});
