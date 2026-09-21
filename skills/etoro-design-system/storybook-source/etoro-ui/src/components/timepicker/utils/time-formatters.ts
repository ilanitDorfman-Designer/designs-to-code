import { TimeFormat, TimeValue } from '../api/types';

/**
 * Convert a TimeValue to a Date object (today's date with the given time).
 * When `time` is `null`, returns today's date at midnight (00:00:00.000)
 * instead of the current time, so callers always get a deterministic result.
 *
 * @param time - A TimeValue with hours/minutes, or null for midnight.
 */
export function timeValueToDate(time: TimeValue | null): Date {
  const date = new Date();
  if (time) {
    date.setHours(time.hours, time.minutes, 0, 0);
  } else {
    date.setHours(0, 0, 0, 0);
  }
  return date;
}

/**
 * Convert a Date object to a TimeValue.
 * Throws if the supplied Date is invalid (e.g. `new Date('invalid')`).
 */
export function dateToTimeValue(date: Date): TimeValue {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error('Invalid Date passed to dateToTimeValue');
  }
  return {
    hours: date.getHours(),
    minutes: date.getMinutes(),
  };
}

/**
 * Convert 24h hours to 12h format with AM/PM
 */
export function to12HourFormat(hours: number): {
  hours: number;
  period: 'AM' | 'PM';
} {
  const period = hours >= 12 ? 'PM' : 'AM';
  let hour12 = hours % 12;
  if (hour12 === 0) hour12 = 12;
  return { hours: hour12, period };
}

/**
 * Format a TimeValue for display
 */
export function formatTimeDisplay(time: TimeValue | null, format: TimeFormat): string {
  if (!time) return '';

  const { hours, minutes } = time;
  const minuteStr = minutes.toString().padStart(2, '0');

  if (format === '12h') {
    const { hours: hour12, period } = to12HourFormat(hours);
    return `${hour12}:${minuteStr} ${period}`;
  }
  return `${hours.toString().padStart(2, '0')}:${minuteStr}`;
}

/**
 * Get the display hint format string
 */
export function getFormatHint(format: TimeFormat): string {
  return format === '12h' ? 'hh:mm AM' : 'HH:mm';
}
