import type { ViewStyle } from 'react-native';

/**
 * Available loader sizes matching Figma design specs
 */
export type LoaderSize = 'tiny' | 'xs' | 'small' | 'medium' | 'large' | 'xl';

/**
 * Loader state types
 * - indeterminate: Spinning loader for unknown progress
 * - determinate: Shows specific progress value
 */
export type LoaderState = 'indeterminate' | 'determinate';

/**
 * Size configuration mapping
 */
export interface LoaderSizeConfig {
  /** Container size in pixels */
  size: number;
  /** Stroke width for the circular arc */
  strokeWidth: number;
}

/**
 * Props for EtLoader component
 *
 * @example
 * ```tsx
 * // Indeterminate spinning loader
 * <EtLoader size="medium" />
 *
 * // Determinate loader with progress
 * <EtLoader size="large" state="determinate" progress={0.75} />
 * ```
 */
export interface EtLoaderProps {
  /**
   * Preset size of the loader
   * @default 'medium'
   */
  size?: LoaderSize;

  /**
   * Loader state
   * - 'indeterminate': Spinning animation (default)
   * - 'determinate': Shows progress value
   * @default 'indeterminate'
   */
  state?: LoaderState;

  /**
   * Progress value (0 to 1) for determinate state
   * Only applicable when state is 'determinate'
   * @default 0
   */
  progress?: number;

  /**
   * Custom track color
   * Defaults to theme-based color
   */
  trackColor?: string;

  /**
   * Custom progress color
   * Defaults to theme-based color
   */
  progressColor?: string;

  /**
   * Animation duration in milliseconds for indeterminate state
   * @default 1000
   */
  duration?: number;

  /**
   * Custom style for the container
   */
  style?: ViewStyle;

  /**
   * Test ID for testing
   */
  testID?: string;

  /**
   * Accessibility label
   */
  accessibilityLabel?: string;
}
