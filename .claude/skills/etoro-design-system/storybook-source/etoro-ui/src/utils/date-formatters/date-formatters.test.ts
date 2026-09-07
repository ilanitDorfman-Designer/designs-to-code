/**
 * Run this suite only:
 *   npx nx run ui:test -- --testPathPatterns=date-formatters
 *
 * `format` is wrapped in `jest.fn` so we can assert the catch path in `formatDate`
 * without depending on date-fns token validation behavior across versions.
 */
import * as dateFnsFormat from 'date-fns/format';
import { enUS } from 'date-fns/locale';
import { parseISO } from 'date-fns/parseISO';

import { convertDateToValueType, formatDate, parseDateValue } from './date-formatters';

jest.mock('date-fns/format', () => {
  const actual = jest.requireActual<typeof import('date-fns/format')>('date-fns/format');
  return {
    ...actual,
    format: jest.fn((...args: Parameters<typeof actual.format>) => actual.format(...args)),
  };
});

describe('formatDate', () => {
  const jan5Local = new Date(2026, 0, 5, 12, 0, 0);

  it('should return empty string for null, undefined, or empty string', () => {
    expect(formatDate(null)).toBe('');
    expect(formatDate(undefined)).toBe('');
    expect(formatDate('')).toBe('');
  });

  it('should format a local Date with default pattern', () => {
    const result = formatDate(jan5Local);
    expect(result).toMatch(/^05 Jan 2026$/);
  });

  it('should format a local Date with a custom format string', () => {
    expect(formatDate(jan5Local, 'yyyy-MM-dd')).toBe('2026-01-05');
  });

  it('should format an ISO 8601 string consistently with date-fns', () => {
    const iso = '2026-01-05T12:00:00.000Z';
    const expected = dateFnsFormat.format(parseISO(iso), 'yyyy-MM-dd');
    expect(formatDate(iso, 'yyyy-MM-dd')).toBe(expected);
  });

  it('should return empty string for invalid Date', () => {
    expect(formatDate(new Date(Number.NaN))).toBe('');
  });

  it('should return empty string when string cannot be parsed to a valid date', () => {
    expect(formatDate('not-a-date', 'yyyy-MM-dd')).toBe('');
  });

  it('should return empty string when format throws', () => {
    const formatFn = dateFnsFormat.format as jest.MockedFunction<typeof dateFnsFormat.format>;
    formatFn.mockImplementationOnce(() => {
      throw new Error('Test format error');
    });
    expect(formatDate(jan5Local, 'yyyy-MM-dd')).toBe('');
  });

  it('should pass locale to date-fns format when provided', () => {
    const result = formatDate(jan5Local, 'MMMM d, yyyy', enUS);
    expect(result).toBe('January 5, 2026');
  });
});

describe('convertDateToValueType', () => {
  const jan5Local = new Date(2026, 0, 5, 12, 0, 0);

  it('should return null when date is null', () => {
    expect(convertDateToValueType(null, 'date')).toBeNull();
  });

  it('should return the same Date for valueType date', () => {
    expect(convertDateToValueType(jan5Local, 'date')).toBe(jan5Local);
  });

  it('should return ISO string for valueType iso', () => {
    expect(convertDateToValueType(jan5Local, 'iso')).toBe(jan5Local.toISOString());
  });

  it('should return formatted string for valueType formatted', () => {
    const result = convertDateToValueType(jan5Local, 'formatted', 'yyyy-MM-dd');
    expect(result).toBe('2026-01-05');
  });

  it('should use formatDate with optional locale for formatted', () => {
    const result = convertDateToValueType(jan5Local, 'formatted', 'MMMM d, yyyy', enUS);
    expect(result).toBe('January 5, 2026');
  });
});

describe('parseDateValue', () => {
  it('should return null for null, undefined, or empty string', () => {
    expect(parseDateValue(null)).toBeNull();
    expect(parseDateValue(undefined)).toBeNull();
    expect(parseDateValue('')).toBeNull();
  });

  it('should return the same Date when input is a valid Date', () => {
    const d = new Date(2026, 0, 5);
    expect(parseDateValue(d)).toBe(d);
  });

  it('should return null for invalid Date', () => {
    expect(parseDateValue(new Date(Number.NaN))).toBeNull();
  });

  it('should parse ISO 8601 strings', () => {
    const result = parseDateValue('2026-01-05T00:00:00.000Z');
    expect(result).toBeInstanceOf(Date);
    expect(result?.toISOString()).toBe('2026-01-05T00:00:00.000Z');
  });

  it('should return null for non-ISO date strings that parseISO cannot handle', () => {
    expect(parseDateValue('27 Jan 2026')).toBeNull();
  });

  it('should return null for arbitrary invalid strings', () => {
    expect(parseDateValue('not-a-date')).toBeNull();
  });
});
