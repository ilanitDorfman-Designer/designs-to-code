import type { Meta, StoryObj } from '@storybook/react-native';
import * as Clipboard from 'expo-clipboard';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { EtButton, EtText } from 'etoro-ui';
import { BreakdownChartData, EtBreakdownChart } from 'etoro-ui/components/data-display/breakdown-chart';
import { useEtoroTheme } from 'etoro-ui/core';

type Story = StoryObj<{}>;

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

// Sample data sets
const portfolioData: BreakdownChartData[] = [
  { key: 'Stocks', value: 45, color: ['#4ADEF7', '#16C1DF'] },
  { key: 'Crypto', value: 25, color: ['#FFC180', '#FF9C33'] },
  { key: 'ETFs', value: 15, color: ['#C7B2FF', '#A280FF'] },
  { key: 'Commodities', value: 10, color: ['#8A9BE5', '#506AE5'] },
  { key: 'Currencies', value: 5, color: ['#FFB2E8', '#FF80D8'] },
];

const profitLossData: BreakdownChartData[] = [
  { key: 'Profit', value: 65, color: ['#90E589', '#33C728'] },
  { key: 'Loss', value: 35, color: ['#FF686A', '#FF686A'] },
];

const manyItemsData: BreakdownChartData[] = [
  { key: 'US Stocks', value: 25, color: ['#4ADEF7', '#16C1DF'] },
  { key: 'EU Stocks', value: 15, color: ['#90E589', '#33C728'] },
  { key: 'Crypto', value: 12, color: ['#FFC180', '#FF9C33'] },
  { key: 'ETFs', value: 10, color: ['#C7B2FF', '#A280FF'] },
  { key: 'Commodities', value: 8, color: ['#8A9BE5', '#506AE5'] },
  { key: 'Currencies', value: 7, color: ['#FFB2E8', '#FF80D8'] },
  { key: 'Smart Portfolios', value: 6, color: ['#E5B2FF', '#D580FF'] },
  { key: 'People', value: 5, color: ['#59A4FF', '#0073FF'] },
  { key: 'Indices', value: 4, color: ['#6275B2', '#2444B2'] },
  { key: 'Asia Stocks', value: 3, color: ['#ADB8C9', '#283241'] },
  { key: 'Bonds', value: 3, color: ['#FF686A', '#FF686A'] },
  { key: 'Real Estate', value: 2, color: ['#90E589', '#33C728'] },
];

const meta: Meta<{}> = {
  title: 'eToro-UI/Components/DataDisplay/BreakdownChart/📖 Introduction',
  parameters: {
    notes: 'Complete guide for the BreakdownChart component with live examples.',
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
    const { colors } = useEtoroTheme();
    const [showLabels, setShowLabels] = useState(true);
    const [maxBars, setMaxBars] = useState(9);

    return (
      <ScrollView style={styles.container}>
        <View style={[styles.header, { borderBottomColor: colors.dividerPrimary }]}>
          <EtText variant="display-main" style={styles.title}>
            📊 BreakdownChart
          </EtText>
          <EtText variant="heading-compact" style={styles.subtitle}>
            Horizontal stacked bar chart for displaying proportional data breakdown with animated transitions and gradient colors
          </EtText>
        </View>

        <View style={styles.features}>
          <EtText variant="heading-base" style={styles.featuresTitle}>
            Features
          </EtText>
          <EtText variant="body-base-regular" style={styles.featureText}>
            • Animated bar transitions using Reanimated
          </EtText>
          <EtText variant="body-base-regular" style={styles.featureText}>
            • Gradient colors for each segment
          </EtText>
          <EtText variant="body-base-regular" style={styles.featureText}>
            • Automatic "Other" condensing for excess items
          </EtText>
          <EtText variant="body-base-regular" style={styles.featureText}>
            • Configurable height, gaps, and corner radius
          </EtText>
          <EtText variant="body-base-regular" style={styles.featureText}>
            • Optional percentage labels below segments
          </EtText>
          <EtText variant="body-base-regular" style={styles.featureText}>
            • Theme-aware default colors from investment palette
          </EtText>
        </View>

        <View style={styles.demoSection}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Basic Usage
          </EtText>
          <EtBreakdownChart data={portfolioData} />
        </View>
        <CodeBlock
          title="Basic Implementation"
          code={`import { EtBreakdownChart, BreakdownChartData } from 'etoro-ui/components/data-display/breakdown-chart';

const data: BreakdownChartData[] = [
  { key: 'Stocks', value: 45, color: ['#4ADEF7', '#16C1DF'] },
  { key: 'Crypto', value: 25, color: ['#FFC180', '#FF9C33'] },
  { key: 'ETFs', value: 15, color: ['#C7B2FF', '#A280FF'] },
  { key: 'Commodities', value: 10, color: ['#8A9BE5', '#506AE5'] },
  { key: 'Currencies', value: 5, color: ['#FFB2E8', '#FF80D8'] },
];

<EtBreakdownChart data={data} />`}
        />

        <View style={styles.demoSection}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Toggle Labels
          </EtText>
          <EtBreakdownChart data={portfolioData} showLabels={showLabels} />
          <View style={styles.toggleButtons}>
            <EtButton variant={showLabels ? 'primary-filled' : 'info-subtle'} size="small" onPress={() => setShowLabels(true)}>
              <EtButton.Label>With Labels</EtButton.Label>
            </EtButton>
            <EtButton variant={!showLabels ? 'primary-filled' : 'info-subtle'} size="small" onPress={() => setShowLabels(false)}>
              <EtButton.Label>Without Labels</EtButton.Label>
            </EtButton>
          </View>
        </View>
        <CodeBlock
          title="Labels Control"
          code={`// With labels (default)
<EtBreakdownChart data={data} showLabels={true} />

// Without labels - compact view
<EtBreakdownChart data={data} showLabels={false} />`}
        />

        <View style={styles.demoSection}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Visual Customization
          </EtText>
          <View style={styles.customizationDemo}>
            <View style={styles.chartExample}>
              <EtText variant="body-base-medium" style={styles.chartTitle}>
                Default (height: 12, radius: 4)
              </EtText>
              <EtBreakdownChart data={portfolioData} />
            </View>
            <View style={styles.chartExample}>
              <EtText variant="body-base-medium" style={styles.chartTitle}>
                Large & Rounded (height: 20, radius: 10)
              </EtText>
              <EtBreakdownChart data={portfolioData} height={20} cornerRadius={10} />
            </View>
            <View style={styles.chartExample}>
              <EtText variant="body-base-medium" style={styles.chartTitle}>
                Continuous (gap: 0)
              </EtText>
              <EtBreakdownChart data={portfolioData} gap={0} />
            </View>
          </View>
        </View>
        <CodeBlock
          title="Visual Customization"
          code={`// Default styling
<EtBreakdownChart data={data} />

// Large rounded bars
<EtBreakdownChart 
  data={data} 
  height={20} 
  cornerRadius={10} 
/>

// Continuous bar (no gaps)
<EtBreakdownChart data={data} gap={0} />

// Wide gaps
<EtBreakdownChart data={data} gap={4} />`}
        />

        <View style={styles.demoSection}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            "Other" Condensing
          </EtText>
          <EtText variant="body-secondary-regular" style={{ textAlign: 'center', marginBottom: 12, opacity: 0.8 }}>
            When data exceeds maxBars, extra items are condensed into "Other"
          </EtText>
          <EtBreakdownChart data={manyItemsData} maxBars={maxBars} />
          <View style={styles.toggleButtons}>
            <EtButton variant={maxBars === 9 ? 'primary-filled' : 'info-subtle'} size="small" onPress={() => setMaxBars(9)}>
              <EtButton.Label>Max 9</EtButton.Label>
            </EtButton>
            <EtButton variant={maxBars === 5 ? 'primary-filled' : 'info-subtle'} size="small" onPress={() => setMaxBars(5)}>
              <EtButton.Label>Max 5</EtButton.Label>
            </EtButton>
            <EtButton variant={maxBars === 3 ? 'primary-filled' : 'info-subtle'} size="small" onPress={() => setMaxBars(3)}>
              <EtButton.Label>Max 3</EtButton.Label>
            </EtButton>
          </View>
        </View>
        <CodeBlock
          title="Max Bars Control"
          code={`// Show up to 9 categories (default)
<EtBreakdownChart data={largeDataset} maxBars={9} />

// Show only top 5 + Other
<EtBreakdownChart data={largeDataset} maxBars={5} />

// Minimal view - top 3 + Other
<EtBreakdownChart data={largeDataset} maxBars={3} />`}
        />

        <View style={styles.realWorldExample}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Real-World Examples
          </EtText>
          <View style={styles.tradingInterface}>
            <View style={styles.portfolioSection}>
              <EtText variant="heading-compact">Portfolio Allocation</EtText>
              <EtText variant="body-secondary-regular" style={{ opacity: 0.7, marginBottom: 8 }}>
                Asset class distribution
              </EtText>
              <EtBreakdownChart data={portfolioData} height={14} cornerRadius={6} testID="portfolio-breakdown" />
            </View>
            <View style={styles.portfolioSection}>
              <EtText variant="heading-compact">Performance Summary</EtText>
              <EtText variant="body-secondary-regular" style={{ opacity: 0.7, marginBottom: 8 }}>
                Win/loss ratio
              </EtText>
              <EtBreakdownChart data={profitLossData} height={16} cornerRadius={8} testID="performance-breakdown" />
            </View>
          </View>
        </View>
        <CodeBlock
          title="Real-World Usage"
          code={`// Portfolio allocation view
<EtBreakdownChart
  data={portfolioData}
  height={14}
  cornerRadius={6}
  testID="portfolio-breakdown"
  accessibilityLabel="Portfolio allocation breakdown"
/>

// Performance summary
<EtBreakdownChart
  data={[
    { key: 'Profit', value: 65, color: ['#90E589', '#33C728'] },
    { key: 'Loss', value: 35, color: ['#FF686A', '#FF686A'] },
  ]}
  height={16}
  cornerRadius={8}
/>`}
        />

        <View style={[styles.apiReference, { borderTopColor: colors.dividerPrimary }]}>
          <EtText variant="heading-base" style={styles.apiTitle}>
            API Reference
          </EtText>
          <CodeBlock
            title="EtBreakdownChartProps"
            code={`interface EtBreakdownChartProps {
  data?: BreakdownChartData[];   // Chart data array
  height?: number;               // Bar height in pixels (default: 12)
  cornerRadius?: number;         // Corner radius for bars (default: 4)
  gap?: number;                  // Gap between bars in pixels (default: 2)
  maxBars?: number;              // Max bars before "Other" (default: 9)
  showLabels?: boolean;          // Show percentage labels (default: true)
  enableAnimation?: boolean;     // Enable animations (default: true)
  animationDuration?: number;    // Animation duration in ms (default: 300)
  style?: StyleProp<ViewStyle>;  // Container style
  testID?: string;               // Test ID for testing
  accessibilityLabel?: string;   // Accessibility label
}

interface BreakdownChartData {
  key: string;                   // Label for the segment
  value: number;                 // Numeric value (percentage calculated automatically)
  color: [string, string];       // [gradientStart, gradientEnd] colors
}`}
          />

          <CodeBlock
            title="Key Features"
            code={`// Animations
- Smooth bar width transitions using withTiming()
- Configurable animation duration
- Can be disabled for instant rendering

// Auto-condensing
- Items beyond maxBars are merged into "Other"
- "Other" uses theme otherPrimary/otherGradient colors
- Preserves total value accuracy

// Theme Integration
- Default colors from investment color palette
- Supports currencies, ETFs, crypto, stocks, etc.
- Automatic fallback colors if not specified

// Accessibility
- testID support for automated testing
- accessibilityLabel for screen readers
- Percentage labels for visual clarity`}
          />
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
  demoSection: {
    marginBottom: 24,
    alignItems: 'center',
  },
  sectionTitle: {
    marginBottom: 16,
    textAlign: 'center',
  },
  toggleButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  customizationDemo: {
    gap: 16,
    width: '100%',
  },
  chartExample: {
    alignItems: 'center',
    gap: 8,
    width: '100%',
  },
  chartTitle: {
    textAlign: 'center',
    opacity: 0.7,
  },
  realWorldExample: {
    marginBottom: 32,
  },
  tradingInterface: {
    gap: 20,
  },
  portfolioSection: {
    alignItems: 'center',
    gap: 4,
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
