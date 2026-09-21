import type { Meta, StoryObj } from '@storybook/react-native';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { EtLegacyAssetCard, EtText } from 'etoro-ui';

// Mock asset data
const mockApple = {
  symbol: 'AAPL',
  name: 'Apple Inc',
  currentPrice: 186.79,
  currency: '$',
  logo: require('./Aapl.png'),
  exchange: 'NASDAQ',
};

const mockTesla = {
  symbol: 'TSLA',
  name: 'Tesla Inc',
  currentPrice: 194.86,
  currency: '$',
  logo: require('./Tsla.png'),
  exchange: 'NASDAQ',
};

const mockBitcoin = {
  symbol: 'BTC',
  name: 'Bitcoin',
  currentPrice: 42580.5,
  currency: '$',
  logo: require('./BTC.png'),
  exchange: 'Crypto',
};

const mockDescription = 'The most copied Popular Investor on eToro. Full-time professional investor. Former Strategy Consultant.';
const mockLastUpdated = 'Mon, 06 May 2024 15:33:04';

// Mock categories for sectors/tags
const mockCategories = [
  { label: 'Technology', color: '#10B981', backgroundColor: '#ECFDF5' },
  { label: 'Large Cap', color: '#3B82F6', backgroundColor: '#EFF6FF' },
  { label: 'Popular', color: '#F59E0B', backgroundColor: '#FFFBEB' },
];

// Wrapper for interactive stories
const EtLegacyAssetCardWrapper = (props: any) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isAdded, setIsAdded] = useState<boolean>(props.isAdded ?? false);

  if (!isVisible) {
    return (
      <View style={styles.hiddenCard}>
        <EtText variant="body-secondary-regular">Card closed - tap to show again</EtText>
        <Pressable style={styles.showButton} onPress={() => setIsVisible(true)}>
          <EtText variant="body-base-regular">Show Card</EtText>
        </Pressable>
      </View>
    );
  }

  return (
    <EtLegacyAssetCard
      asset={props.asset ?? mockApple}
      display={{
        description: mockDescription,
        lastUpdated: mockLastUpdated,
        minimal: props.minimal,
        categories: props.showCategories ? mockCategories : undefined,
        compact: props.compact,
      }}
      priceMetrics={
        props.showPriceMetrics
          ? {
              changeAmount: props.changeAmount,
              changePercentage: props.changePercentage,
              isPositive: props.changeAmount >= 0,
              onTrade: () => console.log('Trade pressed'),
            }
          : undefined
      }
      marketMetrics={
        props.showMarketMetrics
          ? {
              marketCap: props.marketCap,
              volume: props.volume,
              peRatio: props.peRatio,
            }
          : undefined
      }
      chart={{
        compactStats: props.compactStats,
      }}
      interaction={{
        haptics: props.haptics,
        showCloseButton: props.showCloseButton,
        onClose: () => setIsVisible(false),
        showTradeButton: props.showTradeButton,
        tradeButtonText: props.tradeButtonText,
        showAddButton: props.showAddButton,
        isAdded,
        onAdd: () => {
          setIsAdded((prev) => !prev);
        },
      }}
      style={{
        style: props.style,
      }}
      accessibility={{
        testID: props.testID,
        accessibilityLabel: props.accessibilityLabel,
      }}
    />
  );
};

const meta = {
  title: 'eToro-UI/Components/DataDisplay/EtLegacyAssetCard',
  component: EtLegacyAssetCardWrapper,
  argTypes: {
    showCloseButton: {
      control: { type: 'boolean' },
      description: 'Show close button in header',
    },
    showTradeButton: {
      control: { type: 'boolean' },
      description: 'Show trade button in header',
    },
    tradeButtonText: {
      control: { type: 'text' },
      description: 'Custom trade button text',
      if: { arg: 'showTradeButton', eq: true },
    },
    haptics: {
      control: { type: 'boolean' },
      description: 'Enable haptic feedback',
    },
    // Asset Selection
    selectedAsset: {
      options: ['AAPL', 'TSLA', 'BTC'],
      control: { type: 'select' },
      description: 'Select asset to display',
    },
    // Categories
    showCategories: {
      control: { type: 'boolean' },
      description: 'Show category badges',
    },
    // Price Metrics
    showPriceMetrics: {
      control: { type: 'boolean' },
      description: 'Show price change metrics',
    },
    changeAmount: {
      control: { type: 'number', min: -50, max: 50, step: 0.01 },
      description: 'Price change amount',
      if: { arg: 'showPriceMetrics', eq: true },
    },
    changePercentage: {
      control: { type: 'number', min: -50, max: 50, step: 0.01 },
      description: 'Price change percentage',
      if: { arg: 'showPriceMetrics', eq: true },
    },
    // Market Metrics
    showMarketMetrics: {
      control: { type: 'boolean' },
      description: 'Show market metrics',
    },
    marketCap: {
      control: { type: 'text' },
      description: 'Market capitalization',
      if: { arg: 'showMarketMetrics', eq: true },
    },
    volume: {
      control: { type: 'text' },
      description: '24h trading volume',
      if: { arg: 'showMarketMetrics', eq: true },
    },
    peRatio: {
      control: { type: 'number', min: 0, max: 100, step: 0.1 },
      description: 'Price to earnings ratio',
      if: { arg: 'showMarketMetrics', eq: true },
    },
    // Compact mode
    compact: {
      control: { type: 'boolean' },
      description: 'Enable compact chart mode',
    },
    showAddButton: {
      control: { type: 'boolean' },
      description: 'Show add button in compact mode',
      if: { arg: 'compact', eq: true },
    },
    isAdded: {
      control: { type: 'boolean' },
      description: 'Whether item is added',
      if: { arg: 'showAddButton', eq: true },
    },
    compactChangePercentage: {
      control: { type: 'number', min: -50, max: 50, step: 0.1 },
      description: 'Change percentage for compact mode',
      if: { arg: 'compact', eq: true },
    },
    compactChangePeriod: {
      options: ['1D', '1W', '1M', '1Y'],
      control: { type: 'select' },
      description: 'Change period for compact mode',
      if: { arg: 'compact', eq: true },
    },
    compactMarketCap: {
      control: { type: 'text' },
      description: 'Market cap for compact mode',
      if: { arg: 'compact', eq: true },
    },
    compactVolume: {
      control: { type: 'text' },
      description: 'Volume for compact mode',
      if: { arg: 'compact', eq: true },
    },
  },
  args: {
    showCloseButton: false,
    showTradeButton: false,
    tradeButtonText: 'Trade',
    haptics: true,
    selectedAsset: 'AAPL',
    showCategories: false,
    showPriceMetrics: false,
    changeAmount: 1.95,
    changePercentage: 1.05,
    showMarketMetrics: false,
    marketCap: '$2.87T',
    volume: '$52.1B',
    peRatio: 28.4,
    // Compact mode defaults
    compact: false,
    showAddButton: false,
    isAdded: false,
    compactChangePercentage: 1.95,
    compactChangePeriod: '1D',
    compactMarketCap: '$2.87T',
    compactVolume: '$52.1B',
  },
  decorators: [
    (Story) => (
      <View style={styles.container}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof EtLegacyAssetCardWrapper>;

export default meta;

type Story = StoryObj<typeof meta>;

// Transform args for component
const transformArgs = (args: any) => {
  const assets = {
    AAPL: mockApple,
    TSLA: mockTesla,
    BTC: mockBitcoin,
  };

  const result: any = {
    ...args,
    asset: assets[args.selectedAsset as keyof typeof assets],
  };

  if (args.compact) {
    result.compactStats = {
      changePercentage: args.compactChangePercentage,
      changePeriod: args.compactChangePeriod,
      marketCap: args.compactMarketCap,
      volume: args.compactVolume,
    };
  }

  return result;
};

// Interactive story with full controls
export const Interactive: Story = {
  render: (args) => <EtLegacyAssetCardWrapper {...transformArgs(args)} />,
};

// Basic asset cards
export const BasicAssetCard: Story = {
  args: {
    showCategories: false,
    showPriceMetrics: false,
    showMarketMetrics: false,
  },
  render: (args) => <EtLegacyAssetCardWrapper {...transformArgs(args)} />,
};

export const AssetCardWithCategories: Story = {
  args: {
    showCategories: true,
    showPriceMetrics: false,
    showMarketMetrics: false,
  },
  render: (args) => <EtLegacyAssetCardWrapper {...transformArgs(args)} />,
};

// Trading cards with price metrics
export const TradingCard: Story = {
  args: {
    showCategories: false,
    showPriceMetrics: true,
    showMarketMetrics: false,
    changeAmount: 1.95,
    changePercentage: 1.05,
  },
  render: (args) => <EtLegacyAssetCardWrapper {...transformArgs(args)} />,
};

export const TradingCardWithCategories: Story = {
  args: {
    showCategories: true,
    showPriceMetrics: true,
    showMarketMetrics: false,
    changeAmount: 1.95,
    changePercentage: 1.05,
  },
  render: (args) => <EtLegacyAssetCardWrapper {...transformArgs(args)} />,
};

// Market analysis cards
export const MarketAnalysisCard: Story = {
  args: {
    showCategories: false,
    showPriceMetrics: false,
    showMarketMetrics: true,
    marketCap: '$2.87T',
    volume: '$52.1B',
    peRatio: 28.4,
  },
  render: (args) => <EtLegacyAssetCardWrapper {...transformArgs(args)} />,
};

export const MarketAnalysisCardWithCategories: Story = {
  args: {
    showCategories: true,
    showPriceMetrics: false,
    showMarketMetrics: true,
    marketCap: '$2.87T',
    volume: '$52.1B',
    peRatio: 28.4,
  },
  render: (args) => <EtLegacyAssetCardWrapper {...transformArgs(args)} />,
};

// Full featured cards
export const FullFeaturedAssetCard: Story = {
  args: {
    showCategories: true,
    showPriceMetrics: true,
    showMarketMetrics: true,
    changeAmount: 1.95,
    changePercentage: 1.05,
    marketCap: '$2.87T',
    volume: '$52.1B',
    peRatio: 28.4,
  },
  render: (args) => <EtLegacyAssetCardWrapper {...transformArgs(args)} />,
};

// Trade button examples
export const WithTradeButton: Story = {
  args: {
    showTradeButton: true,
    showCategories: false,
    showPriceMetrics: true,
    showMarketMetrics: false,
    changeAmount: 1.95,
    changePercentage: 1.05,
  },
  render: (args) => <EtLegacyAssetCardWrapper {...transformArgs(args)} />,
};

// Compact chart card examples
export const CompactPositiveChart: Story = {
  args: {
    compact: true,
    showCloseButton: false,
    showCategories: false,
    compactChangePercentage: 1.95,
    compactChangePeriod: '1D',
    compactMarketCap: '$2.87T',
  },
  render: (args) => <EtLegacyAssetCardWrapper {...transformArgs(args)} />,
};

export const CompactNegativeChart: Story = {
  args: {
    compact: true,
    showCloseButton: true,
    showCategories: false,
    selectedAsset: 'TSLA',
    compactChangePercentage: -2.95,
    compactChangePeriod: '1D',
    compactVolume: '$28.1B',
  },
  render: (args) => <EtLegacyAssetCardWrapper {...transformArgs(args)} />,
};

export const CompactWithAddButton: Story = {
  args: {
    compact: true,
    showAddButton: true,
    isAdded: false,
    showCategories: false,
    compactChangePercentage: 1.95,
    compactChangePeriod: '1D',
    compactMarketCap: '$2.87T',
  },
  render: (args) => <EtLegacyAssetCardWrapper {...transformArgs(args)} />,
};

// Showcase all variations
export const AllVariations: Story = {
  render: () => (
    <ScrollView contentContainerStyle={styles.showcase}>
      <EtText variant="heading-base" style={styles.title}>
        Asset Card Variations
      </EtText>

      <EtText variant="heading-compact" style={styles.sectionTitle}>
        Basic Cards
      </EtText>
      <EtLegacyAssetCard
        asset={mockApple}
        display={{
          description: mockDescription,
          lastUpdated: mockLastUpdated,
        }}
        interaction={{
          showCloseButton: false,
        }}
        style={{
          style: styles.showcaseCard,
        }}
      />

      <EtLegacyAssetCard
        asset={mockApple}
        display={{
          description: mockDescription,
          lastUpdated: mockLastUpdated,
          categories: mockCategories,
        }}
        interaction={{
          showCloseButton: false,
        }}
        style={{
          style: styles.showcaseCard,
        }}
      />

      <EtText variant="heading-compact" style={styles.sectionTitle}>
        Trading Cards
      </EtText>
      <EtLegacyAssetCard
        asset={mockApple}
        display={{
          description: mockDescription,
          lastUpdated: mockLastUpdated,
        }}
        priceMetrics={{
          changeAmount: 1.95,
          changePercentage: 1.05,
          isPositive: true,
          onTrade: () => console.log('Trade'),
        }}
        interaction={{
          showCloseButton: false,
        }}
        style={{
          style: styles.showcaseCard,
        }}
      />

      <EtLegacyAssetCard
        asset={mockTesla}
        display={{
          description: 'Electric vehicle and clean energy company leading innovation in sustainable transportation.',
          lastUpdated: mockLastUpdated,
          categories: [
            {
              label: 'Technology',
              color: '#10B981',
              backgroundColor: '#ECFDF5',
            },
            { label: 'EV', color: '#8B5CF6', backgroundColor: '#F3E8FF' },
          ],
        }}
        priceMetrics={{
          changeAmount: -4.32,
          changePercentage: -2.17,
          isPositive: false,
          onTrade: () => console.log('Trade TSLA'),
        }}
        interaction={{
          showCloseButton: false,
        }}
        style={{
          style: styles.showcaseCard,
        }}
      />

      <EtText variant="heading-compact" style={styles.sectionTitle}>
        Market Analysis Cards
      </EtText>
      <EtLegacyAssetCard
        asset={mockBitcoin}
        display={{
          description: "The world's largest cryptocurrency by market capitalization.",
          lastUpdated: mockLastUpdated,
          categories: [{ label: 'Crypto', color: '#F59E0B', backgroundColor: '#FFFBEB' }],
        }}
        marketMetrics={{
          marketCap: '$831B',
          volume: '$18.2B',
        }}
        interaction={{
          showCloseButton: false,
        }}
        style={{
          style: styles.showcaseCard,
        }}
      />

      <EtLegacyAssetCard
        asset={mockApple}
        display={{
          description: 'Full market analysis with comprehensive metrics.',
          lastUpdated: mockLastUpdated,
          categories: mockCategories,
        }}
        marketMetrics={{
          marketCap: '$2.87T',
          volume: '$52.1B',
          peRatio: 28.4,
        }}
        priceMetrics={{
          changeAmount: 1.95,
          changePercentage: 1.05,
          isPositive: true,
        }}
        interaction={{
          showCloseButton: false,
        }}
        style={{
          style: styles.showcaseCard,
        }}
      />

      <EtText variant="heading-compact" style={styles.sectionTitle}>
        Trade Button Cards
      </EtText>
      <EtLegacyAssetCard
        asset={mockApple}
        display={{
          description: mockDescription,
          lastUpdated: mockLastUpdated,
        }}
        interaction={{
          showTradeButton: true,
        }}
        priceMetrics={{
          changeAmount: 1.95,
          changePercentage: 1.05,
          isPositive: true,
        }}
        style={{
          style: styles.showcaseCard,
        }}
      />

      <EtLegacyAssetCard
        asset={mockTesla}
        display={{
          description: 'Electric vehicle company with trading integration.',
          lastUpdated: mockLastUpdated,
          categories: [
            {
              label: 'Technology',
              color: '#10B981',
              backgroundColor: '#ECFDF5',
            },
            { label: 'EV', color: '#8B5CF6', backgroundColor: '#F3E8FF' },
          ],
        }}
        interaction={{
          showTradeButton: true,
        }}
        marketMetrics={{
          marketCap: '$615B',
          volume: '$28.1B',
        }}
        style={{
          style: styles.showcaseCard,
        }}
      />

      <EtText variant="heading-compact" style={styles.sectionTitle}>
        Compact Chart Cards
      </EtText>
      <View style={styles.compactColumn}>
        <EtLegacyAssetCard
          asset={mockApple}
          display={{
            compact: true,
          }}
          chart={{
            compactStats: {
              changePercentage: 1.95,
              changePeriod: '1D',
              marketCap: '$2.87T',
            },
          }}
          style={{
            style: styles.showcaseCard,
          }}
        />

        <EtLegacyAssetCard
          asset={mockTesla}
          display={{
            compact: true,
          }}
          chart={{
            compactStats: {
              changePercentage: -2.95,
              changePeriod: '1D',
              volume: '$28.1B',
            },
          }}
          style={{
            style: styles.showcaseCard,
          }}
          interaction={{
            showCloseButton: true,
          }}
        />
      </View>

      <View style={styles.compactColumn}>
        <EtLegacyAssetCard
          asset={mockBitcoin}
          display={{
            compact: true,
          }}
          chart={{
            compactStats: {
              changePercentage: 4.12,
              changePeriod: '24H',
              volume: '$18.2B',
            },
          }}
          style={{
            style: styles.showcaseCard,
          }}
          interaction={{
            showAddButton: true,
          }}
        />

        <EtLegacyAssetCard
          asset={mockApple}
          display={{
            minimal: true,
          }}
          interaction={{
            showAddButton: true,
          }}
          style={{
            style: styles.showcaseCard,
          }}
        />
      </View>
    </ScrollView>
  ),
  args: {},
};

// Different assets showcase
export const DifferentAssets: Story = {
  render: () => (
    <ScrollView contentContainerStyle={styles.showcase}>
      <EtText variant="heading-base" style={styles.title}>
        Asset Card Variations
      </EtText>

      <EtText variant="heading-compact" style={styles.sectionTitle}>
        Different Assets
      </EtText>

      <EtLegacyAssetCard
        asset={mockApple}
        display={{
          description: mockDescription,
          lastUpdated: mockLastUpdated,
        }}
        priceMetrics={{
          changeAmount: 1.95,
          changePercentage: 1.05,
          isPositive: true,
          onTrade: () => console.log('Trade AAPL'),
        }}
        style={{
          style: styles.showcaseCard,
        }}
      />

      <EtLegacyAssetCard
        asset={mockTesla}
        display={{
          description: 'Electric vehicle and clean energy company leading innovation in sustainable transportation.',
          lastUpdated: mockLastUpdated,
        }}
        priceMetrics={{
          changeAmount: -4.32,
          changePercentage: -2.17,
          isPositive: false,
          onTrade: () => console.log('Trade TSLA'),
        }}
        style={{
          style: styles.showcaseCard,
        }}
      />

      <EtLegacyAssetCard
        asset={mockBitcoin}
        display={{
          description: "The world's largest cryptocurrency by market capitalization. Digital store of value and medium of exchange.",
          lastUpdated: mockLastUpdated,
        }}
        marketMetrics={{
          marketCap: '$831B',
          volume: '$18.2B',
        }}
        style={{
          style: styles.showcaseCard,
        }}
      />

      <EtText variant="heading-compact" style={styles.sectionTitle}>
        Compact Chart Cards
      </EtText>

      <View style={styles.compactColumn}>
        <EtLegacyAssetCard
          asset={mockApple}
          display={{
            compact: true,
          }}
          chart={{
            compactStats: {
              changePercentage: 1.95,
              changePeriod: '1D',
              marketCap: '$2.87T',
            },
          }}
          style={{
            style: styles.showcaseCard,
          }}
        />

        <EtLegacyAssetCard
          asset={mockTesla}
          display={{
            compact: true,
          }}
          interaction={{
            showCloseButton: true,
          }}
          chart={{
            compactStats: {
              changePercentage: -2.95,
              changePeriod: '1D',
              volume: '$28.1B',
            },
          }}
          style={{
            style: styles.showcaseCard,
          }}
        />
      </View>

      <View style={styles.compactColumn}>
        <EtLegacyAssetCard
          asset={mockBitcoin}
          display={{
            compact: true,
          }}
          interaction={{
            showAddButton: true,
          }}
          chart={{
            compactStats: {
              changePercentage: 4.12,
              changePeriod: '24H',
              volume: '$18.2B',
            },
          }}
          style={{
            style: styles.showcaseCard,
          }}
        />

        <EtLegacyAssetCard
          asset={mockApple}
          display={{
            minimal: true,
          }}
          interaction={{
            showAddButton: true,
          }}
          style={{
            style: styles.showcaseCard,
          }}
        />
      </View>
    </ScrollView>
  ),
  args: {},
};

// Edge cases and states
export const NegativePerformance: Story = {
  render: () => (
    <EtLegacyAssetCard
      asset={mockTesla}
      display={{
        description: 'Electric vehicle and clean energy company experiencing market volatility.',
        lastUpdated: mockLastUpdated,
      }}
      priceMetrics={{
        changeAmount: -8.45,
        changePercentage: -4.15,
        isPositive: false,
        onTrade: () => console.log('Trade'),
      }}
      style={{
        style: styles.showcaseCard,
      }}
    />
  ),
  args: {},
};

export const HighVolatilityCrypto: Story = {
  render: () => (
    <EtLegacyAssetCard
      asset={{
        symbol: 'ETH',
        name: 'Ethereum',
        currentPrice: 2485.67,
        currency: '$',
        logo: require('./eth.png'),
        exchange: 'Crypto',
      }}
      display={{
        description: 'Decentralized platform for smart contracts and decentralized applications (dApps).',
        lastUpdated: mockLastUpdated,
        categories: [
          { label: 'Crypto', color: '#F59E0B', backgroundColor: '#FFFBEB' },
          { label: 'DeFi', color: '#8B5CF6', backgroundColor: '#F3E8FF' },
          {
            label: 'Smart Contracts',
            color: '#10B981',
            backgroundColor: '#ECFDF5',
          },
        ],
      }}
      priceMetrics={{
        changeAmount: 128.45,
        changePercentage: 5.47,
        isPositive: true,
        onTrade: () => console.log('Trade ETH'),
      }}
      marketMetrics={{
        marketCap: '$299B',
        volume: '$12.4B',
      }}
      style={{
        style: styles.showcaseCard,
      }}
    />
  ),
  args: {},
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  hiddenCard: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  showButton: {
    marginTop: 8,
    padding: 8,
  },
  showcase: {
    padding: 16,
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    marginTop: 24,
    marginBottom: 12,
  },
  showcaseCard: {
    marginBottom: 16,
    alignSelf: 'center',
  },
  compactColumn: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
});
