import type { Meta, StoryObj } from '@storybook/react-native';
import * as Clipboard from 'expo-clipboard';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { EtLegacyAssetCard, EtText, generateMockChartData } from 'etoro-ui';
import { useEtoroTheme } from 'etoro-ui/core';

type Story = StoryObj<{}>;

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

const mockDescription = 'Technology company focusing on consumer electronics and software.';
const mockLastUpdated = 'Mon, 06 May 2024 15:33:04';

const mockCategories = [
  { label: 'Technology', color: '#10B981', backgroundColor: '#ECFDF5' },
  { label: 'Large Cap', color: '#3B82F6', backgroundColor: '#EFF6FF' },
  { label: 'Popular', color: '#F59E0B', backgroundColor: '#FFFBEB' },
];

const CodeBlock = ({ code, title }: { code: string; title?: string }) => {
  const { colors } = useEtoroTheme();

  const handleCopy = (code: string) => {
    Clipboard.setStringAsync(code);
    Alert.alert('Code Copied!', 'Code snippet copied to clipboard', [{ text: 'OK' }]);
  };

  return (
    <View
      style={[
        styles.codeContainer,
        {
          backgroundColor: colors.bgNeutralQuaternary,
          borderColor: colors.dividerPrimary,
        },
      ]}
    >
      {title && (
        <View style={styles.codeHeader}>
          <Text style={[styles.codeTitle, { color: colors.textPrimaryNeutral }]}>{title}</Text>
          <Pressable onPress={() => handleCopy(code)} style={styles.copyButton}>
            <Text style={[styles.copyButtonText, { color: colors.actionBrandText }]}>Copy</Text>
          </Pressable>
        </View>
      )}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Text style={[styles.codeText, { color: colors.textPrimaryNeutral }]}>{code}</Text>
      </ScrollView>
    </View>
  );
};

const meta: Meta<{}> = {
  title: 'eToro-UI/Components/DataDisplay/EtLegacyAssetCard/📖 Introduction',
  parameters: {
    notes: 'Complete guide for the EtLegacyAssetCard component with live examples.',
  },
  decorators: [
    (Story) => (
      <View style={styles.decorator}>
        <Story />
      </View>
    ),
  ],
};

export default meta;

export const Introduction: Story = {
  render: () => {
    const [isAdded, setIsAdded] = useState(false);

    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <EtText variant="display-main" style={styles.title}>
            💰 EtLegacyAssetCard
          </EtText>
          <EtText variant="heading-compact" style={styles.subtitle}>
            Financial asset cards for stocks, crypto, and trading instruments
          </EtText>
        </View>

        <View style={styles.features}>
          <EtText variant="heading-base" style={styles.featuresTitle}>
            Features
          </EtText>
          <EtText variant="body-secondary-regular" style={styles.featureText}>
            • Asset-focused design with logo, symbol, and price
          </EtText>
          <EtText variant="body-secondary-regular" style={styles.featureText}>
            • Price change metrics with positive/negative indicators
          </EtText>
          <EtText variant="body-secondary-regular" style={styles.featureText}>
            • Market data integration (market cap, volume, P/E ratio)
          </EtText>
          <EtText variant="body-secondary-regular" style={styles.featureText}>
            • Compact chart mode with performance visualization
          </EtText>
          <EtText variant="body-secondary-regular" style={styles.featureText}>
            • Trading actions (Trade, Add to watchlist)
          </EtText>
        </View>

        <EtLegacyAssetCard
          asset={mockApple}
          display={{
            description: mockDescription,
            lastUpdated: mockLastUpdated,
          }}
          interaction={{
            showCloseButton: false,
            onPress: () => console.log('Asset pressed'),
          }}
        />
        <CodeBlock
          title="Basic Asset Card"
          code={`const asset = {
  symbol: 'AAPL',
  name: 'Apple Inc',
  currentPrice: 186.79,
  currency: '$',
  logo: require('./apple-logo.png'),
  exchange: 'NASDAQ',
};

<EtLegacyAssetCard
  asset={asset}
  display={{
    description: mockDescription,
    lastUpdated: mockLastUpdated,
  }}
  interaction={{
    showCloseButton: false,
    showTradeButton: true,
    tradeButtonText: "Trade",
  }}
/>`}
        ></CodeBlock>

        <EtLegacyAssetCard
          asset={mockApple}
          display={{
            description: mockDescription,
            lastUpdated: mockLastUpdated,
            categories: mockCategories,
          }}
          interaction={{
            showCloseButton: false,
            showTradeButton: true,
            tradeButtonText: 'Trade',
          }}
        />
        <CodeBlock
          title="Asset Card with Categories"
          code={`const categories = [
  { label: 'Technology', color: '#10B981', backgroundColor: '#ECFDF5' },
  { label: 'Large Cap', color: '#3B82F6', backgroundColor: '#EFF6FF' },
  { label: 'Popular', color: '#F59E0B', backgroundColor: '#FFFBEB' },
];

<EtLegacyAssetCard
  asset={asset}
  display={{
    description: "Technology company with strong fundamentals.",
    categories: mockCategories,
  }}
  interaction={{
    showCloseButton: false,
  }}
/>`}
        ></CodeBlock>

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
            showTradeButton: true,
            showCloseButton: false,
          }}
        />
        <CodeBlock
          title="Trading Card with Price Metrics"
          code={`const priceMetrics = {
  changeAmount: 1.95,
  changePercentage: 1.05,
  isPositive: true,
  onTrade: () => console.log('Starting trade...'),
};

<EtLegacyAssetCard
  asset={asset}
  display={{
    description: "Real-time trading card with price movements",
    lastUpdated: mockLastUpdated,
    categories: mockCategories,
  }}
  priceMetrics={{
    changeAmount: 1.95,
    changePercentage: 1.05,
    isPositive: true,
    onTrade: () => console.log('Starting trade...'),
  }}
  interaction={{
    showTradeButton: true,
    showCloseButton: false,
  }}
/>`}
        ></CodeBlock>

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
        />
        <CodeBlock
          title="Market Analysis Card"
          code={`const marketMetrics = {
  marketCap: '$2.87T',
  volume: '$52.1B',
  peRatio: 28.4,
};

<EtLegacyAssetCard
  asset={asset}
  display={{
    description: "Comprehensive market analysis with key metrics",
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
/>`}
        ></CodeBlock>

        <View style={styles.assetsDemo}>
          <EtLegacyAssetCard
            asset={mockApple}
            display={{
              description: 'Leading technology company',
              lastUpdated: mockLastUpdated,
              categories: mockCategories,
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
              style: styles.assetCard,
            }}
          />

          <EtLegacyAssetCard
            asset={mockBitcoin}
            display={{
              description: "World's largest cryptocurrency",
              lastUpdated: mockLastUpdated,
              categories: [
                {
                  label: 'Crypto',
                  color: '#F59E0B',
                  backgroundColor: '#FFFBEB',
                },
              ],
            }}
            marketMetrics={{
              marketCap: '$831B',
              volume: '$18.2B',
            }}
            interaction={{
              showCloseButton: false,
            }}
            style={{
              style: styles.assetCard,
            }}
          />

          <EtLegacyAssetCard
            asset={mockTesla}
            display={{
              description: 'Electric vehicle and clean energy',
              lastUpdated: mockLastUpdated,
              categories: [
                {
                  label: 'EV',
                  color: '#8B5CF6',
                  backgroundColor: '#F3E8FF',
                },
              ],
            }}
            priceMetrics={{
              changeAmount: -4.32,
              changePercentage: -2.17,
              isPositive: false,
            }}
            interaction={{
              showCloseButton: false,
            }}
            style={{
              style: styles.assetCard,
            }}
          />
        </View>
        <CodeBlock
          title="Different Asset Types"
          code={`// Stock Card
<EtLegacyAssetCard asset={appleAsset} priceMetrics={stockMetrics} />

// Crypto Card  
<EtLegacyAssetCard 
  asset={bitcoinAsset} 
  display={{    
    description: "World's largest cryptocurrency",
    lastUpdated: mockLastUpdated,
    categories: [{
      label: 'Crypto',
      color: '#F59E0B',
      backgroundColor: '#FFFBEB',
    }],
  }}
  marketMetrics={{
    marketCap: '$831B',
    volume: '$18.2B',
  }}
  priceMetrics={{
    changeAmount: -4.32,
    changePercentage: -2.17,
    isPositive: false,
  }}
  interaction={{
    showCloseButton: false,
  }}
/>

// Tesla with Categories
<EtLegacyAssetCard 
  asset={teslaAsset}
  display={{
    description: "Electric vehicle and clean energy",
    lastUpdated: mockLastUpdated,
    categories: [{
      label: 'EV',
      color: '#8B5CF6',
      backgroundColor: '#F3E8FF',
    }],
  }}
  priceMetrics={{
    changeAmount: -4.32,
    changePercentage: -2.17,
    isPositive: false,
  }}
  interaction={{
    showCloseButton: false,
  }}
/>`}
        ></CodeBlock>

        <View style={styles.compactDemo}>
          <EtLegacyAssetCard
            asset={mockApple}
            display={{ compact: true }}
            chart={{
              chartData: generateMockChartData(mockApple.currentPrice, true),
              compactStats: {
                changePercentage: 1.95,
                changePeriod: '1D',
              },
            }}
            interaction={{
              showAddButton: true,
              isAdded: isAdded,
              onAdd: () => setIsAdded(!isAdded),
            }}
            style={{
              style: styles.assetCard,
            }}
          />

          <EtLegacyAssetCard
            asset={mockBitcoin}
            display={{
              minimal: true,
            }}
            interaction={{
              showAddButton: true,
              showCloseButton: true,
              onClose: () => console.log('Close'),
              isAdded: isAdded,
              onAdd: () => setIsAdded(!isAdded),
            }}
            style={{
              style: styles.assetCard,
            }}
          />
        </View>
        <CodeBlock
          title="Compact Chart Cards"
          code={`const [isAdded, setIsAdded] = useState(false);

<EtLegacyAssetCard
  asset={asset}
  display={{
    compact: true,
  }}
  chart={{
    compactStats: {
      changePercentage: 1.95,
      changePeriod: "1D",
      marketCap: "$2.87T",
    },
  }}
  interaction={{
    showAddButton: true,
    isAdded: isAdded,
    onAdd: () => setIsAdded(!isAdded),
  }}
/>`}
        ></CodeBlock>

        <View style={styles.apiReference}>
          <EtText variant="heading-base" style={styles.apiTitle}>
            Quick API Reference
          </EtText>
          <CodeBlock
            title="EtAssetCardProps"
            code={`interface EtAssetCardProps {
  asset: AssetInfo;                 // Asset data (required)
  display?: {
    description?: string;             // Asset description
    lastUpdated?: string;             // Last update timestamp
    categories?: Category[];          // Sector/type badges
    compact?: boolean;                // Compact chart mode
  };
  priceMetrics?: {                  // Price change data
    changeAmount: number;
    changePercentage: number;
    isPositive: boolean;
    onTrade?: () => void;
  };
  marketMetrics?: {                 // Market data
    marketCap?: string;
    volume?: string;
    peRatio?: number;
  };
  interaction?: {
    haptics?: boolean;                // Haptic feedback
    onPress?: () => void;             // Press handler
    showTradeButton?: boolean;        // Show trade button
    showAddButton?: boolean;          // Show add button
    onTrade?: () => void;             // Trade handler
    onAdd?: () => void;               // Add handler
    showCloseButton?: boolean;        // Show close button
    onClose?: () => void;             // Close handler
    tradeButtonText?: string;         // Trade button text
    addButtonText?: string;           // Add button text
    addedButtonText?: string;         // Added button text
  };
  chart?: {
    compactStats?: {                  // Compact mode data
      changePercentage: number;
      changePeriod: string;
      marketCap?: string;
      volume?: string;
    };
  };
  style?: {
    style?: StyleProp<ViewStyle>;
  };
}`}
          ></CodeBlock>
        </View>
      </ScrollView>
    );
  },
  args: {},
};

const styles = StyleSheet.create({
  decorator: {
    flex: 1,
    padding: 16,
  },
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.8,
  },
  features: {
    marginBottom: 32,
  },
  featuresTitle: {
    marginBottom: 12,
  },
  featureText: {
    marginBottom: 4,
    opacity: 0.8,
  },
  exampleSection: {
    marginBottom: 32,
  },
  exampleTitle: {
    marginBottom: 16,
  },
  exampleDemo: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
    alignItems: 'center',
  },
  codeBlock: {
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
  },
  assetsDemo: {
    gap: 16,
    alignItems: 'center',
  },
  compactDemo: {
    gap: 16,
    alignItems: 'center',
  },
  assetCard: {
    alignSelf: 'center',
  },
  apiReference: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
  },
  apiTitle: {
    marginBottom: 16,
  },
  // Code Block Styles
  codeContainer: {
    marginVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  codeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  codeTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  copyButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  copyButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  codeText: {
    fontFamily: 'Courier',
    fontSize: 12,
    lineHeight: 18,
    padding: 12,
  },
});
