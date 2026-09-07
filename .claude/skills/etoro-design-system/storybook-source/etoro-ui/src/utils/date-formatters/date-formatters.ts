/**
 * Date formatting and parsing helpers (date-fns).
 *
 * Used by `EtDatepicker` and exported as `formatDate` from `etoro-ui`.
 * See `README.md` in this folder for how to run tests and verify changes.
 */
import type { Locale } from 'date-fns';
import { format } from 'date-fns/format';
import { parseISO } from 'date-fns/parseISO';

import type { DatepickerValueType } from '../../types/datepicker';

const DEFAULT_FORMAT = 'dd MMM yyyy';

/**
 * Format a date using date-fns
 */
export function formatDate(date: Date | string | null | undefined, formatStr: string = DEFAULT_FORMAT, locale?: Locale): string {
  if (!date) return '';

  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (isNaN(dateObj.getTime())) return '';

    return format(dateObj, formatStr, locale ? { locale } : undefined);
  } catch {
    return '';
  }
}

/**
 * Convert date to specified value type
 */
export function convertDateToValueType(date: Date | null, valueType: DatepickerValueType, formatStr?: string, locale?: Locale): Date | string | null {
  if (!date) return null;

  switch (valueType) {
    case 'date':
      return date;
    case 'iso':
      return date.toISOString();
    case 'formatted':
      return formatDate(date, formatStr, locale);
    default:
      return date;
  }
}

/**
 * Parse value to Date object.
 *
 * Only `Date` instances and ISO 8601 strings are supported.
 * Formatted strings (e.g. "27 Jan 2026") will return `null`
 * because `parseISO` does not handle locale-specific formats.
 * Consumers should always pass a `Date` or ISO string as
 * `value` / `defaultValue`, regardless of `valueType`.
 */
export function parseDateValue(value: Date | string | null | undefined): Date | null {
  if (!value) return null;

  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === 'string') {
    try {
      const parsed = parseISO(value);
      return isNaN(parsed.getTime()) ? null : parsed;
    } catch {
      return null;
    }
  }

  return null;
}
