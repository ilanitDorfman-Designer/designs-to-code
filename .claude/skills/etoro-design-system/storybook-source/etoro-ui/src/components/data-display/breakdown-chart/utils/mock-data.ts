import { eToroLightColors } from '../../../../core/styles/colors';
import { BreakdownChartData } from '../api';

// Get theme colors for consistent theming
const { colors } = eToroLightColors;

export const mockData: BreakdownChartData[] = [
  {
    key: 'Finance',
    value: 17.1,
    color: [colors.currenciesGradient, colors.currenciesPrimary],
  },
  {
    key: 'Utilities',
    value: 14.3,
    color: [colors.etfGradient, colors.etfPrimary],
  },
  {
    key: 'Energy',
    value: 27.1,
    color: [colors.commoditiesGradient, colors.commoditiesPrimary],
  },
  {
    key: 'Cyclicals',
    value: 42.5,
    color: [colors.peopleGradient, colors.peoplePrimary],
  },
  {
    key: 'Tech',
    value: 12.7,
    color: [colors.cryptoGradient, colors.cryptoPrimary],
  },
];

export function generateRandomizedData(baseData: BreakdownChartData[] = mockData): BreakdownChartData[] {
  return baseData.map((item) => ({
    ...item,
    // Generate random value between 5 and 50
    value: Math.random() * 45 + 5,
  }));
}

export function generateNormalizedData(data: BreakdownChartData[]): BreakdownChartData[] {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) return data;

  return data.map((item) => ({
    ...item,
    value: (item.value / total) * 100, // Normalize to percentage
  }));
}
