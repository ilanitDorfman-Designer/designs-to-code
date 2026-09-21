import { createContext, ReactNode, useCallback, useContext, useMemo } from 'react';
import type { FieldError, FieldPath, FieldValues } from 'react-hook-form';
import { useController } from 'react-hook-form';
import { StyleProp, TextStyle, View } from 'react-native';

import type { EtChipsGroupV2Props } from '../components/controls/chips-group-v2';
import { EtChipsGroupV2 } from '../components/controls/chips-group-v2';
import { FormFieldErrorText } from './form-field-error-text';
import type { EtFormFieldProps } from './types';

interface EtFormChipGroupContextValue {
  replace: (values: string[]) => void;
  value: string[];
  error: FieldError | undefined;
  disabled: boolean;
}

const EtFormChipGroupContext = createContext<EtFormChipGroupContextValue | null>(null);

function useEtFormChipGroupContext() {
  const ctx = useContext(EtFormChipGroupContext);
  if (!ctx) {
    throw new Error('EtFormChipGroup sub-components must be used within <EtFormChipGroup>');
  }
  return ctx;
}

interface EtFormChipGroupRootProps<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>
  extends EtFormFieldProps<TFieldValues, TName> {
  children: ReactNode;
}

/**
 * EtFormChipGroup — RHF-enabled compound wrapper for multi-select chip groups.
 *
 * Manages a `string[]` field. Wraps EtChipsGroupV2 — pass chip data via `items` on Control.
 *
 * @example
 * ```tsx
 * <EtFormChipGroup name="interests" control={control} rules={{ required: 'Pick at least one' }}>
 *   <EtFormChipGroup.Control items={[
 *     { id: 'stocks', label: 'Stocks' },
 *     { id: 'crypto', label: 'Crypto', icon: 'bitcoin' },
 *   ]} />
 *   <EtFormChipGroup.ErrorMessage />
 * </EtFormChipGroup>
 * ```
 */
function EtFormChipGroupRoot<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({
  name,
  control,
  rules,
  children,
}: EtFormChipGroupRootProps<TFieldValues, TName>) {
  const {
    field: { value, onChange, disabled: fieldDisabled },
    fieldState: { error },
  } = useController({ name, control, rules });

  const disabled = !!fieldDisabled;

  const arrayValue: string[] = useMemo(() => {
    if (Array.isArray(value)) return value as string[];
    if (value != null && value !== '') return [String(value)];
    return [];
  }, [value]);

  const replace = useCallback(
    (values: string[]) => {
      onChange(values.length ? values : (null as unknown as TFieldValues[TName]));
    },
    [onChange],
  );

  const contextValue = useMemo(() => ({ replace, value: arrayValue, error, disabled }), [replace, arrayValue, error, disabled]);

  return <EtFormChipGroupContext.Provider value={contextValue}>{children}</EtFormChipGroupContext.Provider>;
}

type EtFormChipGroupControlProps = Omit<EtChipsGroupV2Props, 'selectionMode' | 'value' | 'onChange'> & {
  /** Composed onChange — runs after the RHF handler on each selection change. */
  onChange?: (value: string[]) => void;
  disabled?: boolean;
};

/**
 * EtFormChipGroup.Control — Renders EtChipsGroupV2 bound to parent field state.
 * value/onChange are injected from context. Defaults to `layout="wrap"`.
 *
 * Optional `onChange` is composed with the RHF handler — both run on each selection.
 */
function EtFormChipGroupControl({ items, onChange: customOnChange, disabled: disabledProp, layout = 'wrap', ...rest }: EtFormChipGroupControlProps) {
  const { replace, value, disabled: formDisabled } = useEtFormChipGroupContext();
  const disabled = disabledProp ?? formDisabled;

  const handleChange = useCallback(
    (newValue: string[]) => {
      replace(newValue);
      customOnChange?.(newValue);
    },
    [replace, customOnChange],
  );

  return (
    <View pointerEvents={disabled ? 'none' : 'auto'}>
      <EtChipsGroupV2 items={items} selectionMode="multi" value={value} onChange={handleChange} layout={layout} {...rest} />
    </View>
  );
}

interface EtFormChipGroupErrorMessageProps {
  render?: (props: { message: string | undefined; error: FieldError }) => ReactNode;
  style?: StyleProp<TextStyle>;
  testID?: string;
}

function EtFormChipGroupErrorMessage({ render, style, testID }: EtFormChipGroupErrorMessageProps) {
  const { error } = useEtFormChipGroupContext();
  return <FormFieldErrorText error={error} render={render} style={style} testID={testID} />;
}

export const EtFormChipGroup = Object.assign(EtFormChipGroupRoot, {
  Control: EtFormChipGroupControl,
  ErrorMessage: EtFormChipGroupErrorMessage,
});

/** Access group context from custom components rendered inside the group. */
export { useEtFormChipGroupContext };

/** Re-export ChipsGroupItem for consumers that build items arrays. */
export type { ChipsGroupItem } from '../components/controls/chips-group-v2';
