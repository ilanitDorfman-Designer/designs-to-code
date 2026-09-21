/**
 * Formats a number as a price with appropriate decimal places
 *
 * @param price - The price to format
 * @param currencySymbol - Currency symbol to prepend (default: '$')
 * @param minPrecision - Minimum decimal places (default: 0 for >=1000, 2 for >=1, 4 for <1)
 * @param maxPrecision - Maximum decimal places (default: 0 for >=1000, 2 for >=1, 4 for <1)
 * @returns Formatted price string with currency symbol
 *
 * @example
 * formatPrice(1234) => "$1,234"
 * formatPrice(156.79) => "$156.79"
 * formatPrice(0.1234) => "$0.1234"
 * formatPrice(1234, '€', 2, 2) => "€1,234.00"
 */
export function formatPrice(price: number, currencySymbol = '$', minPrecision?: number, maxPrecision?: number): string {
  const absPrice = Math.abs(price);
  const sign = price < 0 ? '-' : '';

  let min: number;
  let max: number;

  if (absPrice >= 1000) {
    min = minPrecision ?? 0;
    max = maxPrecision ?? 0;
  } else if (absPrice >= 1) {
    min = minPrecision ?? 2;
    max = maxPrecision ?? 2;
  } else {
    min = minPrecision ?? 4;
    max = maxPrecision ?? 4;
  }

  const formatted = absPrice.toLocaleString('en-US', {
    minimumFractionDigits: min,
    maximumFractionDigits: max,
  });

  return `${sign}${currencySymbol}${formatted}`;
}
