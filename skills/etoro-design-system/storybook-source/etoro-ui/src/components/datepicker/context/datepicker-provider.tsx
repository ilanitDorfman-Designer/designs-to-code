import type { Locale } from 'date-fns';
import * as Haptics from 'expo-haptics';
import { PropsWithChildren, useCallback, useMemo, useState } from 'react';

import { useEtoroTheme } from '../../../core/hooks';
import { convertDateToValueType, formatDate, parseDateValue } from '../../../utils/date-formatters';
import { DatepickerMode, DatepickerValueType } from '../api/types';
import { useDatepickerAnimations } from '../hooks/use-datepicker-animations';
import { useDatepickerState } from '../hooks/use-datepicker-state';
import { DatepickerConfigContext, DatepickerConfigContextValue } from './config-context';
import { DatepickerStateContext, DatepickerStateContextValue } from './state-context';
import { DatepickerValueContext, DatepickerValueContextValue } from './value-context';

export interface DatepickerProviderProps extends PropsWithChildren {
  defaultValue?: Date | string | null;
  value?: Date | string | null;
  onChange?: (date: Date | string | null) => void;
  mode: DatepickerMode;
  format: string;
  locale?: Locale;
  valueType: DatepickerValueType;
  minDate?: Date;
  maxDate?: Date;
  error: string | null;
  disabled: boolean;
  readonly: boolean;
}

export function DatepickerProvider({
  children,
  defaultValue,
  value,
  onChange,
  mode,
  format,
  locale,
  valueType,
  minDate,
  maxDate,
  error,
  disabled,
  readonly,
}: DatepickerProviderProps) {
  const { colors } = useEtoroTheme();

  // Controlled vs uncontrolled mode
  const isControlled = value !== undefined;
  const initialDate = isControlled ? parseDateValue(value) : parseDateValue(defaultValue);

  const [internalDate, setInternalDate] = useState<Date | null>(initialDate);

  // Use controlled values if provided, otherwise use internal state
  const selectedDate = isControlled ? parseDateValue(value) : internalDate;

  const hasValue = !!selectedDate;

  const { isFocused, isPickerOpen, openPicker, closePicker } = useDatepickerState();

  // Single source of truth for "label lifted / value visible" — D9 keeps this distinct
  // from `isFocused` (which only tracks native-picker-modal visibility).
  const isCompact = isFocused || hasValue;

  // Caller-managed wrappers: gate behind disabled/readonly and fire haptics
  const handleOpenPicker = useCallback(() => {
    if (disabled || readonly) {
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    openPicker();
  }, [disabled, readonly, openPicker]);

  const handleClosePicker = useCallback(() => {
    closePicker();
  }, [closePicker]);

  const hasError = Boolean(error);

  const setDate = useCallback(
    (date: Date | null) => {
      if (!isControlled) {
        setInternalDate(date);
      }

      const convertedValue = convertDateToValueType(date, valueType, format, locale);
      onChange?.(convertedValue);
    },
    [isControlled, valueType, format, locale, onChange],
  );

  const formattedValue = formatDate(selectedDate, format, locale);

  const { animatedLabelContainerStyle, animatedLabelTextStyle, animatedBorderStyle, animatedFieldRowStyle } = useDatepickerAnimations({
    isFocused,
    isCompact,
    // D8: disabled forces the idle stop inside the hook, suppressing D4's error border.
    disabled,
    // Readonly is quiet chrome (no focus ring, no error ring); forces the idle stop for the same reason.
    readonly,
    hasError,
    // D9: idle border always visible. D8: disabled keeps carbon300 (same idle stop).
    idleBorderColor: colors.carbon300,
    // Focus lift to carbon600. Readonly/disabled suppression happens inside the hook
    // via `isFocusActive` (see `use-datepicker-animations.ts`), not here — so this
    // color is passed unconditionally and the focus channel never advances under
    // quiet-chrome.
    focusedBorderColor: colors.carbon600,
    // D4: error border stays actionBrandVarText (same red as helper text).
    errorBorderColor: colors.actionBrandVarText,
    idleLabelColor: colors.carbon500,
    compactLabelColor: colors.carbon500,
  });

  const configValue = useMemo<DatepickerConfigContextValue>(
    () => ({
      mode,
      format,
      locale,
      valueType,
      minDate,
      maxDate,
      error,
      disabled,
      readonly,
    }),
    [mode, format, locale, valueType, minDate, maxDate, error, disabled, readonly],
  );

  const stateValue = useMemo<DatepickerStateContextValue>(
    () => ({
      isFocused,
      isPickerOpen,
      hasValue,
      isCompact,
      handleOpenPicker,
      handleClosePicker,
      animatedLabelContainerStyle,
      animatedLabelTextStyle,
      animatedBorderStyle,
      animatedFieldRowStyle,
    }),
    [
      isFocused,
      isPickerOpen,
      hasValue,
      isCompact,
      handleOpenPicker,
      handleClosePicker,
      animatedLabelContainerStyle,
      animatedLabelTextStyle,
      animatedBorderStyle,
      animatedFieldRowStyle,
    ],
  );

  const valueContextValue = useMemo<DatepickerValueContextValue>(
    () => ({
      selectedDate,
      formattedValue,
      setDate,
    }),
    [selectedDate, formattedValue, setDate],
  );

  return (
    <DatepickerConfigContext.Provider value={configValue}>
      <DatepickerStateContext.Provider value={stateValue}>
        <DatepickerValueContext.Provider value={valueContextValue}>{children}</DatepickerValueContext.Provider>
      </DatepickerStateContext.Provider>
    </DatepickerConfigContext.Provider>
  );
}
