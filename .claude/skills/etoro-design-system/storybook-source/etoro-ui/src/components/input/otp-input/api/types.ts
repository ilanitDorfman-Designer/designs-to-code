import { ReactNode } from 'react';
import { KeyboardTypeOptions, StyleProp, ViewStyle } from 'react-native';

/**
 * Cell size tier (same names as always on this component).
 * `large` = largest cells (few digits), `small` = smallest cells (many digits).
 */
export type OtpInputSize = 'small' | 'medium' | 'large';

export type OtpInputLength = number;

export interface OtpToggleProps {
  /** Custom accessibility label */
  accessibilityLabel?: string;
  /** Test ID */
  testID?: string;
}
export interface OtpErrorMessageProps {
  /** Error message content */
  children: ReactNode;
  /** Test ID */
  testID?: string;
  /** Custom accessibility label */
  accessibilityLabel?: string;
}
export interface OtpContextValue {
  value: string;
  isFocused: boolean;
  isSecure: boolean;
  error: boolean;
  disabled: boolean;
  size: OtpInputSize;
  length: number;
  toggleSecure: () => void;
  iconColor: string;
  pasteFromClipboard: () => Promise<void>;
}

export interface OtpPasteProps {
  /** Custom accessibility label */
  accessibilityLabel?: string;
  /** Test ID */
  testID?: string;
}

export interface EtOtpInputProps {
  length: OtpInputLength;

  // ── State ──────────────────────────────────────────────

  /** Controlled value */
  value?: string;

  /** Initial value for uncontrolled mode */
  defaultValue?: string;

  /** Error state – applies red styling to cells */
  error?: boolean;

  /** Disabled state – prevents input */
  disabled?: boolean;

  /** Show dots instead of digits (default: false) */
  secureEntry?: boolean;

  // ── Appearance ─────────────────────────────────────────

  /** Container style override */
  style?: StyleProp<ViewStyle>;

  /**
   * Optional cell size override. When omitted, size follows `length` (2–3 → large, 4–6 → medium, 7–9 → small).
   */
  size?: OtpInputSize;

  // ── Interaction ────────────────────────────────────────

  /** Fires on every character change */
  onChangeText?: (text: string) => void;

  /** Fires when all cells are filled */
  onComplete?: (code: string) => void;

  /** Fires when the input gains focus */
  onFocus?: () => void;

  /** Fires when the input loses focus */
  onBlur?: () => void;

  /** Auto-focus the input on mount (default: false) */
  autoFocus?: boolean;

  /** Enable haptic feedback (default: true) */
  haptics?: boolean;

  /** Keyboard type (default: 'number-pad') */
  keyboardType?: KeyboardTypeOptions;

  /** Whether to show the virtual keyboard when the input receives focus. Defaults to true. */
  showVirtualKeyboard?: boolean;

  // ── Accessibility & Testing ────────────────────────────

  /** Accessibility label for the hidden TextInput */
  accessibilityLabel?: string;

  /** Test ID for the root container */
  testID?: string;

  // ── Children ───────────────────────────────────────────

  /** Compound children (e.g. EtOtpInput.Toggle) */
  children?: ReactNode;
}
