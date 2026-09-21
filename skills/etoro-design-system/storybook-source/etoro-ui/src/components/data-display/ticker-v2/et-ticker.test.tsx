import { render } from '@testing-library/react-native';
import { Dimensions, StyleSheet, View } from 'react-native';

import { EtTicker } from './et-ticker';
import { TickerItem } from './subcomponents';

// Note: react-native-reanimated is mocked globally in jest.setup.ts

const DEFAULT_DIMENSIONS = {
  width: 375,
  height: 812,
  scale: 2,
  fontScale: 1,
};

const mockDimensionsGet = jest.spyOn(Dimensions, 'get').mockReturnValue(DEFAULT_DIMENSIONS);

// Mock gesture handler
jest.mock('react-native-gesture-handler', () => {
  return {
    Gesture: {
      Pan: () => ({
        enabled: jest.fn().mockReturnThis(),
        onBegin: jest.fn().mockReturnThis(),
        onChange: jest.fn().mockReturnThis(),
        onFinalize: jest.fn().mockReturnThis(),
      }),
    },
    GestureDetector: ({ children }: any) => children,
  };
});

// Mock useEtoroTheme hook
jest.mock('etoro-ui/core/hooks', () => ({
  useEtoroTheme: () => ({
    colors: {
      textSecondaryNeutral: '#666666',
      statusPositive: '#00CC44',
      statusNegative: '#FF3366',
    },
  }),
}));

// Mock Marquee to simplify testing
jest.mock('./subcomponents/marquee', () => ({
  Marquee: ({ children, ...props }: any) => {
    const MockView = require('react-native').View;
    return (
      <MockView testID="marquee" {...props}>
        {children}
      </MockView>
    );
  },
}));

// Mock LinearGradient so we can detect gradient rendering
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: (props: any) => {
    const MockView = require('react-native').View;
    return <MockView testID="linear-gradient" {...props} />;
  },
}));

const mockData = [
  {
    instrumentId: 1,
    name: 'AAPL',
    currentPrice: 150.25,
    dailyChange: 2.5,
    navigationUrl: '/instruments/1',
  },
  {
    instrumentId: 2,
    name: 'TSLA',
    currentPrice: 800.5,
    dailyChange: -1.2,
    navigationUrl: '/instruments/2',
  },
];

describe('EtTicker', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDimensionsGet.mockReturnValue(DEFAULT_DIMENSIONS);
  });

  describe('Simple API (items prop)', () => {
    it('should return null for empty items', () => {
      const { toJSON } = render(<EtTicker items={[]} />);
      expect(toJSON()).toBeNull();
    });

    it('should return null when items is undefined', () => {
      const { toJSON } = render(<EtTicker />);
      expect(toJSON()).toBeNull();
    });

    it('should render ticker items when data is provided', () => {
      const { getByTestId } = render(<EtTicker items={mockData} />);
      expect(getByTestId('ticker-item-1')).toBeDefined();
      expect(getByTestId('ticker-item-2')).toBeDefined();
    });

    it('should render marquee when data is provided', () => {
      const { getByTestId } = render(<EtTicker items={mockData} />);
      expect(getByTestId('marquee')).toBeDefined();
    });

    it('should accept custom speed prop', () => {
      const { getByTestId } = render(<EtTicker items={mockData} speed={1.2} />);
      expect(getByTestId('marquee')).toBeDefined();
    });

    it('should accept custom style prop', () => {
      const customStyle = { backgroundColor: 'red' };
      const { getByTestId } = render(<EtTicker items={mockData} style={customStyle} />);
      expect(getByTestId('ticker-item-1')).toBeDefined();
    });

    it('should grow the ticker height when the system font scale increases', () => {
      mockDimensionsGet.mockReturnValue({ ...DEFAULT_DIMENSIONS, fontScale: 2 });

      const { getByTestId } = render(<EtTicker items={mockData} testID="ticker" />);
      const tickerStyle = StyleSheet.flatten(getByTestId('ticker').props.style);

      expect(tickerStyle.height).toBe(48);
    });

    it('should render gradient by default', () => {
      const { getAllByTestId } = render(<EtTicker items={mockData} />);
      // TickerGradient renders two LinearGradient elements (left + right)
      expect(getAllByTestId('linear-gradient')).toHaveLength(2);
    });

    it('should not render gradient when gradient={false}', () => {
      const { queryAllByTestId } = render(<EtTicker items={mockData} gradient={false} />);
      expect(queryAllByTestId('linear-gradient')).toHaveLength(0);
    });
  });

  describe('Compound API (children)', () => {
    it('should render children when provided', () => {
      const { getByTestId } = render(
        <EtTicker speed={0.5}>
          <View testID="custom-child" />
        </EtTicker>,
      );
      expect(getByTestId('custom-child')).toBeDefined();
    });

    it('should ignore items prop when children are provided', () => {
      const { queryByTestId, getByTestId } = render(
        <EtTicker items={mockData} speed={0.5}>
          <View testID="custom-child" />
        </EtTicker>,
      );
      expect(getByTestId('custom-child')).toBeDefined();
      // Marquee from simple mode should NOT be rendered
      expect(queryByTestId('marquee')).toBeNull();
    });
  });

  describe('Accessibility', () => {
    it('should use default accessibility label based on item count', () => {
      const { getByLabelText } = render(<EtTicker items={mockData} />);
      expect(getByLabelText('Financial ticker displaying 2 stocks with prices and changes')).toBeDefined();
    });

    it('should use singular label for single item', () => {
      const { getByLabelText } = render(<EtTicker items={[mockData[0]]} />);
      expect(getByLabelText('Financial ticker displaying 1 stock with prices and changes')).toBeDefined();
    });

    it('should use custom accessibility label when provided', () => {
      const { getByLabelText } = render(<EtTicker items={mockData} accessibilityLabel="Custom ticker label" />);
      expect(getByLabelText('Custom ticker label')).toBeDefined();
    });

    it('should apply correct accessibility role', () => {
      const { getByLabelText } = render(<EtTicker items={mockData} />);
      const ticker = getByLabelText('Financial ticker displaying 2 stocks with prices and changes');
      expect(ticker.props.accessibilityRole).toBe('text');
    });

    it('should apply custom testID', () => {
      const { getByTestId } = render(<EtTicker items={mockData} testID="custom-ticker" />);
      expect(getByTestId('custom-ticker')).toBeDefined();
    });

    it('should apply custom accessibility hint', () => {
      const { getByLabelText } = render(<EtTicker items={mockData} accessibilityLabel="Stock ticker" accessibilityHint="Custom hint" />);
      const element = getByLabelText('Stock ticker');
      expect(element.props.accessibilityHint).toBe('Custom hint');
    });
  });

  describe('Context errors', () => {
    it('should throw when TickerItem is used outside EtTicker', () => {
      expect(() => render(<TickerItem item={mockData[0]} testID="orphan-item" />)).toThrow(
        'EtTicker compound components must be used within an EtTicker component',
      );
    });
  });

  describe('Compound components are attached', () => {
    it('should have Item subcomponent', () => {
      expect(EtTicker.Item).toBeDefined();
    });

    it('should have Content subcomponent', () => {
      expect(EtTicker.Content).toBeDefined();
    });

    it('should have FilterIcon subcomponent', () => {
      expect(EtTicker.FilterIcon).toBeDefined();
    });

    it('should have Gradient subcomponent', () => {
      expect(EtTicker.Gradient).toBeDefined();
    });

    it('should have Marquee subcomponent', () => {
      expect(EtTicker.Marquee).toBeDefined();
    });

    it('should have Start subcomponent', () => {
      expect(EtTicker.Start).toBeDefined();
    });

    it('should have End subcomponent', () => {
      expect(EtTicker.End).toBeDefined();
    });
  });
});
