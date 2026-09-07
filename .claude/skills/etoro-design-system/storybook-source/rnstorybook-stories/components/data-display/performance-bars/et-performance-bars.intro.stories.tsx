import type { Meta, StoryObj } from '@storybook/react-native';
import * as Clipboard from 'expo-clipboard';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { EtPerformanceBars, PerformanceBarsDataItem } from 'etoro-ui/components/data-display/performance-bars';
import { EtButton, EtText } from 'etoro-ui';
import { useEtoroTheme } from 'etoro-ui/core';
import { generateSampleData } from '../../../utils/data-generators';

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
        <View style={[styles.codeHeader, { borderBottomColor: colors.dividerPrimary }]}>
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
  title: 'eToro-UI/Components/DataDisplay/PerformanceBars/📖 Introduction',
  parameters: {
    notes: 'Complete guide for the PerformanceBars component with live examples.',
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
    const [chartData, setChartData] = useState(generateSampleData(7, 'mixed'));
    const [currentTrend, setCurrentTrend] = useState<'positive' | 'negative' | 'mixed'>('mixed');

    const handleTrendChange = (trend: 'positive' | 'negative' | 'mixed') => {
      setCurrentTrend(trend);
      setChartData(generateSampleData(7, trend));
    };

    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <EtText variant="display-main" style={styles.title}>
            📊 PerformanceBars
          </EtText>
          <EtText variant="heading-compact" style={styles.subtitle}>
            Center-based performance bars with positive bars extending upward and negative bars extending downward, featuring gradient fills and scale
            indicators
          </EtText>
        </View>

        <View style={styles.features}>
          <EtText variant="heading-base" style={styles.featuresTitle}>
            Features
          </EtText>
          <EtText variant="body-base-regular" style={styles.featureText}>
            • Center-based layout: positive bars go up, negative go down
          </EtText>
          <EtText variant="body-base-regular" style={styles.featureText}>
            • Gradient fills for visual depth
          </EtText>
          <EtText variant="body-base-regular" style={styles.featureText}>
            • Scale indicators on the side (RTL-aware)
          </EtText>
          <EtText variant="body-base-regular" style={styles.featureText}>
            • Tap bar to select; parent can show value/label via selectedIndex and onBarClick
          </EtText>
          <EtText variant="body-base-regular" style={styles.featureText}>
            • Configurable height, gap, and border radius
          </EtText>
          <EtText variant="body-base-regular" style={styles.featureText}>
            • Theme-aware colors with automatic dark mode support
          </EtText>
        </View>

        <View style={styles.demoSection}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Basic Usage
          </EtText>
          <EtPerformanceBars data={chartData} height={160} />
          <View style={styles.trendButtons}>
            <EtButton
              display={{
                title: 'Positive',
                variant: currentTrend === 'positive' ? 'primary' : 'outline',
                size: 'small',
              }}
              interaction={{
                onPress: () => handleTrendChange('positive'),
              }}
            />
            <EtButton
              display={{
                title: 'Negative',
                variant: currentTrend === 'negative' ? 'primary' : 'outline',
                size: 'small',
              }}
              interaction={{
                onPress: () => handleTrendChange('negative'),
              }}
            />
            <EtButton
              display={{
                title: 'Mixed',
                variant: currentTrend === 'mixed' ? 'primary' : 'outline',
                size: 'small',
              }}
              interaction={{
                onPress: () => handleTrendChange('mixed'),
              }}
            />
          </View>
          <EtText variant="body-base-regular" style={styles.hint}>
            Use selectedIndex and onBarClick to show the selected bar’s value in your UI
          </EtText>
        </View>

        <CodeBlock
          title="Basic Implementation"
          code={`import { EtPerformanceBars, PerformanceBarsDataItem } from 'etoro-ui';

const data: PerformanceBarsDataItem[] = [
  { value: 2.5 },
  { value: -1.2 },
  { value: 3.8 },
  { value: 0.5 },
  { value: -2.1 },
];

<EtPerformanceBars data={data} height={160} />`}
        />

        <View style={styles.demoSection}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Chart Sizes
          </EtText>
          <View style={styles.sizeDemo}>
            <View style={styles.chartExample}>
              <EtText variant="body-base-medium" style={styles.chartTitle}>
                Compact (height: 100)
              </EtText>
              <EtPerformanceBars data={generateSampleData(5, 'mixed')} height={100} />
            </View>
            <View style={styles.chartExample}>
              <EtText variant="body-base-medium" style={styles.chartTitle}>
                Standard (height: 160)
              </EtText>
              <EtPerformanceBars data={generateSampleData(5, 'mixed')} height={160} />
            </View>
          </View>
        </View>

        <CodeBlock
          title="Different Sizes"
          code={`// Compact chart for widgets
<EtPerformanceBars data={data} height={100} />

// Standard chart for main views
<EtPerformanceBars data={data} height={160} />

// Large chart for detailed analysis
<EtPerformanceBars data={data} height={240} />`}
        />

        <View style={styles.demoSection}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Scale Options
          </EtText>
          <View style={styles.styleDemo}>
            <View style={styles.chartExample}>
              <EtText variant="body-base-medium" style={styles.chartTitle}>
                With Scale (default)
              </EtText>
              <EtPerformanceBars data={generateSampleData(6, 'mixed')} height={120} showScale={true} />
            </View>
            <View style={styles.chartExample}>
              <EtText variant="body-base-medium" style={styles.chartTitle}>
                Without Scale
              </EtText>
              <EtPerformanceBars data={generateSampleData(6, 'mixed')} height={120} showScale={false} />
            </View>
          </View>
        </View>

        <CodeBlock
          title="Scale Options"
          code={`// With scale labels (default)
<EtPerformanceBars data={data} showScale={true} />

// Without scale labels
<EtPerformanceBars data={data} showScale={false} />`}
        />

        <View style={styles.demoSection}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Bar Styling
          </EtText>
          <View style={styles.styleDemo}>
            <View style={styles.chartExample}>
              <EtText variant="body-base-medium" style={styles.chartTitle}>
                Square Corners
              </EtText>
              <EtPerformanceBars data={generateSampleData(6, 'mixed')} height={100} barBorderRadius={0} />
            </View>
            <View style={styles.chartExample}>
              <EtText variant="body-base-medium" style={styles.chartTitle}>
                Rounded Corners
              </EtText>
              <EtPerformanceBars data={generateSampleData(6, 'mixed')} height={100} barBorderRadius={8} />
            </View>
          </View>
        </View>

        <CodeBlock
          title="Styling Options"
          code={`// No gap between bars
<EtPerformanceBars data={data} barGap={0} />

// Wide gap between bars
<EtPerformanceBars data={data} barGap={12} />

// Square bar corners
<EtPerformanceBars data={data} barBorderRadius={0} />

// Rounded bar corners
<EtPerformanceBars data={data} barBorderRadius={8} />`}
        />

        <View style={styles.realWorldExample}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Real-World Example
          </EtText>
          <View style={styles.tradingInterface}>
            <View style={styles.portfolioSection}>
              <EtText variant="heading-compact">Weekly Performance</EtText>
              <EtPerformanceBars
                data={[{ value: 2.5 }, { value: -1.2 }, { value: 3.8 }, { value: 0.5 }, { value: -2.1 }, { value: 1.9 }, { value: 4.2 }]}
                height={160}
              />
            </View>
            <View style={styles.stockSection}>
              <EtText variant="heading-compact">Monthly Returns</EtText>
              <EtPerformanceBars
                data={[{ value: 8.5 }, { value: -3.2 }, { value: 5.1 }, { value: 2.8 }, { value: -1.5 }, { value: 6.3 }]}
                height={180}
              />
            </View>
          </View>
        </View>

        <CodeBlock
          title="Trading Interface Usage"
          code={`// Weekly performance chart
const weeklyData: PerformanceBarsDataItem[] = [
  { value: 2.5 },
  { value: -1.2 },
  { value: 3.8 },
  // ... more days
];

<EtPerformanceBars data={weeklyData} height={160} />

// Monthly returns chart
const monthlyData: PerformanceBarsDataItem[] = [
  { value: 8.5 },
  { value: -3.2 },
  // ... more months
];

<EtPerformanceBars data={monthlyData} height={180} />`}
        />

        <View style={styles.apiReference}>
          <EtText variant="heading-base" style={styles.apiTitle}>
            API Reference
          </EtText>

          <CodeBlock
            title="EtPerformanceBarsProps"
            code={`interface EtPerformanceBarsProps {
  /** Chart data: array of { value } */
  data: PerformanceBarsDataItem[];
  
  /** Total number of bar slots (empty slots show grey background) */
  numberOfBars?: number;
  
  /** Selected bar index; parent controls via onBarClick */
  selectedIndex?: number | null;
  
  /** Called when a bar is pressed */
  onBarClick?: (index: number) => void;
  
  /** Height of the chart area in pixels */
  height?: number;        // default: 120
  
  /** Gap between bars in pixels */
  barGap?: number;        // default: 4
  
  /** Border radius of each bar */
  barBorderRadius?: number;  // default: 4
  
  /** Whether to show scale labels (default: true) */
  showScale?: boolean;
  
  /** Container style */
  style?: StyleProp<ViewStyle>;
  
  /** Test ID */
  testID?: string;
  
  /** Accessibility label */
  accessibilityLabel?: string;
}

interface PerformanceBarsDataItem {
  /** Numeric value; sign determines bar direction/color */
  value: number;
}`}
          />

          <CodeBlock
            title="Key Features"
            code={`// Layout
- Center-based: 0 line at vertical center
- Positive values: bars extend upward
- Negative values: bars extend downward
- Bars scale relative to max absolute value

// Gradients
- Positive bars: green gradient (lighter to darker)
- Negative bars: red gradient (darker to lighter)
- Uses theme colors for consistency

// Scale
- Shows max positive, 0, and max negative values
- Position: right side (LTR) or left side (RTL)
- Can be hidden with showScale={false}

// Interactions
- Tap bar to select; use onBarClick and selectedIndex (parent manages state)
- Selected bar: full opacity, slot background uses bar color; others dimmed

// Theming
- Uses useEtoroTheme() for colors
- Automatically adapts to light/dark mode
- RTL layout support`}
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
  trendButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  hint: {
    marginTop: 8,
    opacity: 0.6,
    fontStyle: 'italic',
  },
  sizeDemo: {
    gap: 16,
    width: '100%',
  },
  styleDemo: {
    gap: 16,
    width: '100%',
  },
  chartExample: {
    alignItems: 'center',
    gap: 8,
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
    gap: 12,
  },
  stockSection: {
    alignItems: 'center',
    gap: 12,
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
