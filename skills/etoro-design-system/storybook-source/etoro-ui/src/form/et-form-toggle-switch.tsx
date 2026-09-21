import { type ComponentProps, createContext, type ReactNode, useCallback, useContext, useMemo } from 'react';
import type { FieldError, FieldPath, FieldValues } from 'react-hook-form';
import { useController } from 'react-hook-form';
import { StyleProp, TextStyle } from 'react-native';

import { EtToggleSwitch } from '../components/controls/toggle-switch';
import { FormFieldErrorText } from './form-field-error-text';
import type { EtFormFieldProps } from './types';

interface EtFormToggleSwitchContextValue {
  onChange: (value: boolean) => void;
  value: boolean;
  error: FieldError | undefined;
  disabled: boolean;
}

const EtFormToggleSwitchContext = createContext<EtFormToggleSwitchContextValue | null>(null);

function useEtFormToggleSwitchContext() {
  const ctx = useContext(EtFormToggleSwitchContext);
  if (!ctx) {
    throw new Error('EtFormToggleSwitch sub-components must be used within <EtFormToggleSwitch>');
  }
  return ctx;
}

interface EtFormToggleSwitchRootProps<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>
  extends EtFormFieldProps<TFieldValues, TName> {
  children: ReactNode;
}

/**
 * EtFormToggleSwitch.Root — RHF-enabled compound wrapper for EtToggleSwitch.
 *
 * Binds React Hook Form field state to the underlying EtToggleSwitch via `useController`.
 * Sub-components share field state through React context.
 *
 * @example
 * ```tsx
 * <EtFormToggleSwitch name="notifications" control={control}>
 *   <EtFormToggleSwitch.Control size="small" />
 *   <EtFormToggleSwitch.ErrorMessage />
 * </EtFormToggleSwitch>
 * ```
 */
function EtFormToggleSwitchRoot<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({
  name,
  control,
  rules,
  children,
}: EtFormToggleSwitchRootProps<TFieldValues, TName>) {
  const {
    field: { value, onChange, disabled: fieldDisabled },
    fieldState: { error },
  } = useController({ name, control, rules });

  const switchValue = Boolean(value);
  const disabled = !!fieldDisabled;
  const contextValue = useMemo(() => ({ onChange, value: switchValue, error, disabled }), [onChange, switchValue, error, disabled]);

  return <EtFormToggleSwitchContext.Provider value={contextValue}>{children}</EtFormToggleSwitchContext.Provider>;
}

type EtFormToggleSwitchControlProps = Omit<ComponentProps<typeof EtToggleSwitch>, 'value' | 'onValueChange'> & {
  onValueChange?: (value: boolean) => void;
};

/**
 * EtFormToggleSwitch.Control — Renders EtToggleSwitch bound to parent field state.
 * Receives value/onChange from context.
 *
 * Optional `onValueChange` is composed with the RHF handler — both run on each toggle.
 */
function EtFormToggleSwitchControl({ onValueChange: customOnChange, disabled: disabledProp, ...rest }: EtFormToggleSwitchControlProps) {
  const { onChange, value, disabled: formDisabled } = useEtFormToggleSwitchContext();

  const handleChange = useCallback(
    (newValue: boolean) => {
      onChange(newValue);
      customOnChange?.(newValue);
    },
    [onChange, customOnChange],
  );

  return <EtToggleSwitch value={value} onValueChange={handleChange} disabled={disabledProp ?? formDisabled} {...rest} />;
}

interface EtFormToggleSwitchErrorMessageProps {
  render?: (props: { message: string | undefined; error: FieldError }) => ReactNode;
  style?: StyleProp<TextStyle>;
  testID?: string;
}

/**
 * EtFormToggleSwitch.ErrorMessage — Renders validation error text for the toggle switch.
 * Returns null when no error. Supports custom render via `render` prop.
 */
function EtFormToggleSwitchErrorMessage({ render, style, testID }: EtFormToggleSwitchErrorMessageProps) {
  const { error } = useEtFormToggleSwitchContext();
  return <FormFieldErrorText error={error} render={render} style={style} testID={testID} />;
}

export const EtFormToggleSwitch = Object.assign(EtFormToggleSwitchRoot, {
  Control: EtFormToggleSwitchControl,
  ErrorMessage: EtFormToggleSwitchErrorMessage,
});
