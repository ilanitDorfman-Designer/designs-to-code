import React, { createContext, ReactNode, useCallback, useContext, useMemo } from 'react';
import type { FieldError, FieldPathByValue, FieldValues } from 'react-hook-form';
import { useController } from 'react-hook-form';
import { StyleProp, TextStyle } from 'react-native';

import { EtRadioGroup } from '../components/controls/radio-group/et-radio-group';
import { FormFieldErrorText } from './form-field-error-text';
import type { EtFormFieldProps } from './types';

interface EtFormRadioGroupContextValue {
  onChange: (value: string) => void;
  value: string | null;
  error: FieldError | undefined;
  disabled: boolean;
}

const EtFormRadioGroupContext = createContext<EtFormRadioGroupContextValue | null>(null);

function useEtFormRadioGroupContext() {
  const ctx = useContext(EtFormRadioGroupContext);
  if (!ctx) {
    throw new Error('EtFormRadioGroup sub-components must be used within <EtFormRadioGroup>');
  }
  return ctx;
}

interface EtFormRadioGroupRootProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPathByValue<TFieldValues, string> = FieldPathByValue<TFieldValues, string>,
> extends EtFormFieldProps<TFieldValues, TName> {
  children: ReactNode;
}

/**
 * EtFormRadioGroup.Root — RHF-enabled compound wrapper for EtRadioGroup.
 *
 * Binds React Hook Form field state via `useController`. Sub-components share
 * value, onChange, and error through context. Use EtFormRadioGroup.Option for options.
 *
 * @example
 * ```tsx
 * <EtFormRadioGroup name="gender" control={control} rules={{ required: 'Required' }}>
 *   <EtFormRadioGroup.Control>
 *     <EtFormRadioGroup.Option value="male">Male</EtFormRadioGroup.Option>
 *     <EtFormRadioGroup.Option value="female">Female</EtFormRadioGroup.Option>
 *   </EtFormRadioGroup.Control>
 *   <EtFormRadioGroup.ErrorMessage />
 * </EtFormRadioGroup>
 * ```
 */
function EtFormRadioGroupRoot<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPathByValue<TFieldValues, string> = FieldPathByValue<TFieldValues, string>,
>({ name, control, rules, children }: EtFormRadioGroupRootProps<TFieldValues, TName>) {
  const {
    field: { value, onChange, disabled: fieldDisabled },
    fieldState: { error },
  } = useController({ name, control, rules });

  const disabled = !!fieldDisabled;
  const contextValue = useMemo(() => ({ onChange, value: value ?? null, error, disabled }), [onChange, value, error, disabled]);

  return <EtFormRadioGroupContext.Provider value={contextValue}>{children}</EtFormRadioGroupContext.Provider>;
}

type EtFormRadioGroupControlProps = Omit<React.ComponentProps<typeof EtRadioGroup>, 'value' | 'onChange' | 'error'> & {
  onChange?: (value: string) => void;
};

/**
 * EtFormRadioGroup.Control — Renders EtRadioGroup bound to parent field state.
 * value/onChange/error are injected from context.
 *
 * Optional `onChange` is composed with the RHF handler — both run on each selection.
 */
function EtFormRadioGroupControl({ children, onChange: customOnChange, disabled: disabledProp, ...rest }: EtFormRadioGroupControlProps) {
  const { onChange, value, error, disabled: formDisabled } = useEtFormRadioGroupContext();

  const handleChange = useCallback(
    (val: string) => {
      onChange(val);
      customOnChange?.(val);
    },
    [onChange, customOnChange],
  );

  return (
    <EtRadioGroup value={value} onChange={handleChange} error={!!error} disabled={disabledProp ?? formDisabled} {...rest}>
      {children}
    </EtRadioGroup>
  );
}

interface EtFormRadioGroupErrorMessageProps {
  render?: (props: { message: string | undefined; error: FieldError }) => ReactNode;
  style?: StyleProp<TextStyle>;
  testID?: string;
}

/**
 * EtFormRadioGroup.ErrorMessage — Renders validation error text for the radio group.
 * Returns null when no error. Supports custom render via `render` prop.
 */
function EtFormRadioGroupErrorMessage({ render, style, testID }: EtFormRadioGroupErrorMessageProps) {
  const { error } = useEtFormRadioGroupContext();
  return <FormFieldErrorText error={error} render={render} style={style} testID={testID} />;
}

export const EtFormRadioGroup = Object.assign(EtFormRadioGroupRoot, {
  Control: EtFormRadioGroupControl,
  ErrorMessage: EtFormRadioGroupErrorMessage,
  Option: EtRadioGroup.Option,
});
