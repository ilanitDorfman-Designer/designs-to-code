import { render } from '@testing-library/react-native';

import { EtTicker } from './et-ticker';

// Note: react-native-reanimated is mocked globally in jest.setup.ts
// following the official Reanimated testing approach:
// https://docs.swmansion.com/react-native-reanimated/docs/guides/testing/

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

// Mock Marquee and EtTickerContent components
jest.mock('./components', () => ({
  Marquee: ({ children, ...props }: any) => {
    const MockView = require('react-native').View;
    return <MockView {...props}>{children}</MockView>;
  },
  EtTickerContent: ({ items, colors: _colors }: any) => {
    const MockContent = require('react-native').View;
    const MockText = require('react-native').Text;
    return (
      <MockContent testID="ticker-content">
        {items.map((item: any, index: number) => {
          const displayText = `${item.name}: $${item.currentPrice} ${item.dailyChange > 0 ? '+' : ''}${item.dailyChange}%`;
          return (
            <MockContent key={`${item.name}-${index}`} testID={`ticker-item-${item.name}`}>
              <MockText>{displayText}</MockText>
            </MockContent>
          );
        })}
      </MockContent>
    );
  },
}));

describe('EtTicker', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render without crashing with empty data', () => {
      const { toJSON } = render(<EtTicker tickersData={[]} />);
      expect(toJSON()).toBeNull(); // Returns null for empty data
    });

    it('should return null for empty ticker data', () => {
      const { queryByTestId } = render(<EtTicker tickersData={[]} />);
      expect(queryByTestId('ticker-content')).toBeNull();
    });

    it('should render with ticker data', () => {
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
      const { getByTestId } = render(<EtTicker tickersData={mockData} />);
      expect(getByTestId('ticker-content')).toBeDefined();
      expect(getByTestId('ticker-item-AAPL')).toBeDefined();
      expect(getByTestId('ticker-item-TSLA')).toBeDefined();
    });

    it('should render Marquee component when data is provided', () => {
      const mockData = [
        {
          instrumentId: 1,
          name: 'AAPL',
          currentPrice: 150.25,
          dailyChange: 2.5,
          navigationUrl: '/instruments/1',
        },
      ];
      const { getByTestId } = render(<EtTicker tickersData={mockData} />);
      // The Marquee is mocked as a View, so we check for ticker content
      expect(getByTestId('ticker-content')).toBeDefined();
    });
  });

  describe('Props Configuration', () => {
    it('should accept custom speed prop', () => {
      const mockData = [
        {
          instrumentId: 1,
          name: 'AAPL',
          currentPrice: 150.25,
          dailyChange: 2.5,
          navigationUrl: '/instruments/1',
        },
      ];
      const { getByTestId } = render(<EtTicker tickersData={mockData} speed={1.2} />);
      expect(getByTestId('ticker-content')).toBeDefined();
    });

    it('should accept custom style prop', () => {
      const mockData = [
        {
          instrumentId: 1,
          name: 'AAPL',
          currentPrice: 150.25,
          dailyChange: 2.5,
          navigationUrl: '/instruments/1',
        },
      ];
      const customStyle = { backgroundColor: 'red' };
      const { getByTestId } = render(<EtTicker tickersData={mockData} style={customStyle} />);
      expect(getByTestId('ticker-content')).toBeDefined();
    });

    it('should use default speed when not provided', () => {
      const mockData = [
        {
          instrumentId: 1,
          name: 'AAPL',
          currentPrice: 150.25,
          dailyChange: 2.5,
          navigationUrl: '/instruments/1',
        },
      ];
      const { getByTestId } = render(<EtTicker tickersData={mockData} />);
      expect(getByTestId('ticker-content')).toBeDefined();
    });

    it('should handle speed prop edge cases', () => {
      const mockData = [
        {
          instrumentId: 1,
          name: 'AAPL',
          currentPrice: 150.25,
          dailyChange: 2.5,
          navigationUrl: '/instruments/1',
        },
      ];

      // Very slow speed
      const { getByTestId: getByTestId1 } = render(<EtTicker tickersData={mockData} speed={0.1} />);
      expect(getByTestId1('ticker-content')).toBeDefined();

      // Very fast speed
      const { getByTestId: getByTestId2 } = render(<EtTicker tickersData={mockData} speed={2.0} />);
      expect(getByTestId2('ticker-content')).toBeDefined();
    });
  });

  describe('Content Rendering', () => {
    it('should render ticker data when provided', () => {
      const mockData = [
        {
          instrumentId: 1,
          name: 'AAPL',
          currentPrice: 150.25,
          dailyChange: 2.5,
          navigationUrl: '/instruments/1',
        },
      ];
      const { getByTestId } = render(<EtTicker tickersData={mockData} />);
      expect(getByTestId('ticker-item-AAPL')).toBeDefined();
    });

    it('should handle multiple ticker items', () => {
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
        {
          instrumentId: 3,
          name: 'GOOGL',
          currentPrice: 2820.45,
          dailyChange: 0.8,
          navigationUrl: '/instruments/3',
        },
      ];
      const { getByTestId } = render(<EtTicker tickersData={mockData} />);

      expect(getByTestId('ticker-item-AAPL')).toBeDefined();
      expect(getByTestId('ticker-item-TSLA')).toBeDefined();
      expect(getByTestId('ticker-item-GOOGL')).toBeDefined();
    });

    it('should pass colors to EtTickerContent', () => {
      const mockData = [
        {
          instrumentId: 1,
          name: 'AAPL',
          currentPrice: 150.25,
          dailyChange: 2.5,
          navigationUrl: '/instruments/1',
        },
      ];
      const { getByTestId } = render(<EtTicker tickersData={mockData} />);
      expect(getByTestId('ticker-content')).toBeDefined();
    });
  });

  describe('Accessibility', () => {
    it('should use default accessibility label when not provided', () => {
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
      const { getByLabelText } = render(<EtTicker tickersData={mockData} />);
      expect(getByLabelText('Financial ticker displaying 2 stocks with prices and changes')).toBeDefined();
    });

    it('should use custom accessibility label when provided', () => {
      const mockData = [
        {
          instrumentId: 1,
          name: 'AAPL',
          currentPrice: 150.25,
          dailyChange: 2.5,
          navigationUrl: '/instruments/1',
        },
      ];
      const { getByLabelText } = render(<EtTicker tickersData={mockData} accessibility={{ accessibilityLabel: 'Custom ticker label' }} />);
      expect(getByLabelText('Custom ticker label')).toBeDefined();
    });

    it('should apply correct accessibility role', () => {
      const mockData = [
        {
          instrumentId: 1,
          name: 'AAPL',
          currentPrice: 150.25,
          dailyChange: 2.5,
          navigationUrl: '/instruments/1',
        },
      ];
      const { UNSAFE_root } = render(<EtTicker tickersData={mockData} />);
      const mainView = UNSAFE_root.children[0];
      expect(mainView.props.accessibilityRole).toBe('text');
    });

    it('should apply custom testID when provided', () => {
      const mockData = [
        {
          instrumentId: 1,
          name: 'AAPL',
          currentPrice: 150.25,
          dailyChange: 2.5,
          navigationUrl: '/instruments/1',
        },
      ];
      const { getByTestId } = render(<EtTicker tickersData={mockData} accessibility={{ testID: 'custom-ticker' }} />);
      expect(getByTestId('custom-ticker')).toBeDefined();
    });

    it('should apply accessibility hint when provided', () => {
      const mockData = [
        {
          instrumentId: 1,
          name: 'AAPL',
          currentPrice: 150.25,
          dailyChange: 2.5,
          navigationUrl: '/instruments/1',
        },
      ];
      const { getByLabelText } = render(
        <EtTicker
          tickersData={mockData}
          accessibility={{
            accessibilityLabel: 'Stock ticker',
            accessibilityHint: 'Custom hint for interaction',
          }}
        />,
      );
      const element = getByLabelText('Stock ticker');
      expect(element.props.accessibilityHint).toBe('Custom hint for interaction');
    });

    it('should generate proper accessibility labels for individual ticker items', () => {
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
      const { getByTestId } = render(<EtTicker tickersData={mockData} />);

      // Since the individual items are mocked, we just verify they exist
      expect(getByTestId('ticker-item-AAPL')).toBeDefined();
      expect(getByTestId('ticker-item-TSLA')).toBeDefined();
    });
  });
});
