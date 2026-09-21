import React, { createContext, ReactNode, Ref, useCallback, useContext, useMemo } from 'react';
import { type ControllerRenderProps, type FieldError, type FieldPathByValue, type FieldValues, useController } from 'react-hook-form';
import { StyleProp, TextInput, TextStyle } from 'react-native';

import type { InputFieldProps } from '../components/input/input-v2/api/types';
import { EtInput } from '../components/input/input-v2/et-input';
import { FormFieldErrorText } from './form-field-error-text';
import type { EtFormFieldProps } from './types';

interface EtFormInputContextValue {
  field: ControllerRenderProps<FieldValues, string>;
  error: FieldError | undefined;
  hideError: boolean;
  disabled: boolean;
}

const EtFormInputContext = createContext<EtFormInputContextValue | null>(null);

function useEtFormInputContext() {
  const ctx = useContext(EtFormInputContext);
  if (!ctx) {
    throw new Error('EtFormInput sub-components must be used within <EtFormInput>');
  }
  return ctx;
}

interface EtFormInputRootProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPathByValue<TFieldValues, string | null> = FieldPathByValue<TFieldValues, string | null>,
> extends EtFormFieldProps<TFieldValues, TName> {
  children: ReactNode;
  hideError?: boolean;
}

/**
 * EtFormInput.Root — RHF-enabled compound wrapper for EtInput.
 *
 * Binds field state via `useController`. Use hideError when errors are shown via
 * shared EtFormErrorMessage instead of inline on the control.
 *
 * @example
 * ```tsx
 * <EtFormInput name="email" control={control} rules={{ required: 'Required' }}>
 *   <EtFormInput.Control>
 *     <EtFormInput.Label>Email</EtFormInput.Label>
 *     <EtFormInput.Field />
 *   </EtFormInput.Control>
 *   <EtFormInput.ErrorMessage />
 * </EtFormInput>
 * ```
 */
function EtFormInputRoot<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPathByValue<TFieldValues, string | null> = FieldPathByValue<TFieldValues, string | null>,
>({ name, control, rules, children, hideError = false }: EtFormInputRootProps<TFieldValues, TName>) {
  const { field, fieldState } = useController({ name, control, rules });

  const disabled = !!field.disabled;

  const contextValue = useMemo(
    () => ({
      // Widening from ControllerRenderProps<TFieldValues, TName> to the erased
      // base type stored in context. Structural compatibility is guaranteed because
      // TFieldValues extends FieldValues and TName extends string.
      field: field as ControllerRenderProps<FieldValues, string>,
      error: fieldState.error,
      hideError,
      disabled,
    }),
    [field, fieldState.error, hideError, disabled],
  );

  return <EtFormInputContext.Provider value={contextValue}>{children}</EtFormInputContext.Provider>;
}

type EtFormInputControlProps = Omit<React.ComponentProps<typeof EtInput>, 'defaultValue' | 'error' | 'value'>;

/**
 * EtFormInput.Control — Renders EtInput layout container bound to parent field.
 * defaultValue and error are injected from context. Use EtFormInput.Field inside for the text input.
 */
function EtFormInputControl({ children, disabled: disabledProp, ...rest }: EtFormInputControlProps) {
  const { field, error, hideError, disabled: formDisabled } = useEtFormInputContext();
  return (
    <EtInput defaultValue={field.value ?? ''} error={hideError ? null : (error?.message ?? null)} disabled={disabledProp ?? formDisabled} {...rest}>
      {children}
    </EtInput>
  );
}

type EtFormInputFieldProps = Omit<InputFieldProps, 'ref' | 'value'> & {
  ref?: Ref<TextInput>;
};

/**
 * EtFormInput.Field — Text input field auto-bound to RHF. Connects onChangeText,
 * onBlur, and ref to the form field. Place inside EtFormInput.Control.
 *
 * Optional `onChangeText` and `onBlur` callbacks are composed with the RHF
 * handlers so that both the form state update and the custom side-effect run.
 */
function EtFormInputField({ ref: externalRef, onChangeText, onBlur, ...rest }: EtFormInputFieldProps) {
  const { field } = useEtFormInputContext();

  // Destructure the stable method references from field. RHF creates field.ref,
  // field.onChange, and field.onBlur with useCallback internally so their references
  // are stable across renders (unlike the field object itself, which is reconstructed
  // whenever field.value changes). Using the destructured names in deps prevents
  // unnecessary ref-callback cycling (which would unregister/re-register the field).
  const { ref: fieldRef, onChange: fieldOnChange, onBlur: fieldOnBlur, value } = field;

  // Compose RHF's ref with any consumer-provided external ref so that both
  // RHF's focus() management and the external ref callback/object are satisfied.
  const composedRef = useCallback(
    (node: TextInput | null) => {
      // fieldRef is always RefCallBack (a function) in react-hook-form
      fieldRef(node);
      if (typeof externalRef === 'function') {
        externalRef(node);
      } else if (externalRef) {
        (externalRef as React.MutableRefObject<TextInput | null>).current = node;
      }
    },
    [fieldRef, externalRef],
  );

  const handleChangeText = useCallback(
    (text: string) => {
      fieldOnChange(text);
      onChangeText?.(text);
    },
    [fieldOnChange, onChangeText],
  );

  const handleBlur = useCallback<NonNullable<EtFormInputFieldProps['onBlur']>>(
    (e) => {
      fieldOnBlur();
      onBlur?.(e);
    },
    [fieldOnBlur, onBlur],
  );

  return <EtInput.Field ref={composedRef} value={value ?? ''} onChangeText={handleChangeText} onBlur={handleBlur} {...rest} />;
}

EtFormInputField.displayName = 'EtInput.Field';

interface EtFormInputErrorMessageProps {
  render?: (props: { message: string | undefined; error: FieldError }) => ReactNode;
  style?: StyleProp<TextStyle>;
  testID?: string;
}

/**
 * EtFormInput.ErrorMessage — Renders validation error text for the input.
 * Returns null when no error. Supports custom render via `render` prop.
 */
function EtFormInputErrorMessage({ render, style, testID }: EtFormInputErrorMessageProps) {
  const { error } = useEtFormInputContext();
  return <FormFieldErrorText error={error} render={render} style={style} testID={testID} />;
}

export const EtFormInput = Object.assign(EtFormInputRoot, {
  Control: EtFormInputControl,
  ErrorMessage: EtFormInputErrorMessage,
  Field: EtFormInputField,
  Label: EtInput.Label,
  TextAdornment: EtInput.TextAdornment,
  IconAdornment: EtInput.IconAdornment,
});
