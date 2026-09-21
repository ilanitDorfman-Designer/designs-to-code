import { createContext, useContext } from 'react';

import { MinuteInterval, TimeFormat } from '../api/types';

export interface TimepickerConfigContextValue {
  format: TimeFormat;
  minuteInterval: MinuteInterval;
  error: string | null;
  disabled: boolean;
  readonly: boolean;
}

export const TimepickerConfigContext = createContext<TimepickerConfigContextValue | null>(null);

/**
 * Access static config props (format, minuteInterval, constraints, etc.)
 * These rarely change, so components using only this hook won't re-render on time selection.
 */
export function useTimepickerConfig() {
  const context = useContext(TimepickerConfigContext);
  if (!context) {
    throw new Error('Timepicker components must be used within <Timepicker>');
  }
  return context;
}
