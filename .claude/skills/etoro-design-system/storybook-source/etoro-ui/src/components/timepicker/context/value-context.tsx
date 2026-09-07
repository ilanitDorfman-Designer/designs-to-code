import { createContext, useContext } from 'react';

import { TimeValue } from '../api/types';

export interface TimepickerValueContextValue {
  selectedTime: TimeValue | null;
  formattedValue: string;
  setTime: (time: TimeValue | null) => void;
}

export const TimepickerValueContext = createContext<TimepickerValueContextValue | null>(null);

/**
 * Access current time values (selectedTime, formatted value, setter)
 * This is the "hot path" - changes on every time selection.
 * Only use this when you actually need the current time values.
 */
export function useTimepickerValue() {
  const context = useContext(TimepickerValueContext);
  if (!context) {
    throw new Error('Timepicker components must be used within <Timepicker>');
  }
  return context;
}
