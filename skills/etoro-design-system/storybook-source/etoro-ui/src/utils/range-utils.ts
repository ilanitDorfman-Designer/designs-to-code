/**
 * Clamp a numeric value to the inclusive range [0, 1].
 */
export const clamp01 = (value: number): number => Math.max(0, Math.min(1, value));

/**
 * Default formatter for numeric range values.
 */
export const defaultRangeFormatValue = (value: number): string => value.toFixed(2);
