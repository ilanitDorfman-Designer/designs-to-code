/**
 * Formats a price with currency symbol
 * @param price - The price number to format
 * @param currency - Optional currency symbol (defaults to '$')
 * @returns Formatted price string
 */
export function formatPrice(price: number | undefined, currency = '$'): string {
  return `${currency}${price?.toFixed(2) ?? '0.00'}`;
}
