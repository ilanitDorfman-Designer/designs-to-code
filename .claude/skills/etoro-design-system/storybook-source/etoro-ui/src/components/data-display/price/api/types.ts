import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

/**
 * Props for the EtPrice compound component.
 *
 * @example
 * ```tsx
 * <EtPrice price={113.24} change={0.96} changePercentage={0.86}>
 *   <EtPrice.Value />
 *   <EtPrice.Change />
 * </EtPrice>
 * ```
 */
export interface EtPriceProps {
  /** Main price value (e.g. 113.24). Displayed by EtPrice.Value. */
  price?: number;

  /** Absolute change amount (e.g. 0.96 or -0.96). Sign determines positive/negative color. */
  change?: number;

  /**
   * Pre-multiplied percentage change (e.g. 0.86 means 0.86%).
   * Displayed alongside change as `0.96 (+0.86%)`.
   */
  changePercentage?: number;

  /**
   * Fixed decimal places for the price and the absolute change, overriding the built-in magnitude
   * rule (up to 5 decimals below $1, up to 2 otherwise).
   *
   * Pass this when the caller knows the instrument's real quote precision — the default rule shows a
   * misleading `1.16` for above-dollar instruments with fine ticks such as forex. The digit count is
   * pinned, so trailing zeros are kept (`1.15650`) and prices stay aligned down a column. Ignored
   * when non-finite.
   */
  decimals?: number;

  /** Compound children: EtPrice.Value, EtPrice.Change. */
  children?: ReactNode;

  /** Style for the root container. */
  style?: StyleProp<ViewStyle>;
}

/**
 * Resolved shape passed via context to EtPrice subcomponents.
 */
export interface EtPriceContextValue {
  price?: number;
  change?: number;
  changePercentage?: number;
  decimals?: number;
}
