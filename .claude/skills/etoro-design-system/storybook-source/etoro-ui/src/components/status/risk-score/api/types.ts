import { StyleProp, ViewStyle } from 'react-native';

/**
 * Risk score value from 1 to 10
 * Maps to colors defined in core/styles/colors/primitives/risk-score
 */
export type RiskScoreValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

/**
 * Available risk score sizes
 * - 'xs': 20px — Compact inline indicator
 * - 'sm': 24px — Small indicator
 * - 'md': 30px — Medium indicator (default)
 * - 'lg': 35px — Large indicator
 */
export type RiskScoreSize = 'xs' | 'sm' | 'md' | 'lg';

/**
 * Available risk score display variants
 * - 'multi': All segments from 1 up to the score value are colored
 *   using the same color resolved from the overall risk score
 * - 'single': Only the segment matching the score value is colored;
 *   all other segments use the inactive color
 */
export type RiskScoreVariant = 'multi' | 'single';

/**
 * Props for the EtRiskScore component
 *
 * @example Basic usage
 * ```tsx
 * <EtRiskScore value={7} />
 * ```
 *
 * @example With size and variant
 * ```tsx
 * <EtRiskScore value={5} size="lg" variant="single" />
 * ```
 */
export interface EtRiskScoreProps {
  /** The risk score value (1-10) */
  value: RiskScoreValue;

  /** Size of the component (default: 'md') */
  size?: RiskScoreSize;

  /** Display variant (default: 'multi') */
  variant?: RiskScoreVariant;

  /** Additional container styles */
  style?: StyleProp<ViewStyle>;

  /** Test ID for testing */
  testID?: string;

  /** Accessibility label override */
  accessibilityLabel?: string;
}
