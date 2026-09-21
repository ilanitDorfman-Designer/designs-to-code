import type { ReactNode } from 'react';
import type { FieldError } from 'react-hook-form';
import { StyleProp, StyleSheet, TextStyle } from 'react-native';

import { useEtoroTheme } from '../core/hooks';
import { X1 } from '../core/styles/spacing';
import { EtText } from '../foundations/text/et-text';

interface FormFieldErrorTextProps {
  error: FieldError | undefined;
  render?: (props: { message: string | undefined; error: FieldError }) => ReactNode;
  style?: StyleProp<TextStyle>;
  testID?: string;
}

/**
 * Internal shared component for rendering a single field-level validation error.
 * Used by EtFormCheckbox.ErrorMessage, EtFormRadio.ErrorMessage, and EtFormRadioGroup.ErrorMessage.
 * Returns null when no error is present.
 */
export function FormFieldErrorText({ error, render, style, testID }: FormFieldErrorTextProps) {
  const { colors } = useEtoroTheme();

  if (!error) return null;

  if (render) {
    return <>{render({ message: error.message, error })}</>;
  }

  if (!error.message) return null;

  return (
    <EtText variant="body-tiny-regular" style={[{ color: colors.statusNegative }, styles.errorText, style]} testID={testID}>
      {error.message}
    </EtText>
  );
}

const styles = StyleSheet.create({
  errorText: { marginTop: X1 },
});
