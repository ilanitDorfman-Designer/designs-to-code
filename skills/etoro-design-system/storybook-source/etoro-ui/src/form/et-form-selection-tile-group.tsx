import { createContext, ReactNode, useCallback, useContext, useMemo } from 'react';
import type { FieldError, FieldPath, FieldValues } from 'react-hook-form';
import { useController } from 'react-hook-form';
import { StyleProp, TextStyle } from 'react-native';

import type { EtSelectionTileGroupMultiProps, EtSelectionTileGroupSingleProps } from '../components/controls/selection-tile-group/api/types';
import { EtSelectionTileGroup } from '../components/controls/selection-tile-group/et-selection-tile-group';
import { FormFieldErrorText } from './form-field-error-text';
import type { EtFormFieldProps } from './types';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface EtFormSelectionTileGroupContextValue {
  value: string | null | string[];
  onChange: (value: string | string[] | null) => void;
  error: FieldError | undefined;
  disabled: boolean;
}

const EtFormSelectionTileGroupContext = createContext<EtFormSelectionTileGroupContextValue | null>(null);

function useEtFormSelectionTileGroupContext() {
  const ctx = useContext(EtFormSelectionTileGroupContext);
  if (!ctx) {
    throw new Error('EtFormSelectionTileGroup sub-components must be used within <EtFormSelectionTileGroup>');
  }
  return ctx;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

interface EtFormSelectionTileGroupRootProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends EtFormFieldProps<TFieldValues, TName> {
  children: ReactNode;
}

/**
 * EtFormSelectionTileGroup — RHF-enabled compound wrapper for EtSelectionTileGroup.
 *
 * Binds React Hook Form field state via `useController`. Sub-components share
 * value, onChange, and error through context.
 *
 * @example single-select (field value is `string`)
 * ```tsx
 * <EtFormSelectionTileGroup name="country" control={control} rules={{ required: 'Required' }}>
 *   <EtFormSelectionTileGroup.Control variant="radio">
 *     <EtFormSelectionTileGroup.Option value="us">United States</EtFormSelectionTileGroup.Option>
 *     <EtFormSelectionTileGroup.Option value="uk">United Kingdom</EtFormSelectionTileGroup.Option>
 *   </EtFormSelectionTileGroup.Control>
 *   <EtFormSelectionTileGroup.ErrorMessage />
 * </EtFormSelectionTileGroup>
 * ```
 *
 * @example multi-select (field value is `string[]`)
 * ```tsx
 * <EtFormSelectionTileGroup name="interests" control={control}>
 *   <EtFormSelectionTileGroup.Control variant="toggleInput" selectionMode="multi">
 *     <EtFormSelectionTileGroup.Option value="stocks">Stocks</EtFormSelectionTileGroup.Option>
 *     <EtFormSelectionTileGroup.Option value="crypto">Crypto</EtFormSelectionTileGroup.Option>
 *   </EtFormSelectionTileGroup.Control>
 *   <EtFormSelectionTileGroup.ErrorMessage />
 * </EtFormSelectionTileGroup>
 * ```
 */
function EtFormSelectionTileGroupRoot<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ name, control, rules, children }: EtFormSelectionTileGroupRootProps<TFieldValues, TName>) {
  const {
    field: { value, onChange, disabled: fieldDisabled },
    fieldState: { error },
  } = useController({ name, control, rules });

  const disabled = !!fieldDisabled;

  const contextValue = useMemo(
    () => ({
      onChange: onChange as (value: string | null | string[]) => void,
      value: (value ?? null) as string | null | string[],
      error,
      disabled,
    }),
    [onChange, value, error, disabled],
  );

  return <EtFormSelectionTileGroupContext.Provider value={contextValue}>{children}</EtFormSelectionTileGroupContext.Provider>;
}

// ---------------------------------------------------------------------------
// Control — single-select
// ---------------------------------------------------------------------------

type EtFormSelectionTileGroupSingleControlProps = Omit<EtSelectionTileGroupSingleProps, 'value' | 'onChange'> & {
  onChange?: (value: string | null) => void;
};

// ---------------------------------------------------------------------------
// Control — multi-select
// ---------------------------------------------------------------------------

type EtFormSelectionTileGroupMultiControlProps = Omit<EtSelectionTileGroupMultiProps, 'value' | 'onChange'> & {
  onChange?: (value: string[]) => void;
};

type EtFormSelectionTileGroupControlProps = EtFormSelectionTileGroupSingleControlProps | EtFormSelectionTileGroupMultiControlProps;

/**
 * EtFormSelectionTileGroup.Control — Renders EtSelectionTileGroup bound to parent field state.
 * value/onChange are injected from context.
 *
 * Pass `selectionMode="multi"` + `variant="toggle"` or `variant="toggleInput"` to
 * enable multi-select (field value must be `string[]`). Default is single-select
 * (`string | null`).
 *
 * Optional `onChange` is composed with the RHF handler — both run on each selection.
 */
function EtFormSelectionTileGroupControl(props: EtFormSelectionTileGroupControlProps) {
  const { children, onChange: customOnChange, disabled: disabledProp, ...rest } = props;
  const { onChange, value, disabled: formDisabled } = useEtFormSelectionTileGroupContext();
  const disabled = disabledProp ?? formDisabled;

  const isMulti = 'selectionMode' in rest && rest.selectionMode === 'multi';

  const handleSingleChange = useCallback(
    (val: string | null) => {
      onChange(val);
      (customOnChange as ((v: string | null) => void) | undefined)?.(val);
    },
    [onChange, customOnChange],
  );

  const handleMultiChange = useCallback(
    (val: string[]) => {
      onChange(val);
      (customOnChange as ((v: string[]) => void) | undefined)?.(val);
    },
    [onChange, customOnChange],
  );

  if (isMulti) {
    return (
      <EtSelectionTileGroup
        {...(rest as Omit<EtSelectionTileGroupMultiProps, 'value' | 'onChange'>)}
        value={(value as string[]) ?? []}
        onChange={handleMultiChange}
        disabled={disabled}
      >
        {children}
      </EtSelectionTileGroup>
    );
  }

  return (
    <EtSelectionTileGroup
      {...(rest as Omit<EtSelectionTileGroupSingleProps, 'value' | 'onChange'>)}
      value={(value as string | null) ?? null}
      onChange={handleSingleChange}
      disabled={disabled}
    >
      {children}
    </EtSelectionTileGroup>
  );
}

// ---------------------------------------------------------------------------
// ErrorMessage
// ---------------------------------------------------------------------------

interface EtFormSelectionTileGroupErrorMessageProps {
  render?: (props: { message: string | undefined; error: FieldError }) => ReactNode;
  style?: StyleProp<TextStyle>;
  testID?: string;
}

/**
 * EtFormSelectionTileGroup.ErrorMessage — Renders validation error text for the selection group.
 * Returns null when no error. Supports custom render via `render` prop.
 */
function EtFormSelectionTileGroupErrorMessage({ render, style, testID }: EtFormSelectionTileGroupErrorMessageProps) {
  const { error } = useEtFormSelectionTileGroupContext();
  return <FormFieldErrorText error={error} render={render} style={style} testID={testID} />;
}

// ---------------------------------------------------------------------------
// Compound export
// ---------------------------------------------------------------------------

export const EtFormSelectionTileGroup = Object.assign(EtFormSelectionTileGroupRoot, {
  Control: EtFormSelectionTileGroupControl,
  ErrorMessage: EtFormSelectionTileGroupErrorMessage,
  Option: EtSelectionTileGroup.Option,
});
