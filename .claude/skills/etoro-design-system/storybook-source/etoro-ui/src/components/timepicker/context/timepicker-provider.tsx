import { PropsWithChildren, useCallback, useMemo, useState } from 'react';

import { useEtoroTheme } from '../../../core/hooks';
import { MinuteInterval, TimeFormat, TimeValue } from '../api/types';
import { useTimepickerAnimations } from '../hooks/use-timepicker-animations';
import { useTimepickerState } from '../hooks/use-timepicker-state';
import { formatTimeDisplay } from '../utils/time-formatters';
import { TimepickerConfigContext, TimepickerConfigContextValue } from './config-context';
import { TimepickerStateContext, TimepickerStateContextValue } from './state-context';
import { TimepickerValueContext, TimepickerValueContextValue } from './value-context';

export interface TimepickerProviderProps extends PropsWithChildren {
  defaultValue?: TimeValue | null;
  value?: TimeValue | null;
  onChange?: (time: TimeValue | null) => void;
  format: TimeFormat;
  minuteInterval: MinuteInterval;
  error: string | null;
  disabled: boolean;
  readonly: boolean;
}

export function TimepickerProvider({
  children,
  defaultValue,
  value,
  onChange,
  format,
  minuteInterval,
  error,
  disabled,
  readonly,
}: TimepickerProviderProps) {
  const { colors } = useEtoroTheme();

  // Controlled vs uncontrolled mode
  const isControlled = value !== undefined;
  const initialTime = isControlled ? (value ?? null) : (defaultValue ?? null);

  const [internalTime, setInternalTime] = useState<TimeValue | null>(initialTime);

  // Use controlled values if provided, otherwise use internal state
  const selectedTime = isControlled ? (value ?? null) : internalTime;

  const hasValue = !!selectedTime;

  const { isFocused, isPickerOpen, handleOpenPicker, handleClosePicker } = useTimepickerState({ haptics: true, disabled });

  const hasError = Boolean(error);

  const setTime = useCallback(
    (time: TimeValue | null) => {
      if (!isControlled) {
        setInternalTime(time);
      }

      onChange?.(time);
    },
    [isControlled, onChange],
  );

  const formattedValue = useMemo(() => formatTimeDisplay(selectedTime, format), [selectedTime, format]);

  const { animatedLabelContainerStyle, animatedLabelTextStyle, animatedBorderStyle } = useTimepickerAnimations({
    isFocused,
    hasValue,
    hasError,
    errorBorderColor: colors.actionBrandVarText,
    defaultBorderColor: readonly ? 'transparent' : colors.textTertiaryNeutral,
    filledInputBorderColor: readonly ? 'transparent' : colors.textPrimaryNeutral,
  });

  const configValue = useMemo<TimepickerConfigContextValue>(
    () => ({
      format,
      minuteInterval,
      error,
      disabled,
      readonly,
    }),
    [format, minuteInterval, error, disabled, readonly],
  );

  const stateValue = useMemo<TimepickerStateContextValue>(
    () => ({
      isFocused,
      isPickerOpen,
      hasValue,
      handleOpenPicker,
      handleClosePicker,
      animatedLabelContainerStyle,
      animatedLabelTextStyle,
      animatedBorderStyle,
    }),
    [
      isFocused,
      isPickerOpen,
      hasValue,
      handleOpenPicker,
      handleClosePicker,
      animatedLabelContainerStyle,
      animatedLabelTextStyle,
      animatedBorderStyle,
    ],
  );

  const valueContextValue = useMemo<TimepickerValueContextValue>(
    () => ({
      selectedTime,
      formattedValue,
      setTime,
    }),
    [selectedTime, formattedValue, setTime],
  );

  return (
    <TimepickerConfigContext.Provider value={configValue}>
      <TimepickerStateContext.Provider value={stateValue}>
        <TimepickerValueContext.Provider value={valueContextValue}>{children}</TimepickerValueContext.Provider>
      </TimepickerStateContext.Provider>
    </TimepickerConfigContext.Provider>
  );
}
