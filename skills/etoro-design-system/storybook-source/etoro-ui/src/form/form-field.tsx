import type { ReactNode } from 'react';
import type { Control, FieldError, FieldPath, FieldValues, UseControllerProps } from 'react-hook-form';
import { useController } from 'react-hook-form';
import type { StyleProp, ViewStyle } from 'react-native';
import { View } from 'react-native';

import { FormFieldErrorText } from './form-field-error-text';

interface FormFieldBinding<TValue> {
  value: TValue;
  onChange: (value: TValue) => void;
  onBlur: () => void;
  disabled: boolean;
}

export interface FormFieldProps<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> {
  /** RHF field name (supports dotted paths like "address.city"). */
  name: TName;

  /** RHF control object from useForm(). */
  control: Control<TFieldValues>;

  /** RHF validation rules. */
  rules?: UseControllerProps<TFieldValues, TName>['rules'];

  /**
   * Render callback. Receives the field binding (value, onChange, onBlur)
   * and the current error state. Return any controlled component.
   */
  children: (field: FormFieldBinding<TFieldValues[TName]>, error: FieldError | undefined) => ReactNode;

  /**
   * Whether to auto-render the default error text below children.
   * @default true
   */
  showError?: boolean;

  /**
   * Custom error renderer. Replaces the default FormFieldErrorText when provided.
   * Only called when an error exists.
   */
  renderError?: (error: FieldError) => ReactNode;

  /** Style applied to the outer wrapper View. */
  style?: StyleProp<ViewStyle>;
}

/**
 * Generic RHF form field wrapper. Works with any controlled component
 * via a render callback — no per-component wrapper needed.
 *
 * @example Default error display
 * ```tsx
 * <FormField name="countryId" control={control} rules={{ validate: v => v > 0 || 'Required' }}>
 *   {(field) => (
 *     <CountrySelect
 *       selectedCountryId={field.value}
 *       onCountrySelected={(c) => field.onChange(c.countryId)}
 *     />
 *   )}
 * </FormField>
 * ```
 *
 * @example Custom error renderer
 * ```tsx
 * <FormField name="email" control={control} renderError={(err) => <CustomError message={err.message} />}>
 *   {(field) => <EtInput value={field.value} onChangeText={field.onChange} />}
 * </FormField>
 * ```
 *
 * @example No error (handle manually)
 * ```tsx
 * <FormField name="terms" control={control} showError={false}>
 *   {(field, error) => (
 *     <EtCheckbox value={error ? 'error' : field.value} onChange={field.onChange} />
 *   )}
 * </FormField>
 * ```
 */
export function FormField<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({
  name,
  control,
  rules,
  children,
  showError = true,
  renderError,
  style,
}: FormFieldProps<TFieldValues, TName>) {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control, rules });

  const binding: FormFieldBinding<TFieldValues[TName]> = {
    value: field.value,
    onChange: field.onChange,
    onBlur: field.onBlur,
    disabled: !!field.disabled,
  };

  return (
    <View style={style}>
      {children(binding, error)}
      {showError && error && (renderError ? renderError(error) : <FormFieldErrorText error={error} />)}
    </View>
  );
}
