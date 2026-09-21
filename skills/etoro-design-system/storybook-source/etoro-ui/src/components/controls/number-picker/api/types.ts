import { StyleProp, ViewStyle } from 'react-native';

import { NumberPickerSize } from '../utils';

// Grouped configuration interfaces
export interface StateConfig {
  /** Current number value */
  value: number;
  /** Callback when value changes */
  onValueChange: (_value: number) => void;
  /** Minimum value (default: 0) */
  min?: number;
  /** Maximum value (default: 100) */
  max?: number;
  /** Step increment (default: 1) */
  step?: number;
  /** Whether the picker is disabled */
  disabled?: boolean;
}

export interface AppearanceConfig {
  /** Size variant */
  size?: NumberPickerSize;
  /** Custom button color */
  buttonColor?: string;
  /** Custom text color */
  textColor?: string;
  /** Custom background color */
  backgroundColor?: string;
}

export interface InteractionConfig {
  /** Enable haptic feedback */
  haptics?: boolean;
}

export interface StyleConfig {
  /** Container style */
  style?: StyleProp<ViewStyle>;
}

export interface AccessibilityConfig {
  /** Test ID for testing */
  testID?: string;
  /** Accessibility label */
  accessibilityLabel?: string;
}

// Main props interface using grouped configurations
export interface EtNumberPickerProps {
  /** State configuration */
  state: StateConfig;
  /** Appearance configuration */
  appearance?: AppearanceConfig;
  /** Interaction configuration */
  interaction?: InteractionConfig;
  /** Style configuration */
  style?: StyleConfig;
  /** Accessibility configuration */
  accessibility?: AccessibilityConfig;
}
