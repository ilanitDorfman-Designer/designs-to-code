import type { Meta, StoryObj } from '@storybook/react-native';
import { EtText } from 'etoro-ui';
import { EtTicker, TickerAccessibilityConfig, TickerItem } from 'etoro-ui/components/data-display/ticker';
import { useEtoroTheme } from 'etoro-ui/core';
import { ScrollView, StyleSheet, View } from 'react-native';

// Mock ticker data sets for different scenarios
const stockTickerData: TickerItem[] = [
  {
    instrumentId: 1,
    name: 'AAPL',
    currentPrice: 186.79,
    dailyChange: 2.1,
    navigationUrl: '/instruments/1',
  },
  {
    instrumentId: 2,
    name: 'TSLA',
    currentPrice: 245.67,
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
  {
    instrumentId: 4,
    name: 'MSFT',
    currentPrice: 415.26,
    dailyChange: 1.1,
    navigationUrl: '/instruments/4',
  },
  {
    instrumentId: 5,
    name: 'AMZN',
    currentPrice: 3456.78,
    dailyChange: -0.5,
    navigationUrl: '/instruments/5',
  },
];

const cryptoTickerData: TickerItem[] = [
  {
    instrumentId: 10,
    name: 'BTC',
    currentPrice: 45230.67,
    dailyChange: 4.2,
    navigationUrl: '/instruments/10',
    currencySymbol: '$',
  },
  {
    instrumentId: 11,
    name: 'ETH',
    currentPrice: 3125.45,
    dailyChange: -2.8,
    navigationUrl: '/instruments/11',
    currencySymbol: '$',
  },
  {
    instrumentId: 12,
    name: 'BNB',
    currentPrice: 485.23,
    dailyChange: 12.6,
    navigationUrl: '/instruments/12',
    currencySymbol: '$',
  },
  {
    instrumentId: 13,
    name: 'SOL',
    currentPrice: 98.76,
    dailyChange: 8.1,
    navigationUrl: '/instruments/13',
    currencySymbol: '$',
  },
  {
    instrumentId: 14,
    name: 'ADA',
    currentPrice: 0.845,
    dailyChange: -15.3,
    navigationUrl: '/instruments/14',
    currencySymbol: '$',
    minPrecision: 3,
    maxPrecision: 3,
  },
  {
    instrumentId: 15,
    name: 'DOT',
    currentPrice: 12.34,
    dailyChange: 6.7,
    navigationUrl: '/instruments/15',
    currencySymbol: '$',
  },
];

const singleItemData: TickerItem[] = [
  {
    instrumentId: 20,
    name: 'NVIDIA',
    currentPrice: 875.23,
    dailyChange: 7.3,
    navigationUrl: '/instruments/20',
  },
];

const multiCurrencyData: TickerItem[] = [
  {
    instrumentId: 30,
    name: 'EUR/USD',
    currentPrice: 1.0876,
    dailyChange: 0.3,
    navigationUrl: '/forex/eurusd',
    currencySymbol: '',
    minPrecision: 4,
    maxPrecision: 4,
  },
  {
    instrumentId: 31,
    name: 'GBP/USD',
    currentPrice: 1.2654,
    dailyChange: -0.5,
    navigationUrl: '/forex/gbpusd',
    currencySymbol: '',
    minPrecision: 4,
    maxPrecision: 4,
  },
  {
    instrumentId: 32,
    name: 'GOLD',
    currentPrice: 2015.5,
    dailyChange: 1.8,
    navigationUrl: '/commodities/gold',
    currencySymbol: '$',
    minPrecision: 2,
    maxPrecision: 2,
  },
  {
    instrumentId: 33,
    name: 'SILVER',
    currentPrice: 23.45,
    dailyChange: -0.7,
    navigationUrl: '/commodities/silver',
    currencySymbol: '$',
    minPrecision: 2,
    maxPrecision: 2,
  },
  {
    instrumentId: 34,
    name: 'CAC 40',
    currentPrice: 7456.32,
    dailyChange: 0.9,
    navigationUrl: '/indices/cac40',
    currencySymbol: '€',
  },
  {
    instrumentId: 35,
    name: 'FTSE 100',
    currentPrice: 7789.45,
    dailyChange: 1.2,
    navigationUrl: '/indices/ftse',
    currencySymbol: '£',
  },
];

const manyItemsData: TickerItem[] = [
  {
    instrumentId: 1,
    name: 'AAPL',
    currentPrice: 186.79,
    dailyChange: 2.1,
    navigationUrl: '/instruments/1',
  },
  {
    instrumentId: 4,
    name: 'MSFT',
    currentPrice: 415.26,
    dailyChange: 1.1,
    navigationUrl: '/instruments/4',
  },
  {
    instrumentId: 3,
    name: 'GOOGL',
    currentPrice: 2820.45,
    dailyChange: 0.8,
    navigationUrl: '/instruments/3',
  },
  {
    instrumentId: 5,
    name: 'AMZN',
    currentPrice: 3456.78,
    dailyChange: -0.5,
    navigationUrl: '/instruments/5',
  },
  {
    instrumentId: 2,
    name: 'TSLA',
    currentPrice: 245.67,
    dailyChange: -1.2,
    navigationUrl: '/instruments/2',
  },
  {
    instrumentId: 30,
    name: 'META',
    currentPrice: 345.67,
    dailyChange: -5.7,
    navigationUrl: '/instruments/30',
  },
  {
    instrumentId: 31,
    name: 'NVDA',
    currentPrice: 875.23,
    dailyChange: 7.3,
    navigationUrl: '/instruments/31',
  },
  {
    instrumentId: 32,
    name: 'NFLX',
    currentPrice: 456.78,
    dailyChange: 3.2,
    navigationUrl: '/instruments/32',
  },
  {
    instrumentId: 33,
    name: 'AMD',
    currentPrice: 123.45,
    dailyChange: -2.1,
    navigationUrl: '/instruments/33',
  },
  {
    instrumentId: 34,
    name: 'CRM',
    currentPrice: 234.56,
    dailyChange: 1.8,
    navigationUrl: '/instruments/34',
  },
];

// Enhanced EtTicker component for stories
interface EtTickerStoryProps {
  tickersData?: TickerItem[];
  speed?: number;
  accessibility?: TickerAccessibilityConfig;
  gradient?: boolean;
}

const EtTickerStory = ({ tickersData = stockTickerData, speed = 0.5, accessibility, gradient = true }: EtTickerStoryProps) => {
  return <EtTicker tickersData={tickersData} speed={speed} accessibility={accessibility} gradient={gradient} />;
};

type Story = StoryObj<typeof EtTickerStory>;

const meta: Meta<typeof EtTickerStory> = {
  title: 'eToro-UI/Components/DataDisplay/EtTicker',
  component: EtTickerStory,
  parameters: {
    notes:
      'A scrolling ticker component for displaying financial instrument data in an infinite loop. Built with @animatereactnative/marquee library for optimal performance and gesture support. Features comprehensive accessibility support with smart default labels, custom accessibility configuration, and screen reader optimization. Use the speed prop to control scrolling speed (0.1 = very slow, 2.0 = very fast). Drag to interact with the ticker.',
  },
  decorators: [
    (Story) => {
      const { colors } = useEtoroTheme();

      return (
        <View style={[styles.decorator, { backgroundColor: colors.bgNeutralSecondary }]}>
          <Story />
        </View>
      );
    },
  ],
};

export default meta;

// Basic Example - Simple Usage
export const BasicExample: Story = {
  render: () => {
    const { colors } = useEtoroTheme();

    return (
      <View style={styles.showcase}>
        <EtText variant="heading-compact" style={[styles.title, { color: colors.textPrimaryNeutral }]}>
          Basic Example
        </EtText>

        <View style={[styles.section, { backgroundColor: colors.bgNeutralPrimary }]}>
          <EtText variant="heading-compact" style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>
            Simple Stock Ticker
          </EtText>
          <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral, marginBottom: 8 }}>
            Basic usage with default settings - just pass ticker data
          </EtText>
          <View style={styles.tickerContainer}>
            <EtTickerStory tickersData={stockTickerData} />
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.bgNeutralPrimary }]}>
          <EtText variant="heading-compact" style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>
            Code Example
          </EtText>
          <EtText
            variant="body-secondary-regular"
            style={{
              color: colors.textSecondaryNeutral,
              backgroundColor: colors.bgNeutralSecondary,
              fontFamily: 'monospace',
              padding: 12,
              borderRadius: 8,
              marginBottom: 8,
            }}
          >
            {`import { EtTicker } from 'etoro-ui/components/data-display/ticker';

const tickerData = [
  { instrumentId: 1, name: 'AAPL', currentPrice: 186.79, dailyChange: 2.1, navigationUrl: '/instruments/1' },
  { instrumentId: 2, name: 'TSLA', currentPrice: 245.67, dailyChange: -1.2, navigationUrl: '/instruments/2' },
  { instrumentId: 3, name: 'GOOGL', currentPrice: 2820.45, dailyChange: 0.8, navigationUrl: '/instruments/3' },
];

<EtTicker tickersData={tickerData} />`}
          </EtText>
        </View>
      </View>
    );
  },
  args: {},
};

// Animation Speed Comparison
export const AnimationSpeeds: Story = {
  render: () => {
    const { colors } = useEtoroTheme();

    return (
      <View style={styles.showcase}>
        <EtText variant="heading-compact" style={[styles.title, { color: colors.textPrimaryNeutral }]}>
          Animation Speed Comparison
        </EtText>

        <View style={[styles.section, { backgroundColor: colors.bgNeutralPrimary }]}>
          <EtText variant="heading-compact" style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>
            Fast (Speed 1.2) - Breaking News Speed
          </EtText>
          <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral, marginBottom: 8 }}>
            Quick updates for urgent market alerts
          </EtText>
          <View style={styles.tickerContainer}>
            <EtTickerStory
              tickersData={stockTickerData}
              speed={1.2}
              accessibility={{
                accessibilityLabel: 'Fast breaking news ticker',
                accessibilityHint: 'Rapidly scrolling stock prices for urgent updates',
                testID: 'fast-ticker',
              }}
            />
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.bgNeutralPrimary }]}>
          <EtText variant="heading-compact" style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>
            Standard (Speed 0.5) - Default Speed
          </EtText>
          <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral, marginBottom: 8 }}>
            Balanced speed for general market data
          </EtText>
          <View style={styles.tickerContainer}>
            <EtTickerStory
              tickersData={stockTickerData}
              speed={0.5}
              accessibility={{
                accessibilityLabel: 'Standard market data ticker',
                accessibilityHint: 'Balanced scrolling speed for general market information',
                testID: 'standard-ticker',
              }}
            />
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.bgNeutralPrimary }]}>
          <EtText variant="heading-compact" style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>
            Slow (Speed 0.3) - Easy Reading
          </EtText>
          <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral, marginBottom: 8 }}>
            Slow pace for detailed information review
          </EtText>
          <View style={styles.tickerContainer}>
            <EtTickerStory
              tickersData={stockTickerData}
              speed={0.3}
              accessibility={{
                accessibilityLabel: 'Slow detailed ticker for easy reading',
                accessibilityHint: 'Slowly scrolling stock prices for detailed review',
                testID: 'slow-ticker',
              }}
            />
          </View>
        </View>
      </View>
    );
  },
  args: {},
};

// Different Asset Types
export const AssetTypes: Story = {
  render: () => {
    const { colors } = useEtoroTheme();

    return (
      <View style={styles.showcase}>
        <EtText variant="heading-compact" style={[styles.title, { color: colors.textPrimaryNeutral }]}>
          Different Asset Types
        </EtText>

        <View style={[styles.section, { backgroundColor: colors.bgNeutralPrimary }]}>
          <EtText variant="heading-compact" style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>
            Stock Market
          </EtText>
          <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral, marginBottom: 8 }}>
            Traditional stocks with dollar prices
          </EtText>
          <View style={styles.tickerContainer}>
            <EtTickerStory tickersData={stockTickerData} speed={0.6} />
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.bgNeutralPrimary }]}>
          <EtText variant="heading-compact" style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>
            Cryptocurrency
          </EtText>
          <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral, marginBottom: 8 }}>
            Digital assets with varied price ranges
          </EtText>
          <View style={styles.tickerContainer}>
            <EtTickerStory tickersData={cryptoTickerData} speed={0.6} />
          </View>
        </View>
      </View>
    );
  },
  args: {},
};

// Content Volume Scenarios
export const ContentVolume: Story = {
  render: () => {
    const { colors } = useEtoroTheme();

    return (
      <View style={styles.showcase}>
        <EtText variant="heading-compact" style={[styles.title, { color: colors.textPrimaryNeutral }]}>
          Content Volume Scenarios
        </EtText>

        <View style={[styles.section, { backgroundColor: colors.bgNeutralPrimary }]}>
          <EtText variant="heading-compact" style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>
            Single Item
          </EtText>
          <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral, marginBottom: 8 }}>
            How ticker behaves with minimal content
          </EtText>
          <View style={styles.tickerContainer}>
            <EtTickerStory tickersData={singleItemData} speed={0.7} />
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.bgNeutralPrimary }]}>
          <EtText variant="heading-compact" style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>
            Many Items (10 stocks)
          </EtText>
          <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral, marginBottom: 8 }}>
            Performance with extensive content
          </EtText>
          <View style={styles.tickerContainer}>
            <EtTickerStory tickersData={manyItemsData} speed={0.7} />
          </View>
        </View>
      </View>
    );
  },
  args: {},
};

// Market Sentiment Display
export const MarketSentiment: Story = {
  render: () => {
    const { colors } = useEtoroTheme();

    const bullishData: TickerItem[] = [
      {
        instrumentId: 100,
        name: 'TECH',
        currentPrice: 156.79,
        dailyChange: 8.2,
        navigationUrl: '/instruments/100',
      },
      {
        instrumentId: 101,
        name: 'GROWTH',
        currentPrice: 245.67,
        dailyChange: 12.1,
        navigationUrl: '/instruments/101',
      },
      {
        instrumentId: 102,
        name: 'MOMENTUM',
        currentPrice: 820.45,
        dailyChange: 15.8,
        navigationUrl: '/instruments/102',
      },
      {
        instrumentId: 103,
        name: 'INNOVATION',
        currentPrice: 415.26,
        dailyChange: 6.5,
        navigationUrl: '/instruments/103',
      },
    ];

    const bearishData: TickerItem[] = [
      {
        instrumentId: 200,
        name: 'VALUE',
        currentPrice: 86.79,
        dailyChange: -8.2,
        navigationUrl: '/instruments/200',
      },
      {
        instrumentId: 201,
        name: 'UTILITIES',
        currentPrice: 45.67,
        dailyChange: -12.1,
        navigationUrl: '/instruments/201',
      },
      {
        instrumentId: 202,
        name: 'ENERGY',
        currentPrice: 120.45,
        dailyChange: -15.8,
        navigationUrl: '/instruments/202',
      },
      {
        instrumentId: 203,
        name: 'MATERIALS',
        currentPrice: 215.26,
        dailyChange: -6.5,
        navigationUrl: '/instruments/203',
      },
    ];

    return (
      <View style={styles.showcase}>
        <EtText variant="heading-compact" style={[styles.title, { color: colors.textPrimaryNeutral }]}>
          Market Sentiment Scenarios
        </EtText>

        <View style={[styles.section, { backgroundColor: colors.bgNeutralPrimary }]}>
          <EtText variant="heading-compact" style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>
            Bullish Market - All Green
          </EtText>
          <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral, marginBottom: 8 }}>
            Strong positive sentiment with all upward movements
          </EtText>
          <View style={styles.tickerContainer}>
            <EtTickerStory tickersData={bullishData} speed={0.6} />
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.bgNeutralPrimary }]}>
          <EtText variant="heading-compact" style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>
            Bearish Market - All Red
          </EtText>
          <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral, marginBottom: 8 }}>
            Market decline with all downward movements
          </EtText>
          <View style={styles.tickerContainer}>
            <EtTickerStory tickersData={bearishData} speed={0.6} />
          </View>
        </View>
      </View>
    );
  },
  args: {},
};

export const AccessibilityFeatures: Story = {
  render: () => {
    const { colors } = useEtoroTheme();

    return (
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.showcase} showsVerticalScrollIndicator={false}>
        <EtText variant="heading-compact" style={[styles.title, { color: colors.textPrimaryNeutral }]}>
          Accessibility Features
        </EtText>

        <View style={[styles.section, { backgroundColor: colors.bgNeutralPrimary }]}>
          <EtText variant="heading-compact" style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>
            Default Accessibility (Smart Labels)
          </EtText>
          <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral, marginBottom: 8 }}>
            Automatically generates descriptive labels based on content
          </EtText>
          <View style={styles.tickerContainer}>
            <EtTickerStory tickersData={stockTickerData} speed={0.5} />
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.bgNeutralPrimary }]}>
          <EtText variant="heading-compact" style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>
            Custom Accessibility Labels
          </EtText>
          <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral, marginBottom: 8 }}>
            Custom labels and hints for specific use cases
          </EtText>
          <View style={styles.tickerContainer}>
            <EtTickerStory
              tickersData={cryptoTickerData}
              speed={0.7}
              accessibility={{
                accessibilityLabel: 'Live cryptocurrency prices and 24-hour changes',
                accessibilityHint: 'Swipe left or right to pause and resume scrolling',
                testID: 'crypto-ticker-demo',
              }}
            />
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.bgNeutralPrimary }]}>
          <EtText variant="heading-compact" style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>
            Screen Reader Optimized
          </EtText>
          <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral, marginBottom: 8 }}>
            Each ticker item has descriptive labels: "AAPL stock at $186.79, up 2.10 percent"
          </EtText>
          <View style={styles.tickerContainer}>
            <EtTickerStory
              tickersData={singleItemData}
              speed={0.4}
              accessibility={{
                accessibilityLabel: 'Single stock focus ticker for detailed analysis',
                accessibilityHint: 'Displays one stock with clear price and change information',
                testID: 'single-stock-ticker',
              }}
            />
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.bgNeutralPrimary }]}>
          <EtText variant="heading-compact" style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>
            Testing & Automation Support
          </EtText>
          <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral, marginBottom: 8 }}>
            testID props for automated testing and quality assurance
          </EtText>
          <View style={styles.tickerContainer}>
            <EtTickerStory
              tickersData={manyItemsData}
              speed={0.8}
              accessibility={{
                accessibilityLabel: 'Comprehensive market overview ticker',
                accessibilityHint: 'Multiple stocks with prices and performance data',
                testID: 'comprehensive-market-ticker',
              }}
            />
          </View>
        </View>
      </ScrollView>
    );
  },
  args: {},
};

// Multi-Currency and Precision
export const MultiCurrency: Story = {
  render: () => {
    const { colors } = useEtoroTheme();

    return (
      <ScrollView style={styles.showcase}>
        <EtText variant="heading-compact" style={[styles.title, { color: colors.textPrimaryNeutral }]}>
          Multi-Currency & Precision Control
        </EtText>

        <View style={[styles.section, { backgroundColor: colors.bgNeutralPrimary }]}>
          <EtText variant="heading-compact" style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>
            Different Currencies & Precision
          </EtText>
          <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral, marginBottom: 8 }}>
            Forex (4 decimals, no symbol), Commodities ($, 2 decimals), European indices (€, £)
          </EtText>
          <View style={styles.tickerContainer}>
            <EtTickerStory tickersData={multiCurrencyData} speed={0.4} />
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.bgNeutralPrimary }]}>
          <EtText variant="heading-compact" style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>
            Crypto with Custom Precision
          </EtText>
          <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral, marginBottom: 8 }}>
            ADA shows 3 decimals instead of default 4
          </EtText>
          <View style={styles.tickerContainer}>
            <EtTickerStory tickersData={cryptoTickerData} speed={0.5} />
          </View>
        </View>
      </ScrollView>
    );
  },
  args: {},
};

// Gradient Options
export const WithoutGradient: Story = {
  render: () => {
    const { colors } = useEtoroTheme();

    return (
      <View style={styles.showcase}>
        <EtText variant="heading-compact" style={[styles.title, { color: colors.textPrimaryNeutral }]}>
          Gradient Comparison
        </EtText>

        <View style={[styles.section, { backgroundColor: colors.bgNeutralPrimary }]}>
          <EtText variant="heading-compact" style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>
            With Gradient (Default)
          </EtText>
          <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral, marginBottom: 8 }}>
            Smooth fade effect at edges for better visual flow
          </EtText>
          <View style={styles.tickerContainer}>
            <EtTickerStory tickersData={stockTickerData} gradient={true} />
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.bgNeutralPrimary }]}>
          <EtText variant="heading-compact" style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>
            Without Gradient
          </EtText>
          <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral, marginBottom: 8 }}>
            Hard edges with no fade effect
          </EtText>
          <View style={styles.tickerContainer}>
            <EtTickerStory tickersData={stockTickerData} gradient={false} />
          </View>
        </View>
      </View>
    );
  },
  args: {},
};

const styles = StyleSheet.create({
  decorator: {
    flex: 1,
    padding: 16,
  },
  scrollContainer: {
    flex: 1,
  },
  showcase: {
    width: '100%',
    maxWidth: 600,
    paddingBottom: 20, // Add bottom padding for better scrolling experience
  },
  title: {
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  tickerContainer: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    padding: 12,
    overflow: 'hidden',
  },
});
