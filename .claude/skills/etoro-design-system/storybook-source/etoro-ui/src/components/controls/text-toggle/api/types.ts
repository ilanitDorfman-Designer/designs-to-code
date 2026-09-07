import { ReactNode } from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';

// ============================================================================
// Enums & Variant Types
// ============================================================================

/**
 * Visual variant of the toggle.
 * - 'filled': Default filled background
 * - 'outline': Transparent background with border
 */
export type TextToggleVariant = 'filled' | 'outline';

// ============================================================================
// Subcomponent Props
// ============================================================================

/**
 * Props for EtTextToggle.Option subcomponent.
 */
export interface TextToggleOptionProps {
  /**
   * Unique identifier for this option.
   */
  id: string;

  /**
   * Display label for the option.
   */
  label: string;

  /**
   * Whether this specific option is disabled.
   * @default false
   */
  disabled?: boolean;

  /**
   * Style overrides for the option container.
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Style overrides for the option text.
   */
  textStyle?: StyleProp<TextStyle>;

  /**
   * Test ID for this option.
   */
  testID?: string;
}

/**
 * Props for the SlidingIndicator internal component.
 */
export interface SlidingIndicatorProps {
  /**
   * Size variant for styling.
   */
  size: 'small' | 'large';

  /**
   * Style overrides.
   */
  style?: StyleProp<ViewStyle>;
}

// ============================================================================
// Context Types
// ============================================================================

/**
 * Measured layout of a single option within the toggle's bars area.
 * Reported by each `EtTextToggle.Option` via `onLayout` so the sliding
 * indicator can size and position itself against the *actual* option
 * rectangle rather than an averaged-width placeholder.
 */
export interface OptionLayout {
  /** Distance from the left edge of the toggle's options container. */
  x: number;
  /** Measured width of the option in pixels. */
  width: number;
}

/**
 * Internal context value for EtTextToggle compound component.
 */
export interface TextToggleContextValue {
  // State
  /**
   * Currently selected option ID.
   */
  selectedId: string;

  /**
   * Callback to select an option.
   */
  onSelect: (id: string) => void;

  // Appearance
  /**
   * Size variant of the toggle.
   */
  size: 'small' | 'large';

  /**
   * Visual variant of the toggle.
   */
  variant: TextToggleVariant;

  /**
   * Whether toggle stretches to fill the container.
   */
  stretch: boolean;

  // Interaction
  /**
   * Whether the entire toggle is disabled.
   */
  disabled: boolean;

  /**
   * Whether haptic feedback is enabled.
   */
  haptics: boolean;

  // Context helpers
  /**
   * Register an option with the toggle (for index tracking).
   */
  registerOption: (id: string) => void;

  /**
   * Unregister an option from the toggle.
   */
  unregisterOption: (id: string) => void;

  /**
   * Get the index of an option by ID.
   */
  getOptionIndex: (id: string) => number;

  /**
   * Total number of registered options.
   */
  optionCount: number;

  /**
   * Publishes the option's measured `{x, width}` to the provider's
   * SharedValue without going through React state, so option components
   * don't re-render when sibling layouts shift.
   */
  reportOptionLayout: (id: string, layout: OptionLayout) => void;

  /**
   * Drives the indicator spring directly on the UI thread. Called from
   * the option press handler so the animation starts on the tap frame
   * instead of waiting for the parent re-render. Idempotent against
   * the in-flight target — duplicate calls (press + the catch-up effect
   * reacting to the resulting `selectedId`) are no-ops.
   */
  animateToIndex: (index: number) => void;
}

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Represents a toggle option configuration.
 * Used for defining option data in arrays.
 */
export interface ToggleOption {
  /** Unique identifier for the option */
  id: string;
  /** Display label for the option */
  label: string;
}

// ============================================================================
// Main Component Props
// ============================================================================

/**
 * Props for the EtTextToggle root component.
 */
export interface EtTextToggleProps {
  // State (required)
  /**
   * Toggle option children (EtTextToggle.Option components).
   */
  children: ReactNode;

  /**
   * Currently selected option ID.
   */
  selectedId: string;

  // Appearance
  /**
   * Visual variant of the toggle.
   * - 'filled': Default filled background
   * - 'outline': Transparent background with border
   * @default 'filled'
   */
  variant?: TextToggleVariant;

  /**
   * Size variant of the toggle.
   * @default 'large'
   */
  size?: 'small' | 'large';

  /**
   * Whether toggle should stretch to fill the container.
   * @default false
   */
  stretch?: boolean;

  /**
   * Container style overrides.
   */
  style?: StyleProp<ViewStyle>;

  // Interaction
  /**
   * Callback when selection changes.
   */
  onSelectionChange?: (id: string) => void;

  /**
   * Enable haptic feedback on selection.
   * @default true
   */
  haptics?: boolean;

  /**
   * Whether the entire toggle is disabled.
   * @default false
   */
  disabled?: boolean;

  // Accessibility & Testing
  /**
   * Test ID for the container.
   */
  testID?: string;
}
