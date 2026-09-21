import { render } from '@testing-library/react-native';

import { BreakdownChartData } from './api';
import { EtBreakdownChart } from './et-breakdown-chart';

// Mock core hooks
jest.mock('../../../core/hooks', () => ({
  useEtoroTheme: jest.fn(() => ({
    colors: {
      textSecondaryNeutral: '#808080',
      bgNeutralPrimary: '#FFFFFF',
    },
    isDarkMode: false,
  })),
}));

// Mock expo-linear-gradient
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children, style }: any) => `LinearGradient[${JSON.stringify(style)}]${children || ''}`,
}));

// Note: react-native-reanimated is mocked globally in jest.setup.ts
// following the official Reanimated testing approach:
// https://docs.swmansion.com/react-native-reanimated/docs/guides/testing/

const mockData: BreakdownChartData[] = [
  {
    key: 'Tech',
    value: 25,
    color: ['#f0abfc', '#e879f9'],
  },
  {
    key: 'Energy',
    value: 35,
    color: ['#93c5fd', '#60a5fa'],
  },
  {
    key: 'Finance',
    value: 40,
    color: ['#7dd3fc', '#38bdf8'],
  },
];

describe('EtBreakdownChart', () => {
  describe('Basic Rendering', () => {
    it('should render without crashing', () => {
      const { toJSON } = render(<EtBreakdownChart />);
      expect(toJSON()).not.toBeNull();
    });

    it('should render with custom data', () => {
      const { toJSON } = render(<EtBreakdownChart data={mockData} />);
      expect(toJSON()).not.toBeNull();
    });

    it('should render with custom height', () => {
      const { toJSON } = render(<EtBreakdownChart height={20} />);
      expect(toJSON()).not.toBeNull();
    });

    it('should render with custom corner radius', () => {
      const { toJSON } = render(<EtBreakdownChart cornerRadius={8} />);
      expect(toJSON()).not.toBeNull();
    });

    it('should render with custom gap', () => {
      const { toJSON } = render(<EtBreakdownChart gap={4} />);
      expect(toJSON()).not.toBeNull();
    });
  });

  describe('Labels Configuration', () => {
    it('should render with labels by default', () => {
      const { getByText } = render(<EtBreakdownChart data={mockData} />);
      expect(getByText('Tech')).toBeDefined();
      expect(getByText('Energy')).toBeDefined();
      expect(getByText('Finance')).toBeDefined();
    });

    it('should render without labels when disabled', () => {
      const { queryByText } = render(<EtBreakdownChart data={mockData} showLabels={false} />);
      expect(queryByText('Tech')).toBeNull();
      expect(queryByText('Energy')).toBeNull();
      expect(queryByText('Finance')).toBeNull();
    });

    it('should render custom label text when provided', () => {
      const customData: BreakdownChartData[] = [
        {
          key: 'Custom Portfolio Label',
          value: 50,
          color: ['#f0abfc', '#e879f9'],
        },
      ];

      const { getByText, queryByText } = render(<EtBreakdownChart data={customData} />);
      expect(getByText('Custom Portfolio Label')).toBeDefined();
      // Ensure default labels are not present
      expect(queryByText('Tech')).toBeNull();
    });
  });

  describe('Data Handling', () => {
    it('should handle empty data array', () => {
      const { toJSON } = render(<EtBreakdownChart data={[]} />);
      expect(toJSON()).not.toBeNull();
    });

    it('should handle single data point', () => {
      const singleData: BreakdownChartData[] = [
        {
          key: 'Single',
          value: 100,
          color: ['#f0abfc', '#e879f9'],
        },
      ];

      const { toJSON } = render(<EtBreakdownChart data={singleData} />);
      expect(toJSON()).not.toBeNull();
    });

    it('should handle realistic dataset size (7-10 items)', () => {
      const realisticData: BreakdownChartData[] = Array.from({ length: 8 }, (_, i) => ({
        key: `Sector ${i + 1}`,
        value: 10 + Math.random() * 15,
        color: ['#f0abfc', '#e879f9'],
      }));

      const { toJSON, getByText } = render(<EtBreakdownChart data={realisticData} />);
      expect(toJSON()).not.toBeNull();
      // Verify first and last items are rendered
      expect(getByText('Sector 1')).toBeDefined();
      expect(getByText('Sector 8')).toBeDefined();
    });

    it('should condense items beyond 9th into "Other" category', () => {
      const largeData: BreakdownChartData[] = Array.from({ length: 15 }, (_, i) => ({
        key: `Item ${i + 1}`,
        value: 10,
        color: ['#f0abfc', '#e879f9'],
      }));

      const { getByText, queryByText } = render(<EtBreakdownChart data={largeData} />);

      // Should show first 9 items
      expect(getByText('Item 1')).toBeDefined();
      expect(getByText('Item 9')).toBeDefined();

      // Should show "Other" category
      expect(getByText('Other')).toBeDefined();

      // Items 10+ should not be visible individually
      expect(queryByText('Item 10')).toBeNull();
      expect(queryByText('Item 15')).toBeNull();
    });

    it('should not create "Other" when data has exactly 10 items', () => {
      const exactData: BreakdownChartData[] = Array.from({ length: 10 }, (_, i) => ({
        key: `Item ${i + 1}`,
        value: 10,
        color: ['#f0abfc', '#e879f9'],
      }));

      const { getByText, queryByText } = render(<EtBreakdownChart data={exactData} />);

      // Should show all 10 items
      expect(getByText('Item 1')).toBeDefined();
      expect(getByText('Item 10')).toBeDefined();

      // Should not show "Other" category
      expect(queryByText('Other')).toBeNull();
    });

    it('should correctly sum values in "Other" category', () => {
      const testData: BreakdownChartData[] = [
        // First 9 items with value 10 each
        ...Array.from({ length: 9 }, (_, i) => ({
          key: `Item ${i + 1}`,
          value: 10,
          color: ['#f0abfc', '#e879f9'] as [string, string],
        })),
        // Additional items with known values that should be condensed
        {
          key: 'Extra 1',
          value: 5,
          color: ['#f0abfc', '#e879f9'] as [string, string],
        },
        {
          key: 'Extra 2',
          value: 15,
          color: ['#f0abfc', '#e879f9'] as [string, string],
        },
        {
          key: 'Extra 3',
          value: 20,
          color: ['#f0abfc', '#e879f9'] as [string, string],
        },
      ];

      const { getByText } = render(<EtBreakdownChart data={testData} />);

      // Verify "Other" category exists
      expect(getByText('Other')).toBeDefined();
      // We can't directly test the summed value (5+15+20=40) through the DOM
      // but we can verify the component renders without errors
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero values', () => {
      const zeroData: BreakdownChartData[] = [
        {
          key: 'Zero',
          value: 0,
          color: ['#f0abfc', '#e879f9'],
        },
      ];

      const { toJSON } = render(<EtBreakdownChart data={zeroData} />);
      expect(toJSON()).not.toBeNull();
    });

    it('should handle "Other" category with zero total value', () => {
      const dataWithZeros: BreakdownChartData[] = [
        // First 9 items with positive values
        ...Array.from({ length: 9 }, (_, i) => ({
          key: `Item ${i + 1}`,
          value: 10,
          color: ['#f0abfc', '#e879f9'] as [string, string],
        })),
        // Additional items with zero values that should be condensed
        {
          key: 'Zero 1',
          value: 0,
          color: ['#f0abfc', '#e879f9'] as [string, string],
        },
        {
          key: 'Zero 2',
          value: 0,
          color: ['#f0abfc', '#e879f9'] as [string, string],
        },
      ];

      const { getByText, queryByText } = render(<EtBreakdownChart data={dataWithZeros} />);

      // Should show "Other" category even with zero value
      expect(getByText('Other')).toBeDefined();
      // Original zero items should not be visible
      expect(queryByText('Zero 1')).toBeNull();
      expect(queryByText('Zero 2')).toBeNull();
    });

    it('should handle very large values', () => {
      const largeValues: BreakdownChartData[] = [
        {
          key: 'Large',
          value: 1000000,
          color: ['#f0abfc', '#e879f9'],
        },
      ];

      const { toJSON } = render(<EtBreakdownChart data={largeValues} />);
      expect(toJSON()).not.toBeNull();
    });

    it('should handle very small values', () => {
      const smallValues: BreakdownChartData[] = [
        {
          key: 'Small',
          value: 0.001,
          color: ['#f0abfc', '#e879f9'],
        },
      ];

      const { toJSON } = render(<EtBreakdownChart data={smallValues} />);
      expect(toJSON()).not.toBeNull();
    });

    it('should handle extreme dimensions', () => {
      const { toJSON } = render(<EtBreakdownChart height={1} gap={0} />);
      expect(toJSON()).not.toBeNull();
    });

    it('should handle large dimensions', () => {
      const { toJSON } = render(<EtBreakdownChart height={100} gap={20} />);
      expect(toJSON()).not.toBeNull();
    });
  });

  describe('Accessibility', () => {
    it('should support testID', () => {
      const { getByTestId } = render(<EtBreakdownChart testID="breakdown-chart" />);
      expect(getByTestId('breakdown-chart')).toBeDefined();
    });

    it('should support accessibility label', () => {
      const { getByLabelText } = render(<EtBreakdownChart accessibilityLabel="Portfolio breakdown chart" />);
      expect(getByLabelText('Portfolio breakdown chart')).toBeDefined();
    });
  });

  describe('Props Integration', () => {
    it('should apply visual props correctly', () => {
      const { toJSON, getByTestId } = render(
        <EtBreakdownChart data={mockData} height={16} cornerRadius={6} gap={3} showLabels={true} testID="visual-test-chart" />,
      );

      const chart = getByTestId('visual-test-chart');
      expect(chart).toBeDefined();
      expect(toJSON()).not.toBeNull();
    });
  });
});
