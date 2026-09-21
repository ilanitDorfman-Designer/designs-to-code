import { PropsWithChildren, ReactNode } from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';

/** Checkbox value type for square variant (supports indeterminate) */
export type CheckboxValueSquare = boolean | 'error' | 'indeterminate';

/** Checkbox value type for round and add variants (no indeterminate) */
export type CheckboxValueRoundOrAdd = boolean | 'error';

/** Union of all possible checkbox values (for internal use) */
export type CheckboxValue = CheckboxValueSquare | CheckboxValueRoundOrAdd;

/** Checkbox visual variant */
export type CheckboxVariant = 'square' | 'round' | 'add';

// Compound children types
export interface CheckboxLabelProps {
  children: ReactNode;
  style?: StyleProp<TextStyle>;
  disabled?: boolean;
}

/**
 * Base props shared by all checkbox variants
 */
interface EtCheckboxBaseProps extends PropsWithChildren {
  /** Callback when checkbox is toggled. Emits toggled boolean (true if was false/error, false if was true) */
  onChange: (checked: boolean) => void;

  // Optional state
  /** Disabled state */
  disabled?: boolean;

  // Optional appearance
  /** Container style */
  style?: StyleProp<ViewStyle>;

  // Optional interaction
  /** Enable haptic feedback */
  haptics?: boolean;

  // Optional accessibility
  /** Test ID for testing */
  testID?: string;
  /** Accessibility label */
  accessibilityLabel?: string;
}

/**
 * Props for square variant (supports indeterminate)
 */
export interface EtCheckboxSquareProps extends EtCheckboxBaseProps {
  /** Visual variant: 'square' */
  variant?: 'square';
  /** Controlled value: true (checked), false (unchecked), 'error' (error state), or 'indeterminate' (partial selection) */
  value: CheckboxValueSquare;
}

/**
 * Props for round variant (no indeterminate)
 */
export interface EtCheckboxRoundProps extends EtCheckboxBaseProps {
  /** Visual variant: 'round' */
  variant: 'round';
  /** Controlled value: true (checked), false (unchecked), or 'error' (error state) */
  value: CheckboxValueRoundOrAdd;
}

/**
 * Props for add variant (no indeterminate)
 */
export interface EtCheckboxAddProps extends EtCheckboxBaseProps {
  /** Visual variant: 'add' */
  variant: 'add';
  /** Controlled value: true (checked), false (unchecked), or 'error' (error state) */
  value: CheckboxValueRoundOrAdd;
}

/**
 * Props for EtCheckbox - discriminated union based on variant
 *
 * @example Basic usage (square variant, default)
 * ```tsx
 * const [value, setValue] = useState<CheckboxValueSquare>(false);
 * <EtCheckbox value={value} onChange={setValue} />
 * ```
 *
 * @example With label
 * ```tsx
 * <EtCheckbox value={value} onChange={setValue}>
 *   <EtCheckbox.Label>Subscribe to Newsletter</EtCheckbox.Label>
 * </EtCheckbox>
 * ```
 *
 * @example Error state
 * ```tsx
 * <EtCheckbox value="error" onChange={setValue} />
 * ```
 *
 * @example Indeterminate state (square variant only)
 * ```tsx
 * <EtCheckbox value="indeterminate" onChange={setValue} variant="square" />
 * ```
 *
 * @example Round variant (indeterminate not allowed)
 * ```tsx
 * <EtCheckbox value={value} onChange={setValue} variant="round" />
 * ```
 *
 * @example Add variant (indeterminate not allowed)
 * ```tsx
 * <EtCheckbox value={value} onChange={setValue} variant="add" />
 * ```
 */
export type EtCheckboxProps = EtCheckboxSquareProps | EtCheckboxRoundProps | EtCheckboxAddProps;
