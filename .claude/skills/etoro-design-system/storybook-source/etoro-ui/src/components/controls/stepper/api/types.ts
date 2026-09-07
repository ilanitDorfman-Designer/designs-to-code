export interface EtStepperProps {
  /**
   * Current numeric value shown in the middle input.
   */
  value: number;

  /**
   * Callback when value changes via + / -.
   */
  onChange: (value: number) => void;

  /**
   * Minimum allowed value (inclusive).
   * @default Number.NEGATIVE_INFINITY
   */
  min?: number;

  /**
   * Maximum allowed value (inclusive).
   * @default Number.POSITIVE_INFINITY
   */
  max?: number;

  /**
   * Step increment/decrement.
   * @default 1
   */
  step?: number;

  /**
   * Disable all interactions.
   */
  disabled?: boolean;

  /**
   * Size preset for the control.
   * @default 'md'
   */
  size?: 'xs' | 'sm' | 'md' | 'lg';

  /**
   * Enable haptic feedback on button press.
   * @default true
   */
  haptics?: boolean;

  testID?: string;
}
