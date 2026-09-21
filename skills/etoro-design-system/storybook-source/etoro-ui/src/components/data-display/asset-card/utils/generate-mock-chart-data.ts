interface ChartData {
  timestamp: string;
  price: number;
}

/**
 * Generates mock chart data for 12 months based on trend direction
 * @param currentPrice - The current asset price
 * @param isPositive - Whether the trend should be positive or negative
 * @returns Array of chart data points
 */
export function generateMockChartData(currentPrice: number, isPositive = true): ChartData[] {
  const data: ChartData[] = [];
  const now = new Date();
  const startPrice = currentPrice * 0.9; // Start 10% lower

  for (let i = 0; i < 12; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
    const timestamp = date.toISOString();

    // Generate trend based on performance
    const trend = isPositive ? 1 + i * 0.02 + (Math.random() * 0.1 - 0.05) : 1 - i * 0.015 - Math.random() * 0.08;
    const price = startPrice * trend;

    data.push({ timestamp, price });
  }

  return data;
}
