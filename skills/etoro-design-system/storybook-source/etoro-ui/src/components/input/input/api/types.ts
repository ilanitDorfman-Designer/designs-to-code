import { ComponentProps, ReactNode, Ref } from 'react';
import { StyleProp, TextInput, TextStyle, ViewStyle } from 'react-native';

import { IconName } from '../../../../foundations/icon-assets/api';

export type InputType = 'text' | 'password' | 'email' | 'number' | 'phone';

// Prefix/Suffix configuration
export interface InputAdornmentConfig {
  iconName?: IconName;
  /** Icon size in pixels (default: 20) */
  size?: number;
  /** Custom content (ReactNode - strings will be wrapped in EtText) */
  children?: ReactNode;
  /** Optional onPress handler (for clickable adornments) */
  onPress?: () => void;
  /** Color override for icon or text */
  color?: string;
  testID?: string;
}

// Grouped configuration interfaces
export interface InputStateConfig {
  /** Current input value */
  value: string;
  /** Callback when text changes */
  onChangeText: (_text: string) => void;
  /** Input type - determines keyboard and behavior */
  type?: InputType;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Whether the input is required */
  required?: boolean;
  /** Maximum number of characters */
  maxLength?: number;
  /** Whether the input is readonly */
  readonly?: boolean;
}

export interface InputAppearanceConfig {
  /** Input label text */
  label: string;
  /** Placeholder text when input is empty */
  placeholder?: string;
  /** Container style */
  style?: StyleProp<ViewStyle>;
  /** Input field style */
  inputStyle?: StyleProp<TextStyle>;
  /** Label style */
  labelStyle?: StyleProp<TextStyle>;
  /** Focus border color override */
  focusBorderColor?: string;
  /** Error border color override */
  errorBorderColor?: string;
  /** Prefix adornment (icon or content at the start) */
  prefix?: InputAdornmentConfig;
  /** Suffix adornment (icon or content at the end) */
  suffix?: InputAdornmentConfig;
}

export interface InputValidationConfig {
  /** Error message to display */
  error?: string;
  /** Helper text to display below input */
  helperText?: string;
  /** Show character counter (requires maxLength in state) */
  showCharCounter?: boolean;
}

export interface InputAccessibilityConfig {
  /** Test ID for testing */
  testID?: string;
  /** Accessibility label */
  accessibilityLabel?: string;
  /** Accessibility hint */
  accessibilityHint?: string;
}

export interface InputInteractionConfig {
  /** Enable haptic feedback on focus */
  haptics?: boolean;
}

export interface InputAdvancedConfig {
  ref?: Ref<TextInput>;
  /** Additional TextInput props */
  textInputProps?: Omit<ComponentProps<typeof TextInput>, 'value' | 'onChangeText' | 'style'>;
}

// Enhanced grouped props interface
export interface EtInputProps {
  state: InputStateConfig;
  appearance: InputAppearanceConfig;
  validation?: InputValidationConfig;
  accessibility?: InputAccessibilityConfig;
  interaction?: InputInteractionConfig;
  advanced?: InputAdvancedConfig;
}
