import { createContext, useContext } from 'react';

export interface DatepickerValueContextValue {
  selectedDate: Date | null;
  formattedValue: string;
  setDate: (date: Date | null) => void;
}

export const DatepickerValueContext = createContext<DatepickerValueContextValue | null>(null);

/**
 * Access current date values (selectedDate, formatted value, setter)
 * This is the "hot path" - changes on every date selection.
 * Only use this when you actually need the current date values.
 */
export function useDatepickerValue() {
  const context = useContext(DatepickerValueContext);
  if (!context) {
    throw new Error('Datepicker components must be used within <Datepicker>');
  }
  return context;
}
