import { ComponentProps } from 'react';
import { StyleProp, TextInput, ViewStyle } from 'react-native';

export interface SearchInputAdvancedConfig {
  /**
   * Additional TextInput props
   *
   * Use this when you need to pass additional props to the internal TextInput,
   * for example to set a custom keyboard type, or to disable autocorrect.
   *
   * @default undefined
   */
  textInputProps?: Omit<ComponentProps<typeof TextInput>, 'value' | 'onChangeText' | 'onFocus' | 'onBlur' | 'style'>;
}

export interface EtSearchInputProps {
  /**
   * Visual variant for the search field.
   * - `input` keeps the full-size field with trailing "Cancel"
   * - `compact` uses a rounded field with inline clear icon
   * @default "input"
   */
  variant?: 'input' | 'compact';

  /**
   * Current value of the search input
   */
  value: string;

  /**
   * Callback when the text changes
   */
  onChangeText: (text: string) => void;

  /**
   * Callback when cancel button is pressed
   */
  onCancel?: () => void;

  /**
   * Label for the trailing cancel control (pass translated string from the app).
   * @default "Cancel"
   */
  cancelLabel?: string;

  /**
   * Optional accessibility label for the cancel control (defaults to `cancelLabel` when omitted).
   */
  cancelAccessibilityLabel?: string;

  /**
   * Placeholder text
   * @default "Search"
   */
  placeholder?: string;

  /**
   * Whether the input is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Maximum length of the input
   */
  maxLength?: number;

  /**
   * Custom style for the container
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Custom style for the input container
   */
  containerStyle?: StyleProp<ViewStyle>;

  /**
   * Error message to display
   */
  errorMessage?: string;

  /**
   * Helper text to display
   */
  helperText?: string;

  /**
   * Test ID for testing
   */
  testID?: string;

  /**
   * Accessibility label
   */
  accessibilityLabel?: string;

  /**
   * Accessibility hint
   */
  accessibilityHint?: string;

  /**
   * Enable haptic feedback
   * @default false
   */
  haptics?: boolean;

  /**
   * Render the field as a native Liquid Glass surface (iOS 26+).
   *
   * - `true` forces the glass surface (falls back to the solid fill when
   *   Liquid Glass is unavailable on the device).
   * - `false` opts out and always uses the solid fill.
   * - When omitted, it inherits from a parent `LiquidGlassContext`, otherwise
   *   stays off.
   *
   * @default undefined
   */
  liquidGlass?: boolean;

  /**
   * Advanced configuration (TextInput props)
   */
  advanced?: SearchInputAdvancedConfig;
}
