import { PropsWithChildren } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

/** Layout direction for the radio group */
export type RadioGroupDirection = 'vertical' | 'horizontal';

/**
 * Props for EtRadioGroup
 *
 * @example Basic vertical layout (default)
 * ```tsx
 * const [selected, setSelected] = useState<string | null>(null);
 * <EtRadioGroup value={selected} onChange={setSelected}>
 *   <EtRadioGroup.Option value="option1">Option 1</EtRadioGroup.Option>
 *   <EtRadioGroup.Option value="option2">Option 2</EtRadioGroup.Option>
 * </EtRadioGroup>
 * ```
 *
 * @example Horizontal layout
 * ```tsx
 * <EtRadioGroup value={selected} onChange={setSelected} direction="horizontal">
 *   <EtRadioGroup.Option value="small">Small</EtRadioGroup.Option>
 *   <EtRadioGroup.Option value="large">Large</EtRadioGroup.Option>
 * </EtRadioGroup>
 * ```
 *
 * @example With error state
 * ```tsx
 * <EtRadioGroup value={selected} onChange={setSelected} error>
 *   <EtRadioGroup.Option value="opt1">Option 1</EtRadioGroup.Option>
 * </EtRadioGroup>
 * ```
 */
export interface EtRadioGroupProps extends PropsWithChildren {
  /** Currently selected value */
  value: string | null;

  /** Callback when selection changes */
  onChange: (value: string) => void;

  // Optional layout
  /** Layout direction: 'vertical' (default) or 'horizontal' */
  direction?: RadioGroupDirection;

  // Optional state
  /** Disabled state for all options */
  disabled?: boolean;

  /** Error state - shows error styling on unselected options */
  error?: boolean;

  // Optional interaction
  /** Enable haptic feedback (default: true) */
  haptics?: boolean;

  // Optional accessibility
  /** Test ID for testing */
  testID?: string;
  /** Accessibility label for the group */
  accessibilityLabel?: string;
}

/**
 * Props for EtRadioGroup.Option
 */
export interface RadioOptionProps {
  /** Unique value for this option */
  value: string;

  /** Label text */
  children: string;

  /** Option-level disabled (combines with group disabled) */
  disabled?: boolean;

  /** Container style */
  style?: StyleProp<ViewStyle>;

  /** Test ID for testing */
  testID?: string;

  /** Accessibility label */
  accessibilityLabel?: string;
}

/**
 * Props for the internal RadioIndicator component
 */
export interface RadioIndicatorProps {
  /** Whether this option is selected */
  selected: boolean;

  /** Whether this option is disabled */
  disabled: boolean;

  /** Whether to show error state */
  error: boolean;
}

/**
 * Context value shared by RadioGroup to its children
 */
export interface RadioGroupContextValue {
  /** Currently selected value */
  value: string | null;

  /** Handler to select a value (haptics handled internally) */
  onSelect: (value: string) => void;

  /** Whether the group is disabled */
  disabled: boolean;

  /** Whether the group has error state */
  error: boolean;
}
