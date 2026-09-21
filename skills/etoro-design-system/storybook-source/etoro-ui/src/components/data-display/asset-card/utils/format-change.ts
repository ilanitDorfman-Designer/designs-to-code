/**
 * Formats price change with proper symbols and percentage
 * @param amount - The change amount
 * @param percentage - The change percentage
 * @returns Formatted change string with + or - symbol
 */
export function formatChange(amount: number | undefined, percentage: number | undefined): string {
  const symbol = amount && amount >= 0 ? '+' : '';
  return `${symbol}${amount?.toFixed(2) ?? '0.00'} (${symbol}${percentage?.toFixed(2) ?? '0.00'}%)`;
}
