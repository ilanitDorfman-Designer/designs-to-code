import { ComponentProps, PropsWithChildren, Ref } from 'react';
import { StyleProp, TextInput, TextProps, TextStyle, ViewStyle } from 'react-native';

import { IconName } from '../../../../foundations/icon-assets/api/types';

export type InputType = 'text' | 'password' | 'email' | 'number' | 'phone';
export type InputVariant = 'underline' | 'contained';

// Input (root) - minimal props; error drives helper text only
export interface InputProps extends PropsWithChildren {
  style?: StyleProp<ViewStyle>;
  /** Optional input surface fill override (inside border). */
  backgroundColor?: string;
  type?: InputType;
  variant?: InputVariant;
  error?: string | null; // Error message (helper text); border follows focus only
  disabled?: boolean;
  readonly?: boolean;
  maxLength?: number;
  defaultValue?: string;
  showCharCounter?: boolean; // Shows character counter when maxLength is set
  /**
   * When true, the label stays in its compact (top) position and the field's
   * `placeholder` is rendered regardless of focus/value. Use when the design
   * requires the label and a format hint (e.g. "dd", "mm/dd/yyyy") to be
   * visible at the same time. Default: false (floating-label behavior).
   */
  staticLabel?: boolean;
  /** When password is obscured, SR label for the toggle (action: show). Pass from app i18n. */
  passwordShowAccessibilityLabel?: string;
  /** When password is visible, SR label for the toggle (action: hide). Pass from app i18n. */
  passwordHideAccessibilityLabel?: string;
  /** Optional SR hint for the password visibility toggle. Pass from app i18n. */
  passwordToggleAccessibilityHint?: string;
  /**
   * Initial password visibility when `type === 'password'`. Defaults to `false` (masked).
   * Use when the eye toggle should be available but the value should start visible.
   */
  defaultPasswordVisible?: boolean;
  /**
   * Keeps the eye toggle rendered and tappable while the field is `disabled`,
   * so a read-only masked value can still be revealed for verification (e.g.
   * a prefilled SSN). Defaults to `false` — a disabled password field hides
   * the toggle entirely (legacy "read-only PIN" UX).
   */
  showPasswordToggleWhenDisabled?: boolean;
}

// Input.Field - all input behavior
export interface InputFieldProps extends Omit<ComponentProps<typeof TextInput>, 'value' | 'onChangeText' | 'defaultValue'> {
  value?: string;
  onChangeText?: (text: string) => void;
  type?: InputType;
  ref?: Ref<TextInput>; // React 19 supports ref as a regular prop
}

// Input.Label
export interface InputLabelProps {
  children: string; // label text (e.g., "Label" or "Label(Read only)")
  required?: boolean; // Shows asterisk if required
  numberOfLines?: TextProps['numberOfLines'];
  ellipsizeMode?: TextProps['ellipsizeMode'];
  /**
   * Optional style override, merged on top of the DS-driven animated typography
   * (size/lineHeight/letterSpacing/color/fontFamily). Omit to keep the default
   * floating-label look — fully backward compatible with existing usages.
   */
  style?: StyleProp<TextStyle>;
}

// Input.TextAdornment
export interface InputTextAdornmentProps {
  children: string; // e.g., "Suffix", "USD"
}

// Input.IconAdornment
export interface InputIconAdornmentProps {
  iconName: IconName;
  size?: number; // Default: 20
  /**
   * Stroke color passed to `EtoroIcon` `appearance.color`.
   * When omitted, follows input state: idle `textSecondaryNeutral`, focused `textPrimaryNeutral`, disabled `textQuaternaryNeutral`.
   */
  strokeColor?: string;
  /**
   * Fill color for icons that support fill. When **omitted**, fill is not applied (stroke / outline only).
   * Pass a color (including theme `transparent`) to enable filled rendering.
   */
  fillColor?: string;
  onPress?: () => void; // Optional interaction handler
  accessibilityLabel?: string; // Required for interactive icons (screen readers)
  testID?: string;
}

// Input.PasswordToggle
export interface InputPasswordToggleProps {
  isPasswordVisible: boolean;
  handlePasswordVisibility: () => void;
  isFocused: boolean;
  hasValue: boolean;
  disabled?: boolean;
}
