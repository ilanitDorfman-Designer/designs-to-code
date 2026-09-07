import React from 'react';

import { TimepickerProps } from './api/types';
import { TimepickerProvider } from './context';
import { ClockIcon, CompactFieldContainer, CompactFieldDisplay, InputFieldContainer, InputFieldDisplay, InputFieldLabel } from './subcomponents';

function TimepickerRoot({
  style,
  children,
  defaultValue,
  value,
  onChange,
  format = '24h',
  minuteInterval = 1,
  error = null,
  disabled = false,
  readonly = false,
  variant = 'inputField',
}: TimepickerProps) {
  return (
    <TimepickerProvider
      defaultValue={defaultValue}
      value={value}
      onChange={onChange}
      format={format}
      minuteInterval={minuteInterval}
      error={error}
      disabled={disabled}
      readonly={readonly}
    >
      {variant === 'inputField' ? (
        <InputFieldContainer style={style}>{children}</InputFieldContainer>
      ) : (
        <CompactFieldContainer style={style}>{children}</CompactFieldContainer>
      )}
    </TimepickerProvider>
  );
}

const MemoTimepicker = React.memo(TimepickerRoot);
MemoTimepicker.displayName = 'EtTimepicker';

const Label = InputFieldLabel;
const Field = InputFieldDisplay;

export const EtTimepicker = Object.assign(MemoTimepicker, {
  Label,
  Field,
  ClockIcon,
  CompactFieldDisplay,
});
