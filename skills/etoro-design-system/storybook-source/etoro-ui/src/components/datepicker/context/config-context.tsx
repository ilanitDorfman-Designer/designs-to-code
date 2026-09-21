import type { Locale } from 'date-fns';
import { createContext, useContext } from 'react';

import { DatepickerMode, DatepickerValueType } from '../api/types';

export interface DatepickerConfigContextValue {
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

export const DatepickerConfigContext = createContext<DatepickerConfigContextValue | null>(null);

/**
 * Access static config props (mode, format, locale, constraints, etc.)
 * These rarely change, so components using only this hook won't re-render on date selection.
 */
export function useDatepickerConfig() {
  const context = useContext(DatepickerConfigContext);
  if (!context) {
    throw new Error('Datepicker components must be used within <Datepicker>');
  }
  return context;
}
