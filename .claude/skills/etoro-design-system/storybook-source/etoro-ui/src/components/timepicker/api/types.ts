import { PropsWithChildren, Ref } from 'react';
import { StyleProp, TextInput, ViewStyle } from 'react-native';

export type TimepickerVariant = 'inputField' | 'compactField';

export type TimeFormat = '12h' | '24h';

export type MinuteInterval = 1 | 2 | 3 | 4 | 5 | 6 | 10 | 12 | 15 | 20 | 30;

export interface TimeValue {
  hours: number;
  minutes: number;
}

// ─── Sub-interfaces (children component props) ───────────────────────────────

// Timepicker.Field - readonly time display field
export interface TimepickerFieldProps {
  placeholder?: string;
  ref?: Ref<TextInput>;
  testID?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

// Timepicker.Label
export interface InputFieldLabelProps {
  children: string;
  required?: boolean;
}

// Timepicker.ClockIcon
export interface TimepickerClockIconProps {
  iconName?: string; // Default: 'clock'
  size?: number; // Default: 20
  color?: string;
  testID?: string;
  accessibilityLabel?: string;
}

// Timepicker.CompactFieldDisplay - pill-style display for compactField variant
export interface CompactFieldDisplayProps {
  showIcon?: boolean; // Default: true
  iconName?: string; // Default: 'calendar'
  testID?: string;
  accessibilityLabel?: string;
}

// ─── Main Props ───────────────────────────────────────────────────────────────

/**
 * Props for the `Timepicker` root component.
 *
 * `Timepicker` is a compound component for time selection that supports both controlled
 * and uncontrolled modes. Use `value` + `onChange` for controlled mode, or `defaultValue`
 * for uncontrolled mode.
 *
 * @example
 * // Uncontrolled usage
 * <Timepicker defaultValue={null}>
 *   <Timepicker.Label>Time</Timepicker.Label>
 *   <Timepicker.Field placeholder="Select time" />
 * </Timepicker>
 *
 * @example
 * // Controlled usage
 * const [time, setTime] = useState<TimeValue | null>(null);
 *
 * <Timepicker value={time} onChange={setTime}>
 *   <Timepicker.Label>Time</Timepicker.Label>
 *   <Timepicker.Field placeholder="Select time" />
 * </Timepicker>
 */
export interface TimepickerProps extends PropsWithChildren {
  // ─── State ───────────────────────────────────────────────────────────────────
  /**
   * Initial value for uncontrolled mode. Use this when the component should manage
   * its own state. Accepts a `TimeValue` object or `null`.
   *
   * For controlled mode, use `value` instead.
   */
  defaultValue?: TimeValue | null;

  /**
   * Current value for controlled mode. When provided, the component becomes controlled
   * and you must also provide `onChange` to update the value.
   * Accepts a `TimeValue` object or `null`.
   *
   * For uncontrolled mode, use `defaultValue` instead.
   */
  value?: TimeValue | null;

  /**
   * The time format determining display style.
   * - `'24h'`: 24-hour format (e.g., 14:30)
   * - `'12h'`: 12-hour format with AM/PM (e.g., 2:30 PM)
   *
   * @default '24h'
   */
  format?: TimeFormat;

  /**
   * The interval (in minutes) at which minutes can be selected.
   * Must be a value that divides evenly into 60.
   *
   * @default 1
   */
  minuteInterval?: MinuteInterval;

  /**
   * Error message to display below the input. When provided, the timepicker
   * renders in an error state with error styling on the label and border.
   * Helper text is automatically rendered—do not include it in JSX.
   */
  error?: string | null;

  /**
   * When `true`, the timepicker is non-interactive and visually dimmed.
   * The picker cannot be opened.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * When `true`, the timepicker displays its value but cannot be edited.
   * The picker cannot be opened. Label should include "(Read only)" text.
   *
   * @default false
   */
  readonly?: boolean;

  // ─── Appearance ──────────────────────────────────────────────────────────────
  /**
   * Custom styles applied to the timepicker container.
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Visual variant of the timepicker.
   * - `'inputField'`: Standard text field appearance with floating label
   * - `'compactField'`: Pill-style compact display
   *
   * @default 'inputField'
   */
  variant?: TimepickerVariant;

  // ─── Interaction ─────────────────────────────────────────────────────────────
  /**
   * Callback fired when the selected time changes.
   *
   * @param time - The new time value as a `TimeValue` object or `null`
   */
  onChange?: (time: TimeValue | null) => void;
}
