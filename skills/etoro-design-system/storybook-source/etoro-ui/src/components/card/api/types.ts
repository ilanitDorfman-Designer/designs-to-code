import { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

// ============================================================================
// Root Component Types
// ============================================================================

/**
 * Props for the EtCard root component.
 */
export interface EtCardProps {
  /**
   * Compound component children (Header, Content, Footer).
   */
  children: ReactNode;

  /**
   * Optional style overrides for the card container.
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Optional style overrides for the inner content layer (padding, etc.).
   */
  contentStyle?: StyleProp<ViewStyle>;

  /**
   * Enable shadow styling.
   * @default true
   */
  shadow?: boolean;

  /**
   * Sentiment indicator for background color and halo.
   * - `true` - Positive (green background, green halo in dark mode)
   * - `false` - Negative (red background, red halo in dark mode)
   * - `undefined` - Neutral (secondary background, no halo)
   */
  isPositive?: boolean;

  /**
   * Optional test ID for testing.
   */
  testID?: string;
}

// ============================================================================
// Subcomponent Props
// ============================================================================

/**
 * Props for EtCard.Header subcomponent.
 */
export interface CardHeaderProps {
  /**
   * Header content.
   */
  children: ReactNode;

  /**
   * Optional style overrides.
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Optional test ID for testing.
   */
  testID?: string;
}

/**
 * Props for EtCard.Content subcomponent.
 */
export interface CardContentProps {
  /**
   * Content children.
   */
  children: ReactNode;

  /**
   * Optional style overrides.
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Optional test ID for testing.
   */
  testID?: string;
}

/**
 * Props for EtCard.Footer subcomponent.
 */
export interface CardFooterProps {
  /**
   * Footer content.
   */
  children: ReactNode;

  /**
   * Optional style overrides.
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Optional test ID for testing.
   */
  testID?: string;
}

// ============================================================================
// Context Types
// ============================================================================

/**
 * Internal context value for EtCard compound component.
 */
export interface CardContextValue {
  /**
   * Sentiment indicator for background color and halo.
   */
  isPositive?: boolean;
}
