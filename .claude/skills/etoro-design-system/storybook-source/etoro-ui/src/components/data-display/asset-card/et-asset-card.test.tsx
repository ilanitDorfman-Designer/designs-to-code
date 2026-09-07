import { fireEvent, render } from '@testing-library/react-native';

import type { EtAssetCardProps } from './api';
import { EtAssetCard } from './et-asset-card';

// Mock EtText component
jest.mock('../../../foundations/text', () => ({
  EtText: function MockEtText({ children, testID, ...props }: any) {
    const React = require('react');
    const { Text } = require('react-native');
    return React.createElement(Text, { testID, ...props }, children);
  },
}));

// Mock components
const _mockAssetChart = jest.fn();
const _mockAssetHeader = jest.fn();
const _mockAssetPriceMetrics = jest.fn();
const _mockCategoryBadges = jest.fn();

jest.mock('./components', () => {
  const mockAssetChart = jest.fn((props: any) => {
    const React = require('react');
    const { View, Text } = require('react-native');
    return React.createElement(View, { testID: 'asset-chart' }, React.createElement(Text, {}, `Chart: ${props.currentPrice} ${props.currency}`));
  });

  const mockAssetHeader = jest.fn((props: any) => {
    const React = require('react');
    const { View, Text } = require('react-native');
    return React.createElement(View, { testID: 'asset-header' }, React.createElement(Text, {}, `${props.asset.symbol}: ${props.asset.name}`));
  });

  const mockAssetPriceMetrics = jest.fn((props: any) => {
    const React = require('react');
    const { View, Text } = require('react-native');
    return React.createElement(
      View,
      { testID: 'asset-price-metrics' },
      React.createElement(Text, {}, `Price: ${props.currentPrice} ${props.currency}`),
    );
  });

  const mockCategoryBadges = jest.fn((props: any) => {
    const React = require('react');
    const { View, Text } = require('react-native');
    return React.createElement(View, { testID: 'category-badges' }, React.createElement(Text, {}, `Categories: ${props.categories.length}`));
  });

  return {
    AssetChart: mockAssetChart,
    AssetHeader: mockAssetHeader,
    AssetPriceMetrics: mockAssetPriceMetrics,
    CategoryBadges: mockCategoryBadges,
  };
});

// Mock core hooks
jest.mock('../../../core/hooks', () => ({
  useEtoroTheme: jest.fn(() => ({
    colors: {
      primary: '#00D2AA',
      secondary: '#808080',
      background: '#FFFFFF',
      surface: '#F5F5F5',
      border: '#E0E0E0',
      text: '#000000',
      disabled: '#CCCCCC',
    },
    gradients: {},
    fonts: {},
  })),
}));

// Mock hooks
jest.mock('./hooks', () => ({
  useAssetCardHandlers: jest.fn(() => ({
    handlePress: jest.fn(),
    handleClose: jest.fn(),
    handleAdd: jest.fn(),
  })),
}));

// Mock utils
jest.mock('./utils', () => ({
  generateMockChartData: jest.fn(() => [
    { timestamp: '2023-01-01', price: 100 },
    { timestamp: '2023-01-02', price: 105 },
  ]),
  initProps: jest.fn((props) => ({
    asset: props.asset,
    priceMetrics: props.priceMetrics,
    display: props.display || {},
    chart: props.chart || {},
    interaction: props.interaction || {},
    style: props.style || {},
    accessibility: props.accessibility || {},
  })),
}));

// Get mocked functions for assertions
const { useAssetCardHandlers: useAssetCardHandlersMock } = require('./hooks');
const { initProps: initPropsMock } = require('./utils');
const { AssetChart, AssetHeader, AssetPriceMetrics, CategoryBadges } = require('./components');

const createMockAsset = (overrides: any = {}) => ({
  symbol: 'AAPL',
  name: 'Apple Inc.',
  currentPrice: 150.5,
  currency: 'USD',
  logo: 'apple-logo.png',
  exchange: 'NASDAQ',
  ...overrides,
});

const createMockProps = (overrides: Partial<EtAssetCardProps> = {}): EtAssetCardProps => ({
  asset: createMockAsset(),
  ...overrides,
});

describe('EtAssetCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AssetChart as jest.Mock).mockClear();
    (AssetHeader as jest.Mock).mockClear();
    (AssetPriceMetrics as jest.Mock).mockClear();
    (CategoryBadges as jest.Mock).mockClear();
  });

  describe('Basic Rendering', () => {
    it('renders with required props', () => {
      const props = createMockProps();
      const { getByTestId } = render(<EtAssetCard {...props} />);

      expect(getByTestId('asset-header')).toBeTruthy();
      expect(getByTestId('category-badges')).toBeTruthy();
    });

    it('calls initProps with correct arguments', () => {
      const props = createMockProps();
      render(<EtAssetCard {...props} />);

      expect(initPropsMock).toHaveBeenCalledWith(props);
    });

    it('applies custom testID when provided', () => {
      const props = createMockProps({
        accessibility: { testID: 'custom-asset-card' },
      });
      const { getByTestId } = render(<EtAssetCard {...props} />);

      expect(getByTestId('custom-asset-card')).toBeTruthy();
    });

    it('applies custom accessibility label when provided', () => {
      const props = createMockProps({
        accessibility: {
          testID: 'asset-card',
          accessibilityLabel: 'Apple stock card',
        },
      });
      const { getByTestId } = render(<EtAssetCard {...props} />);

      const card = getByTestId('asset-card');
      expect(card.props.accessibilityLabel).toBe('Apple stock card');
    });
  });

  describe('Display Modes', () => {
    it('renders compact mode correctly', () => {
      const props = createMockProps({
        display: { compact: true },
        chart: {
          chartData: [{ timestamp: '2023-01-01', price: 100 }],
        },
      });
      const { getByTestId, queryByText } = render(<EtAssetCard {...props} />);

      expect(getByTestId('asset-chart')).toBeTruthy();
      // Description should not be visible in compact mode
      expect(queryByText('Test description')).toBeNull();
    });

    it('renders minimal mode correctly', () => {
      const props = createMockProps({
        display: { minimal: true },
        priceMetrics: {
          changeAmount: 5.5,
          changePercentage: 3.7,
          isPositive: true,
        },
      });
      const { queryByTestId } = render(<EtAssetCard {...props} />);

      // Price metrics should not be visible in minimal mode
      expect(queryByTestId('asset-price-metrics')).toBeNull();
    });

    it('renders regular mode with all sections', () => {
      const props = createMockProps({
        display: {
          description: 'Test description',
          lastUpdated: '2023-01-01T10:00:00Z',
        },
        priceMetrics: {
          changeAmount: 5.5,
          changePercentage: 3.7,
          isPositive: true,
        },
      });
      const { getByTestId, getByText } = render(<EtAssetCard {...props} />);

      expect(getByTestId('asset-header')).toBeTruthy();
      expect(getByTestId('category-badges')).toBeTruthy();
      expect(getByTestId('asset-price-metrics')).toBeTruthy();
      expect(getByText('Test description')).toBeTruthy();
      expect(getByText('2023-01-01T10:00:00Z')).toBeTruthy();
    });
  });

  describe('Chart Display', () => {
    it('renders chart in compact mode with chart data', () => {
      const chartData = [
        { timestamp: '2023-01-01', price: 100 },
        { timestamp: '2023-01-02', price: 105 },
      ];
      const props = createMockProps({
        display: { compact: true },
        chart: { chartData },
      });
      const { getByTestId } = render(<EtAssetCard {...props} />);

      expect(getByTestId('asset-chart')).toBeTruthy();
    });

    it('generates mock chart data when not provided in compact mode', () => {
      const { generateMockChartData } = require('./utils');
      const props = createMockProps({
        display: { compact: true },
        chart: {
          compactStats: {
            changePercentage: 3.5,
            changePeriod: '1D',
          },
        },
      });
      render(<EtAssetCard {...props} />);

      expect(generateMockChartData).toHaveBeenCalledWith(150.5, true);
    });

    it('does not render chart in regular mode', () => {
      const chartData = [
        { timestamp: '2023-01-01', price: 100 },
        { timestamp: '2023-01-02', price: 105 },
      ];
      const props = createMockProps({
        display: { compact: false },
        chart: { chartData },
      });
      const { queryByTestId } = render(<EtAssetCard {...props} />);

      expect(queryByTestId('asset-chart')).toBeNull();
    });
  });

  describe('Content Display', () => {
    it('renders description when provided in regular mode', () => {
      const props = createMockProps({
        display: { description: 'Apple is a technology company' },
      });
      const { getByText } = render(<EtAssetCard {...props} />);

      expect(getByText('Apple is a technology company')).toBeTruthy();
    });

    it('does not render description in compact mode', () => {
      const props = createMockProps({
        display: {
          compact: true,
          description: 'Apple is a technology company',
        },
      });
      const { queryByText } = render(<EtAssetCard {...props} />);

      expect(queryByText('Apple is a technology company')).toBeNull();
    });

    it('renders last updated timestamp when provided', () => {
      const timestamp = '2023-01-01T10:00:00Z';
      const props = createMockProps({
        display: { lastUpdated: timestamp },
      });
      const { getByText } = render(<EtAssetCard {...props} />);

      expect(getByText(timestamp)).toBeTruthy();
    });

    it('does not render timestamp in compact mode', () => {
      const timestamp = '2023-01-01T10:00:00Z';
      const props = createMockProps({
        display: {
          compact: true,
          lastUpdated: timestamp,
        },
      });
      const { queryByText } = render(<EtAssetCard {...props} />);

      expect(queryByText(timestamp)).toBeNull();
    });
  });

  describe('Price Metrics', () => {
    it('renders price metrics in regular mode', () => {
      const priceMetrics = {
        changeAmount: 5.5,
        changePercentage: 3.7,
        isPositive: true,
      };
      const props = createMockProps({ priceMetrics });
      const { getByTestId } = render(<EtAssetCard {...props} />);

      expect(getByTestId('asset-price-metrics')).toBeTruthy();
    });

    it('does not render price metrics in compact mode', () => {
      const priceMetrics = {
        changeAmount: 5.5,
        changePercentage: 3.7,
        isPositive: true,
      };
      const props = createMockProps({
        display: { compact: true },
        priceMetrics,
      });
      const { queryByTestId } = render(<EtAssetCard {...props} />);

      expect(queryByTestId('asset-price-metrics')).toBeNull();
    });

    it('does not render price metrics in minimal mode', () => {
      const priceMetrics = {
        changeAmount: 5.5,
        changePercentage: 3.7,
        isPositive: true,
      };
      const props = createMockProps({
        display: { minimal: true },
        priceMetrics,
      });
      const { queryByTestId } = render(<EtAssetCard {...props} />);

      expect(queryByTestId('asset-price-metrics')).toBeNull();
    });
  });

  describe('Interactions', () => {
    it('handles press events when onPress is provided', () => {
      const mockHandlers = {
        handlePress: jest.fn(),
        handleClose: jest.fn(),
        handleAdd: jest.fn(),
      };
      useAssetCardHandlersMock.mockReturnValue(mockHandlers);

      const onPress = jest.fn();
      const props = createMockProps({
        interaction: { onPress },
        accessibility: { testID: 'asset-card' },
      });
      const { getByTestId } = render(<EtAssetCard {...props} />);

      fireEvent.press(getByTestId('asset-card'));
      expect(mockHandlers.handlePress).toHaveBeenCalled();
    });

    it('does not handle press when onPress is not provided', () => {
      const props = createMockProps({
        accessibility: { testID: 'asset-card' },
      });
      const { getByTestId } = render(<EtAssetCard {...props} />);

      const card = getByTestId('asset-card');
      expect(card.props.onPress).toBeUndefined();
    });

    it('passes correct interaction config to useAssetCardHandlers', () => {
      const interaction = {
        onPress: jest.fn(),
        onClose: jest.fn(),
        onTrade: jest.fn(),
        onAdd: jest.fn(),
        haptics: true,
      };
      const props = createMockProps({ interaction });
      render(<EtAssetCard {...props} />);

      expect(useAssetCardHandlersMock).toHaveBeenCalledWith({
        onPress: interaction.onPress,
        onClose: interaction.onClose,
        onTrade: interaction.onTrade,
        onAdd: interaction.onAdd,
        haptics: interaction.haptics,
      });
    });
  });

  describe('Style Application', () => {
    it('applies custom styles', () => {
      const customStyle = { margin: 10 };
      const props = createMockProps({
        style: { style: customStyle },
        accessibility: { testID: 'asset-card' },
      });
      const { getByTestId } = render(<EtAssetCard {...props} />);

      const card = getByTestId('asset-card');
      expect(card.props.style).toEqual(expect.arrayContaining([expect.objectContaining(customStyle)]));
    });

    it('applies compact card styles when in compact mode', () => {
      const props = createMockProps({
        display: { compact: true },
        accessibility: { testID: 'asset-card' },
      });
      const { getByTestId } = render(<EtAssetCard {...props} />);

      const card = getByTestId('asset-card');
      expect(card.props.style).toEqual(expect.arrayContaining([expect.objectContaining({ width: 200 })]));
    });

    it('applies minimal card styles when in minimal mode', () => {
      const props = createMockProps({
        display: { minimal: true },
        accessibility: { testID: 'asset-card' },
      });
      const { getByTestId } = render(<EtAssetCard {...props} />);

      const card = getByTestId('asset-card');
      expect(card.props.style).toEqual(expect.arrayContaining([expect.objectContaining({ width: 180 })]));
    });
  });

  describe('Component Integration', () => {
    it('passes correct props to AssetHeader', () => {
      const asset = createMockAsset();
      const interaction = {
        showCloseButton: true,
        showAddButton: true,
        isAdded: false,
        addButtonText: 'Add to Watchlist',
        addedButtonText: 'Added',
      };
      const props = createMockProps({
        asset,
        display: { compact: true },
        interaction,
      });

      render(<EtAssetCard {...props} />);

      expect(AssetHeader).toHaveBeenCalledWith(
        expect.objectContaining({
          asset,
          compact: true,
          minimal: undefined,
          showCloseButton: true,
          showAddButton: true,
          isAdded: false,
          addButtonText: 'Add to Watchlist',
          addedButtonText: 'Added',
          colors: expect.any(Object),
          onAdd: expect.any(Function),
          onClose: expect.any(Function),
        }),
        undefined,
      );
    });

    it('passes correct props to CategoryBadges', () => {
      const categories = [
        { label: 'Technology', color: '#007BFF' },
        { label: 'Large Cap', color: '#28A745' },
      ];
      const props = createMockProps({
        display: { categories },
      });

      render(<EtAssetCard {...props} />);

      expect(CategoryBadges).toHaveBeenCalledWith(
        expect.objectContaining({
          categories,
          colors: expect.any(Object),
        }),
        undefined,
      );
    });

    it('passes correct props to AssetChart in compact mode', () => {
      const chartData = [{ timestamp: '2023-01-01', price: 100 }];
      const compactStats = {
        changePercentage: 3.5,
        changePeriod: '1D',
      };
      const asset = createMockAsset();
      const props = createMockProps({
        asset,
        display: { compact: true },
        chart: { chartData, compactStats },
      });

      render(<EtAssetCard {...props} />);

      expect(AssetChart).toHaveBeenCalledWith(
        expect.objectContaining({
          currentPrice: asset.currentPrice,
          currency: asset.currency,
          chartData,
          compactStats,
          colors: expect.any(Object),
          selectedValue: expect.any(Object),
        }),
        undefined,
      );
    });

    it('passes correct props to AssetPriceMetrics', () => {
      const asset = createMockAsset();
      const priceMetrics = {
        changeAmount: 5.5,
        changePercentage: 3.7,
        isPositive: true,
      };
      const interaction = {
        tradeButtonText: 'Trade Now',
      };
      const props = createMockProps({
        asset,
        priceMetrics,
        interaction,
      });

      render(<EtAssetCard {...props} />);

      expect(AssetPriceMetrics).toHaveBeenCalledWith(
        expect.objectContaining({
          currentPrice: asset.currentPrice,
          currency: asset.currency,
          priceMetrics,
          tradeButtonText: 'Trade Now',
          colors: expect.any(Object),
        }),
        undefined,
      );
    });
  });

  describe('Edge Cases', () => {
    it('handles missing optional props gracefully', () => {
      const props = createMockProps();
      expect(() => render(<EtAssetCard {...props} />)).not.toThrow();
    });

    it('handles empty categories array', () => {
      const props = createMockProps({
        display: { categories: [] },
      });
      const { getByTestId } = render(<EtAssetCard {...props} />);

      expect(getByTestId('category-badges')).toBeTruthy();
    });

    it('handles missing currency in asset', () => {
      const asset = createMockAsset({ currency: undefined });
      const props = createMockProps({ asset });

      expect(() => render(<EtAssetCard {...props} />)).not.toThrow();
    });

    it('handles zero price values', () => {
      const asset = createMockAsset({ currentPrice: 0 });
      const props = createMockProps({ asset });

      expect(() => render(<EtAssetCard {...props} />)).not.toThrow();
    });

    it('handles negative price values', () => {
      const asset = createMockAsset({ currentPrice: -10.5 });
      const props = createMockProps({ asset });

      expect(() => render(<EtAssetCard {...props} />)).not.toThrow();
    });
  });
});
