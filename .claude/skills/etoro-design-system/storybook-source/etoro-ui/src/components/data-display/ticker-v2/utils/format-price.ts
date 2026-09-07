/**
 * Formats a number as a price with appropriate decimal places
 *
 * @param price - The price to format (must be a finite number)
 * @param currencySymbol - Currency symbol to prepend (default: '$')
 * @param minPrecision - Minimum decimal places. When not provided, defaults to:
 *   - 0 if only maxPrecision is supplied
 *   - Range-based defaults when both are omitted: 0 for >=1000, 2 for >=1, 4 for <1
 *   Note: Non-finite values (NaN, Infinity) are treated as undefined
 * @param maxPrecision - Maximum decimal places. When not provided, defaults to:
 *   - Same as minPrecision if minPrecision is supplied
 *   - Range-based defaults when both are omitted: 0 for >=1000, 2 for >=1, 4 for <1
 *   Note: Non-finite values (NaN, Infinity) are treated as undefined
 * @returns Formatted price string with currency symbol, or empty string for invalid inputs
 *
 * @example
 * formatPrice(1234) => "$1,234"
 * formatPrice(156.79) => "$156.79"
 * formatPrice(0.1234) => "$0.1234"
 * formatPrice(1234, '€', 2, 2) => "€1,234.00"
 * formatPrice(100, '$', undefined, 2) => "$100" // min defaults to 0
 * formatPrice(NaN) => "" // Invalid input
 */
export function formatPrice(price: number, currencySymbol = '$', minPrecision?: number, maxPrecision?: number): string {
  // Guard against non-finite inputs (NaN, Infinity, -Infinity)
  if (!Number.isFinite(price)) {
    return '';
  }

  const absPrice = Math.abs(price);
  const sign = price < 0 ? '-' : '';

  // Validate and sanitize precision inputs first
  // Replace any non-finite values with undefined (to use defaults)
  const sanitizedMinPrecision = minPrecision !== undefined && Number.isFinite(minPrecision) ? minPrecision : undefined;
  const sanitizedMaxPrecision = maxPrecision !== undefined && Number.isFinite(maxPrecision) ? maxPrecision : undefined;

  // Compute range-based default precision
  const fallbackDefault = absPrice >= 1000 ? 0 : absPrice >= 1 ? 2 : 4;

  let min: number;
  let max: number;

  // Determine defaults based on price range, but respect explicit overrides
  // When both are undefined, use range-based defaults for both min and max
  // When only max is provided, use 0 for min to allow flexibility
  if (sanitizedMinPrecision === undefined && sanitizedMaxPrecision === undefined) {
    // Both undefined: use range-based defaults
    min = fallbackDefault;
    max = fallbackDefault;
  } else {
    // At least one is explicitly provided
    min = sanitizedMinPrecision ?? 0;
    max = sanitizedMaxPrecision ?? sanitizedMinPrecision ?? fallbackDefault;
  }

  // Clamp precision values to valid range (0-20) and ensure min <= max
  min = Math.max(0, Math.min(20, min));
  max = Math.max(0, Math.min(20, max));

  // If min > max, set max = min to ensure valid toLocaleString call
  if (min > max) {
    max = min;
  }

  const formatted = absPrice.toLocaleString('en-US', {
    minimumFractionDigits: min,
    maximumFractionDigits: max,
  });

  return `${sign}${currencySymbol}${formatted}`;
}
