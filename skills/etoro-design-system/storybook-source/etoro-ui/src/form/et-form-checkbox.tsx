import React, { createContext, ReactNode, useCallback, useContext, useMemo } from 'react';
import type { FieldError, FieldPath, FieldValues } from 'react-hook-form';
import { useController } from 'react-hook-form';
import { StyleProp, TextStyle } from 'react-native';

import { EtCheckbox } from '../components/controls/checkbox/et-checkbox';
import { FormFieldErrorText } from './form-field-error-text';
import type { EtFormFieldProps } from './types';

interface EtFormCheckboxContextValue {
  onChange: (checked: boolean) => void;
  checkboxValue: boolean | 'error';
  error: FieldError | undefined;
  disabled: boolean;
}

const EtFormCheckboxContext = createContext<EtFormCheckboxContextValue | null>(null);

function useEtFormCheckboxContext() {
  const ctx = useContext(EtFormCheckboxContext);
  if (!ctx) {
    throw new Error('EtFormCheckbox sub-components must be used within <EtFormCheckbox>');
  }
  return ctx;
}

interface EtFormCheckboxRootProps<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>
  extends EtFormFieldProps<TFieldValues, TName> {
  children: ReactNode;
}

/**
 * EtFormCheckbox.Root — RHF-enabled compound wrapper for EtCheckbox.
 *
 * Binds React Hook Form field state to the underlying EtCheckbox via `useController`.
 * Sub-components share field state through React context.
 *
 * @example
 * ```tsx
 * <EtFormCheckbox name="terms" control={control} rules={{ validate: v => v || 'Required' }}>
 *   <EtFormCheckbox.Control>
 *     <EtFormCheckbox.Label>I agree</EtFormCheckbox.Label>
 *   </EtFormCheckbox.Control>
 *   <EtFormCheckbox.ErrorMessage />
 * </EtFormCheckbox>
 * ```
 */
function EtFormCheckboxRoot<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({
  name,
  control,
  rules,
  children,
}: EtFormCheckboxRootProps<TFieldValues, TName>) {
  const {
    field: { value, onChange, disabled: fieldDisabled },
    fieldState: { error },
  } = useController({ name, control, rules });

  const checked = Boolean(value);
  const checkboxValue: boolean | 'error' = error && !checked ? 'error' : checked;
  const disabled = !!fieldDisabled;

  const contextValue = useMemo(() => ({ onChange, checkboxValue, error, disabled }), [onChange, checkboxValue, error, disabled]);

  return <EtFormCheckboxContext.Provider value={contextValue}>{children}</EtFormCheckboxContext.Provider>;
}

interface EtFormCheckboxControlProps {
  disabled?: boolean;
  haptics?: boolean;
  style?: React.ComponentProps<typeof EtCheckbox>['style'];
  testID?: string;
  accessibilityLabel?: string;
  children?: React.ReactNode;
  onChange?: (checked: boolean) => void;
}

/**
 * EtFormCheckbox.Control — Renders EtCheckbox bound to parent field state.
 * Receives value/onChange from context. Use EtFormCheckbox.Label inside for the label.
 *
 * Optional `onChange` is composed with the RHF handler — both run on each toggle.
 */
function EtFormCheckboxControl({ children, onChange: customOnChange, disabled: disabledProp, ...rest }: EtFormCheckboxControlProps) {
  const { onChange, checkboxValue, disabled: formDisabled } = useEtFormCheckboxContext();

  const handleChange = useCallback(
    (checked: boolean) => {
      onChange(checked);
      customOnChange?.(checked);
    },
    [onChange, customOnChange],
  );

  return (
    <EtCheckbox value={checkboxValue} onChange={handleChange} disabled={disabledProp ?? formDisabled} {...rest}>
      {children}
    </EtCheckbox>
  );
}

interface EtFormCheckboxErrorMessageProps {
  render?: (props: { message: string | undefined; error: FieldError }) => ReactNode;
  style?: StyleProp<TextStyle>;
  testID?: string;
}

/**
 * EtFormCheckbox.ErrorMessage — Renders validation error text for the checkbox.
 * Returns null when no error. Supports custom render via `render` prop.
 */
function EtFormCheckboxErrorMessage({ render, style, testID }: EtFormCheckboxErrorMessageProps) {
  const { error } = useEtFormCheckboxContext();
  return <FormFieldErrorText error={error} render={render} style={style} testID={testID} />;
}

export const EtFormCheckbox = Object.assign(EtFormCheckboxRoot, {
  Control: EtFormCheckboxControl,
  ErrorMessage: EtFormCheckboxErrorMessage,
  Label: EtCheckbox.Label,
});
