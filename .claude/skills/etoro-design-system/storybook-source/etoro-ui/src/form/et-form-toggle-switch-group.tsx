import { createContext, ReactNode, useCallback, useContext, useMemo } from 'react';
import type { FieldError, FieldPath, FieldValues } from 'react-hook-form';
import { useController } from 'react-hook-form';
import { Pressable, StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';

import { EtToggleSwitch } from '../components/controls/toggle-switch';
import { useEtoroTheme } from '../core/hooks';
import { EtText } from '../foundations/text/et-text';
import { FormFieldErrorText } from './form-field-error-text';
import type { EtFormFieldProps } from './types';

interface EtFormToggleSwitchGroupContextValue {
  toggle: (optionValue: string) => void;
  replace: (values: string[]) => void;
  value: string[];
  error: FieldError | undefined;
  disabled: boolean;
}

const EtFormToggleSwitchGroupContext = createContext<EtFormToggleSwitchGroupContextValue | null>(null);

function useEtFormToggleSwitchGroupContext() {
  const ctx = useContext(EtFormToggleSwitchGroupContext);
  if (!ctx) {
    throw new Error('EtFormToggleSwitchGroup sub-components must be used within <EtFormToggleSwitchGroup>');
  }
  return ctx;
}

interface EtFormToggleSwitchGroupRootProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends EtFormFieldProps<TFieldValues, TName> {
  children: ReactNode;
}

/**
 * EtFormToggleSwitchGroup — RHF-enabled compound wrapper for multi-select toggle groups.
 *
 * Manages a `string[]` field. Each Option toggles its value in/out of the array
 * and renders a row with label text + toggle switch indicator.
 *
 * @example
 * ```tsx
 * <EtFormToggleSwitchGroup name="qualifications" control={control}>
 *   <EtFormToggleSwitchGroup.Control>
 *     <EtFormToggleSwitchGroup.Option value="cert">Certificate</EtFormToggleSwitchGroup.Option>
 *     <EtFormToggleSwitchGroup.Option value="degree">Degree</EtFormToggleSwitchGroup.Option>
 *   </EtFormToggleSwitchGroup.Control>
 *   <EtFormToggleSwitchGroup.ErrorMessage />
 * </EtFormToggleSwitchGroup>
 * ```
 */
function EtFormToggleSwitchGroupRoot<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ name, control, rules, children }: EtFormToggleSwitchGroupRootProps<TFieldValues, TName>) {
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

  const toggle = useCallback(
    (optionValue: string) => {
      const next = arrayValue.includes(optionValue) ? arrayValue.filter((v) => v !== optionValue) : [...arrayValue, optionValue];
      onChange(next.length ? next : (null as unknown as TFieldValues[TName]));
    },
    [arrayValue, onChange],
  );

  const replace = useCallback(
    (values: string[]) => {
      onChange(values.length ? values : (null as unknown as TFieldValues[TName]));
    },
    [onChange],
  );

  const contextValue = useMemo(() => ({ toggle, replace, value: arrayValue, error, disabled }), [toggle, replace, arrayValue, error, disabled]);

  return <EtFormToggleSwitchGroupContext.Provider value={contextValue}>{children}</EtFormToggleSwitchGroupContext.Provider>;
}

interface EtFormToggleSwitchGroupControlProps {
  children: ReactNode;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/**
 * EtFormToggleSwitchGroup.Control — Vertical layout container for toggle switch options.
 */
function EtFormToggleSwitchGroupControl({ children, disabled: disabledProp, style, testID }: EtFormToggleSwitchGroupControlProps) {
  const { disabled: formDisabled } = useEtFormToggleSwitchGroupContext();
  const disabled = disabledProp ?? formDisabled;
  return (
    <View style={[styles.container, style]} pointerEvents={disabled ? 'none' : 'auto'} testID={testID}>
      {children}
    </View>
  );
}

interface EtFormToggleSwitchGroupOptionProps {
  value: string;
  children: string;
  disabled?: boolean;
  /** Overrides the default toggle behavior when pressed. */
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  accessibilityLabel?: string;
}

/**
 * EtFormToggleSwitchGroup.Option — Row with label + toggle switch indicator.
 * Toggles the option value in/out of the group array on press.
 * Pass `onPress` to override the default toggle (e.g. for unselectAll behavior).
 */
function EtFormToggleSwitchGroupOption({
  value: optionValue,
  children,
  disabled: disabledProp,
  onPress: customOnPress,
  style,
  testID,
  accessibilityLabel,
}: EtFormToggleSwitchGroupOptionProps) {
  const { toggle, value: selectedValues, disabled: formDisabled } = useEtFormToggleSwitchGroupContext();
  const disabled = disabledProp ?? formDisabled;
  const { colors } = useEtoroTheme();
  const isSelected = selectedValues.includes(optionValue);

  const handlePress = useCallback(() => {
    if (!disabled) {
      customOnPress ? customOnPress() : toggle(optionValue);
    }
  }, [disabled, customOnPress, toggle, optionValue]);

  const dynamicStyles = useMemo(
    () => ({
      backgroundColor: colors.bgGreyPrimary,
      borderColor: isSelected ? colors.textTertiaryNeutral : 'transparent',
    }),
    [colors.bgGreyPrimary, colors.textTertiaryNeutral, isSelected],
  );

  const labelColor = useMemo(() => ({ color: colors.textPrimaryNeutral }), [colors.textPrimaryNeutral]);

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={[styles.option, dynamicStyles, disabled && styles.optionDisabled, style]}
      testID={testID}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: isSelected, disabled }}
      accessibilityLabel={accessibilityLabel ?? children}
    >
      <EtText variant="body-tiny-medium" style={[styles.label, labelColor]}>
        {children}
      </EtText>
      <View pointerEvents="none">
        <EtToggleSwitch value={isSelected} onValueChange={handlePress} size="small" haptics={false} />
      </View>
    </Pressable>
  );
}

interface EtFormToggleSwitchGroupErrorMessageProps {
  render?: (props: { message: string | undefined; error: FieldError }) => ReactNode;
  style?: StyleProp<TextStyle>;
  testID?: string;
}

function EtFormToggleSwitchGroupErrorMessage({ render, style, testID }: EtFormToggleSwitchGroupErrorMessageProps) {
  const { error } = useEtFormToggleSwitchGroupContext();
  return <FormFieldErrorText error={error} render={render} style={style} testID={testID} />;
}

export const EtFormToggleSwitchGroup = Object.assign(EtFormToggleSwitchGroupRoot, {
  Control: EtFormToggleSwitchGroupControl,
  Option: EtFormToggleSwitchGroupOption,
  ErrorMessage: EtFormToggleSwitchGroupErrorMessage,
});

/** Access group context from custom components rendered inside the group. */
export { useEtFormToggleSwitchGroupContext };

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  optionDisabled: {
    opacity: 0.5,
  },
  label: {
    flex: 1,
  },
});
