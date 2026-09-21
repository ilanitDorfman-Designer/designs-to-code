import type { FormatCurrencyOptions } from '@etoro/common/utils';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

/**
 * How the primary value should be formatted.
 * - `currency`   → `formatCurrency(value, options)`          e.g. "$1,234.56"
 * - `percentage` → `formatPercent(value, options)`           e.g. "12.34%"
 * - `number`     → `formatNumberWithDecimals(value, options)` e.g. "1,234.56" or "1234.56" (useGrouping=false)
 * - `compact`    → `formatCompactNumber(value)`              e.g. "1.2K", "2.5M"
 */
export type EtNumberFormatType = 'currency' | 'percentage' | 'number' | 'compact';

/**
 * Options passed through to `@etoro/common/utils formatters`
 * - `formatCurrency(value, { symbol, minDecimals, maxDecimals, locale })`
 * - `formatPercent(value, { minDecimals, maxDecimals, locale })`
 * - `formatNumberWithDecimals(value, { minDecimals, maxDecimals, locale })`
 */
export type EtNumberFormatOptions = Partial<FormatCurrencyOptions>;

/**
 * Resolved shape passed via context to subcomponents.
 * Value and optional currencyCode merged with root props (format, symbol, etc.) and defaults.
 */
export interface EtNumberContextValue extends FormatCurrencyOptions {
  value: number | null | undefined;
  currencyCode?: string;
  format: EtNumberFormatType;
  useGrouping: boolean;
  showAbsoluteValue: boolean;
  showSign: boolean;
  hasParentheses: boolean;
  isColored: boolean;
  color?: string;
  fallback?: string;
  /** When true, Value renders a privacy mask instead of the formatted number. */
  isMasked: boolean;
  /** Number of asterisks when `isMasked` is true. @default 7 */
  maskLength?: number;
}

export interface EtNumberProps {
  /** Primary numeric value. Sign drives arrow direction and (when isColored) color. */
  value: number | null | undefined;

  /** Optional currency code (e.g. 'USD'). Passed through context for formatting/display. */
  currencyCode?: string;

  /** Which formatter to use. @default 'number' */
  format?: EtNumberFormatType;

  /** Passed to formatCurrency when format === 'currency' */
  symbol?: string;

  /** Passed to all formatters that support it. */
  minDecimals?: number;

  /** Passed to all formatters that support it. */
  maxDecimals?: number;

  /** Locale for the number. @default 'en-US' */
  locale?: string;

  /**
   * Whether to use thousand-separator grouping in `number` format.
   * Maps to the standard `Intl.NumberFormat` `useGrouping` option.
   * @default true
   */
  useGrouping?: boolean;

  /** When true, value displays |value|; color/arrow still follow original sign when isColored. @default false */
  showAbsoluteValue?: boolean;

  /** When true, prepends an explicit sign. With showAbsoluteValue, the sign still follows the raw value. @default false */
  showSign?: boolean;

  /** When true, wraps the formatted value text in parentheses, e.g. (20.43%). @default false */
  hasParentheses?: boolean;

  /**
   * When true, value and arrow use sign-based colors (green/red).
   * When false or omitted, neutral (regular) text/icon color.
   * @default false
   */
  isColored?: boolean;

  /**
   * When set, both arrow and value use this color.
   */
  color?: string;

  /**
   * Text to render when value is null, undefined, or non-finite (e.g. NaN, Infinity).
   * When omitted, EtNumber.Value and EtNumber.Arrow render nothing.
   * @example fallback="--"
   */
  fallback?: string;

  /**
   * When true, `EtNumber.Value` renders a privacy mask instead of the formatted value.
   * `EtNumber.Arrow` is hidden unless that child explicitly opts in with `showWhenMasked`.
   * @default false
   */
  isMasked?: boolean;

  /**
   * Number of asterisks shown when `isMasked` is true.
   * @default 7
   */
  maskLength?: number;

  /** Compound children (EtNumber.Arrow, EtNumber.Value). */
  children?: ReactNode | ReactNode[];

  /** Style for the root container. */
  style?: StyleProp<ViewStyle>;

  /** Test ID for the root container. */
  testID?: string;
}
