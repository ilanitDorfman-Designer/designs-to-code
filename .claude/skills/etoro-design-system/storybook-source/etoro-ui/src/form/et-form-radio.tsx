import { createContext, type ReactNode, useContext, useMemo } from 'react';
import type { FieldError, FieldPath, FieldValues } from 'react-hook-form';
import { useController } from 'react-hook-form';
import type { StyleProp, TextStyle } from 'react-native';

import { RadioIndicator } from '../components/controls/radio-group/components/radio-indicator';
import { FormFieldErrorText } from './form-field-error-text';
import type { EtFormFieldProps } from './types';

interface EtFormRadioContextValue {
  selected: boolean;
  error: FieldError | undefined;
  disabled: boolean;
}

const EtFormRadioContext = createContext<EtFormRadioContextValue | null>(null);

function useEtFormRadioContext() {
  const ctx = useContext(EtFormRadioContext);
  if (!ctx) {
    throw new Error('EtFormRadio sub-components must be used within <EtFormRadio>');
  }
  return ctx;
}

interface EtFormRadioRootProps<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>
  extends EtFormFieldProps<TFieldValues, TName> {
  children: ReactNode;
}

/**
 * EtFormRadio — RHF-enabled compound wrapper for `RadioIndicator` (boolean field = selected).
 *
 * Binds React Hook Form field state via `useController`. The indicator is display-only;
 * wire row-level selection separately if needed (e.g. parent `Pressable`).
 *
 * @example
 * ```tsx
 * <EtFormRadio name="choice" control={control} rules={{ required: 'Pick one' }}>
 *   <EtFormRadio.Control disabled={false} />
 *   <EtFormRadio.ErrorMessage />
 * </EtFormRadio>
 * ```
 */
function EtFormRadioRoot<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({
  name,
  control,
  rules,
  children,
}: EtFormRadioRootProps<TFieldValues, TName>) {
  const {
    field: { value, disabled: fieldDisabled },
    fieldState: { error },
  } = useController({ name, control, rules });

  const selected = Boolean(value);
  const disabled = !!fieldDisabled;
  const contextValue = useMemo(() => ({ selected, error, disabled }), [selected, error, disabled]);

  return <EtFormRadioContext.Provider value={contextValue}>{children}</EtFormRadioContext.Provider>;
}

interface EtFormRadioControlProps {
  disabled?: boolean;
}

/**
 * EtFormRadio.Control — Renders `RadioIndicator` bound to parent field state.
 */
function EtFormRadioControl({ disabled: disabledProp }: EtFormRadioControlProps) {
  const { selected, error, disabled: formDisabled } = useEtFormRadioContext();
  return <RadioIndicator selected={selected} disabled={disabledProp ?? formDisabled} error={!!error} />;
}

interface EtFormRadioErrorMessageProps {
  render?: (props: { message: string | undefined; error: FieldError }) => ReactNode;
  style?: StyleProp<TextStyle>;
  testID?: string;
}

function EtFormRadioErrorMessage({ render, style, testID }: EtFormRadioErrorMessageProps) {
  const { error } = useEtFormRadioContext();
  return <FormFieldErrorText error={error} render={render} style={style} testID={testID} />;
}

export const EtFormRadio = Object.assign(EtFormRadioRoot, {
  Control: EtFormRadioControl,
  ErrorMessage: EtFormRadioErrorMessage,
});
