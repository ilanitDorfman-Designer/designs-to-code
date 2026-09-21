import { type ComponentProps, createContext, type ReactNode, useCallback, useContext, useMemo } from 'react';
import type { FieldError, FieldPath, FieldValues } from 'react-hook-form';
import { useController } from 'react-hook-form';
import { StyleProp, TextStyle } from 'react-native';

import { EtChip } from '../components/controls/chips/et-chip';
import { FormFieldErrorText } from './form-field-error-text';
import type { EtFormFieldProps } from './types';

interface EtFormChipContextValue {
  onChange: (selected: boolean) => void;
  selected: boolean;
  error: FieldError | undefined;
  disabled: boolean;
}

const EtFormChipContext = createContext<EtFormChipContextValue | null>(null);

function useEtFormChipContext() {
  const ctx = useContext(EtFormChipContext);
  if (!ctx) {
    throw new Error('EtFormChip sub-components must be used within <EtFormChip>');
  }
  return ctx;
}

interface EtFormChipRootProps<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>
  extends EtFormFieldProps<TFieldValues, TName> {
  children: ReactNode;
}

/**
 * EtFormChip.Root — RHF-enabled compound wrapper for EtChip.
 *
 * Binds React Hook Form field state to the underlying EtChip via `useController`.
 * Sub-components share field state through React context.
 *
 * @example
 * ```tsx
 * <EtFormChip name="premium" control={control} rules={{ validate: v => v || 'Required' }}>
 *   <EtFormChip.Control>
 *     <EtFormChip.Label>Premium</EtFormChip.Label>
 *   </EtFormChip.Control>
 *   <EtFormChip.ErrorMessage />
 * </EtFormChip>
 * ```
 */
function EtFormChipRoot<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({
  name,
  control,
  rules,
  children,
}: EtFormChipRootProps<TFieldValues, TName>) {
  const {
    field: { value, onChange, disabled: fieldDisabled },
    fieldState: { error },
  } = useController({ name, control, rules });

  const selected = Boolean(value);
  const disabled = !!fieldDisabled;
  const contextValue = useMemo(() => ({ onChange, selected, error, disabled }), [onChange, selected, error, disabled]);

  return <EtFormChipContext.Provider value={contextValue}>{children}</EtFormChipContext.Provider>;
}

interface EtFormChipControlProps {
  disabled?: boolean;
  haptics?: boolean;
  showCloseOnSelected?: boolean;
  style?: ComponentProps<typeof EtChip>['style'];
  testID?: string;
  accessibilityLabel?: string;
  children?: ReactNode;
  onSelectionChange?: (selected: boolean) => void;
}

/**
 * EtFormChip.Control — Renders EtChip bound to parent field state.
 * Receives selected/onChange from context. Use EtFormChip.Label inside for the label.
 *
 * Optional `onSelectionChange` is composed with the RHF handler — both run on each toggle.
 */
function EtFormChipControl({ children, onSelectionChange: customOnChange, disabled: disabledProp, ...rest }: EtFormChipControlProps) {
  const { onChange, selected, disabled: formDisabled } = useEtFormChipContext();

  const handleChange = useCallback(
    (newSelected: boolean) => {
      onChange(newSelected);
      customOnChange?.(newSelected);
    },
    [onChange, customOnChange],
  );

  return (
    <EtChip selected={selected} onSelectionChange={handleChange} disabled={disabledProp ?? formDisabled} {...rest}>
      {children}
    </EtChip>
  );
}

interface EtFormChipErrorMessageProps {
  render?: (props: { message: string | undefined; error: FieldError }) => ReactNode;
  style?: StyleProp<TextStyle>;
  testID?: string;
}

/**
 * EtFormChip.ErrorMessage — Renders validation error text for the chip.
 * Returns null when no error. Supports custom render via `render` prop.
 */
function EtFormChipErrorMessage({ render, style, testID }: EtFormChipErrorMessageProps) {
  const { error } = useEtFormChipContext();
  return <FormFieldErrorText error={error} render={render} style={style} testID={testID} />;
}

export const EtFormChip = Object.assign(EtFormChipRoot, {
  Control: EtFormChipControl,
  ErrorMessage: EtFormChipErrorMessage,
  Label: EtChip.Label,
  Icon: EtChip.Icon,
});
