import type { Locale } from 'date-fns';
import { PropsWithChildren } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

import type { DatepickerValueType } from '../../../types/datepicker';

export type { DatepickerValueType };

// TODO: 'datetime' and 'time' modes are reserved for future use.
// Only 'date' is currently implemented and supported.
export type DatepickerMode = 'date';

export type DatepickerVariant = 'inputField' | 'compactField';

/**
 * Props for the `Datepicker` root component.
 *
 * `Datepicker` is a compound component for date selection that supports both controlled
 * and uncontrolled modes. Use `value` + `onChange` for controlled mode, or `defaultValue`
 * for uncontrolled mode.
 *
 * @example
 * // Uncontrolled usage
 * <Datepicker defaultValue={null}>
 *   <Datepicker.Label>Date</Datepicker.Label>
 *   <Datepicker.Field placeholder="Select date" />
 * </Datepicker>
 *
 * @example
 * // Controlled usage
 * const [date, setDate] = useState<Date | null>(null);
 *
 * <Datepicker value={date} onChange={setDate}>
 *   <Datepicker.Label>Date</Datepicker.Label>
 *   <Datepicker.Field placeholder="Select date" />
 * </Datepicker>
 *
 * @example
 * // onChange signature examples
 * // With valueType="date" (default):
 * onChange={(date: Date | null) => console.log(date)}
 *
 * // With valueType="iso":
 * onChange={(isoString: string | null) => console.log(isoString)} // "2026-01-27T00:00:00.000Z"
 *
 * // With valueType="formatted":
 * onChange={(formatted: string | null) => console.log(formatted)} // "27 Jan 2026"
 */

// ─── Sub-interfaces (children component props) ───────────────────────────────

// Datepicker.Field - readonly date display field
export interface DatepickerFieldProps {
  placeholder?: string;
  testID?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

// Datepicker.Label
export interface InputFieldLabelProps {
  children: string;
  required?: boolean;
}

// Datepicker.CalendarIcon
export interface DatepickerCalendarIconProps {
  iconName?: string; // Default: 'calendar'
  size?: number; // Default: 20
  color?: string;
  testID?: string;
  accessibilityLabel?: string;
}

// Datepicker.CompactFieldDisplay - pill-style display for compactField variant
export interface CompactFieldDisplayProps {
  showIcon?: boolean; // Default: true
  iconName?: string; // Default: 'calendar'
  testID?: string;
  accessibilityLabel?: string;
}

// ─── Main Props ───────────────────────────────────────────────────────────────

export interface DatepickerProps extends PropsWithChildren {
  // ─── State ───────────────────────────────────────────────────────────────────
  /**
   * Initial value for uncontrolled mode. Use this when the component should manage
   * its own state. Accepts a `Date` object, ISO string, or `null`.
   *
   * For controlled mode, use `value` instead.
   */
  defaultValue?: Date | string | null;

  /**
   * Current value for controlled mode. When provided, the component becomes controlled
   * and you must also provide `onChange` to update the value.
   * Accepts a `Date` object, ISO string, or `null`.
   *
   * For uncontrolled mode, use `defaultValue` instead.
   */
  value?: Date | string | null;

  /**
   * Determines the type of value passed to `onChange` (**output only**).
   * - `'date'`: Returns a `Date` object
   * - `'iso'`: Returns an ISO 8601 string (e.g., `"2026-01-27T00:00:00.000Z"`)
   * - `'formatted'`: Returns a formatted string using the `format` prop
   *
   * **Note:** This only affects the `onChange` output. The `value` and
   * `defaultValue` props always accept a `Date` object or ISO 8601 string,
   * regardless of `valueType`. Do not feed a formatted string back into
   * `value` — it will fail to parse.
   *
   * @default 'date'
   */
  valueType?: DatepickerValueType;

  /**
   * Minimum selectable date. Dates before this will be disabled in the picker.
   */
  minDate?: Date;

  /**
   * Maximum selectable date. Dates after this will be disabled in the picker.
   */
  maxDate?: Date;

  /**
   * Error message to display below the input. When provided, the datepicker
   * renders in an error state with error styling on the label and border.
   * Helper text is automatically rendered—do not include it in JSX.
   */
  error?: string | null;

  /**
   * When `true`, the datepicker is non-interactive and visually dimmed.
   * The picker cannot be opened.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * When `true`, the datepicker displays its value but cannot be edited.
   * The picker cannot be opened. Label should include "(Read only)" text.
   *
   * @default false
   */
  readonly?: boolean;

  // ─── Appearance ──────────────────────────────────────────────────────────────
  /**
   * Custom styles applied to the datepicker container.
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Visual variant of the datepicker.
   * - `'inputField'`: Standard text field appearance with floating label
   * - `'compactField'`: Pill-style compact display
   *
   * @default 'inputField'
   */
  variant?: DatepickerVariant;

  /**
   * Format string for displaying the date, using date-fns format tokens.
   *
   * Common patterns:
   * - `'dd MMM yyyy'` → "27 Jan 2026"
   * - `'MM/dd/yyyy'` → "01/27/2026"
   * - `'yyyy-MM-dd'` → "2026-01-27"
   *
   * @see https://date-fns.org/docs/format
   * @default 'dd MMM yyyy'
   */
  format?: string;

  /**
   * Locale object from `date-fns/locale` for internationalized date formatting.
   *
   * @example
   * import { es } from 'date-fns/locale';
   * <Datepicker locale={es} />
   */
  locale?: Locale;

  // ─── Interaction ─────────────────────────────────────────────────────────────
  /**
   * Callback fired when the selected date changes.
   *
   * The type of the parameter depends on `valueType`:
   * - `'date'` (default): `Date | null`
   * - `'iso'`: `string | null` (ISO 8601 format)
   * - `'formatted'`: `string | null` (using the `format` prop)
   *
   * @param date - The new date value in the format specified by `valueType`
   */
  onChange?: (date: Date | string | null) => void;
}
