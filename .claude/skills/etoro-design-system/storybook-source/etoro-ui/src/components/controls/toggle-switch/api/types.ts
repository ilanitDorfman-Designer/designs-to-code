import type { StyleProp, SwitchProps, ViewStyle } from 'react-native';

/**
 * Toggle switch size variants
 * - 'small': Scaled down native switch (~75% scale)
 * - 'medium': Native switch size (100% scale)
 */
export type ToggleSwitchSize = 'small' | 'medium';

/**
 * Internal config returned by useToggleSwitchConfig hook
 * All values are memoized to prevent unnecessary re-renders
 */
export interface ToggleSwitchConfig {
  /** Track color object for Switch component (memoized) */
  trackColor: {
    false: string;
    true: string;
  };
  /** Thumb color */
  thumbColor: string;
  /** Whether component is disabled */
  disabled: boolean;
  /** Combined style with size transform (memoized) */
  style: StyleProp<ViewStyle>;
  /** Resolved accessibility label (memoized) */
  accessibilityLabel: string;
}

/**
 * EtToggleSwitch props - controlled toggle switch component
 *
 * Uses Switch from react-native-gesture-handler internally for proper
 * gesture coordination with drawer navigators on Android.
 *
 * Required props:
 * - value: boolean (controlled state)
 * - onValueChange: (value: boolean) => void (toggle callback)
 *
 * Inherits optional props from SwitchProps:
 * - disabled?: boolean
 * - trackColor?: { false?: string; true?: string }
 * - thumbColor?: string
 * - ios_backgroundColor?: string
 * - onChange?: (event) => void
 *
 * @example Basic usage
 * ```tsx
 * const [on, setOn] = useState(false);
 * <EtToggleSwitch value={on} onValueChange={setOn} />
 * ```
 *
 * @example With size variant
 * ```tsx
 * <EtToggleSwitch value={on} onValueChange={setOn} size="medium" />
 * ```
 *
 * @example Disabled state
 * ```tsx
 * <EtToggleSwitch value={on} onValueChange={setOn} disabled />
 * ```
 *
 * @example Custom colors (optional - uses theme by default)
 * ```tsx
 * <EtToggleSwitch
 *   value={on}
 *   onValueChange={setOn}
 *   trackColor={{ true: '#0eb12e', false: '#ccc' }}
 *   thumbColor="#fff"
 * />
 * ```
 */
export interface EtToggleSwitchProps extends Omit<SwitchProps, 'value' | 'onValueChange'> {
  /**
   * Controlled value - current on/off state (required)
   */
  value: boolean;

  /**
   * Callback when toggled - receives the new boolean value (required)
   */
  onValueChange: (value: boolean) => void;
  /**
   * Size variant
   * @default 'medium'
   */
  size?: ToggleSwitchSize;

  /**
   * Enable haptic feedback on toggle
   * @default true
   */
  haptics?: boolean;

  /**
   * Force native Switch to stay in sync with value prop.
   *
   * Use this when the Switch is inside a context where the native iOS component
   * may not properly update its visual state (e.g., inside @gorhom/bottom-sheet).
   *
   * When enabled, uses internal state management to keep the Switch in sync
   * while preserving smooth animations.
   *
   * @default false
   */
  forceNativeSync?: boolean;
}
