import type { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

/** Imperative handle for {@link EtPhoneInput}. */
export interface EtPhoneInputHandle {
  /** Removes focus from the number field, dismissing the soft keyboard. */
  blur: () => void;
}

export interface EtPhoneInputProps {
  /** Dial code including '+' sign (e.g., "+44") */
  prefix: string;

  /** ISO country code for the flag (e.g., "IL", "US", "GB") */
  isoCode: string;

  /** Placeholder text for the number field */
  placeholder: string;

  /** Initial phone number value (uncontrolled mode) */
  defaultValue?: string;

  /**
   * Error message to display below input.
   *
   * Accepts either a plain string (legacy) or any `ReactNode` (e.g. a
   * `<Trans>` element with inline link slots). The `hasError` indicator —
   * used to drive the red border/text — is derived from truthiness, so an
   * empty string / `null` toggles the error styling off as before.
   */
  error?: ReactNode | null;

  /** Controlled value for the number field. When provided, the input operates in controlled mode. */
  value?: string;

  /**
   * Controlled selection range for the number field. When provided, the parent controls the
   * cursor / selection position — required for cursor-aware editing with a custom keyboard
   * (insert/delete at caret) or any other scenario where keystrokes are synthesised
   * outside the native keyboard. Pair with {@link onSelectionChange} to keep the state
   * in sync after user taps reposition the caret.
   *
   * Leave undefined to fall back to the native, uncontrolled cursor behaviour.
   */
  selection?: { start: number; end?: number };

  /**
   * Fires when the cursor / selection inside the number field changes (via tap, drag, or
   * native key navigation). Use with {@link selection} to drive controlled-cursor flows.
   */
  onSelectionChange?: (selection: { start: number; end: number }) => void;

  /** Whether to show the virtual keyboard when the input receives focus. Defaults to true. */
  showVirtualKeyboard?: boolean;

  /** Disables the number input field */
  disabled?: boolean;

  /** Disables the prefix section */
  prefixDisabled?: boolean;

  /** Auto-focus number field on mount */
  autoFocus?: boolean;

  /** Called when phone number text changes */
  onChangeText?: (value: string) => void;

  /** Called when number field gains focus */
  onFocus?: () => void;

  /** Called when number field loses focus */
  onBlur?: () => void;

  /** Called when Enter/Return key is pressed, returns current value */
  onSubmitEditing?: (value: string) => void;

  /** Called when prefix section is pressed */
  onPrefixPress?: () => void;

  /** Container style override */
  style?: StyleProp<ViewStyle>;

  /** Test identifier */
  testID?: string;
}
