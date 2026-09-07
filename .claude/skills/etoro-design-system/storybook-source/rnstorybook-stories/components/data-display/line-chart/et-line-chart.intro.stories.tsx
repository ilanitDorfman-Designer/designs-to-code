import type { Meta, StoryObj } from '@storybook/react-native';
import * as Clipboard from 'expo-clipboard';
import React, { useState } from 'react';
import { Alert, Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';

import { EtButton, EtLineChart, EtText } from 'etoro-ui';
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

// Sample data generator
const generateSampleData = (days: number = 30, trend: 'positive' | 'negative' | 'volatile' = 'positive') => {
  const data: { timestamp: string; equity: number }[] = [];
  let equity = 1000;
  const now = new Date();

  for (let i = 0; i < days; i++) {
    const date = new Date(now.getTime() - (days - i - 1) * 24 * 60 * 60 * 1000);

    switch (trend) {
      case 'positive':
        equity += Math.random() * 50 - 10;
        break;
      case 'negative':
        equity += Math.random() * 30 - 40;
        break;
      case 'volatile':
        equity += Math.random() * 100 - 50;
        break;
    }

    data.push({
      timestamp: date.toISOString(),
      equity: Math.max(100, equity),
    });
  }

  return data;
};

// Pre-computed stable datasets for deterministic rendering across re-renders
const sizesSampleData = generateSampleData(15, 'positive');
const interactiveSampleData = generateSampleData(20, 'volatile');
const portfolioSampleData = generateSampleData(60, 'positive');
const stockSampleData = generateSampleData(30, 'negative');

const meta: Meta<{}> = {
  title: 'eToro-UI/Components/DataDisplay/EtLineChart/📖 Introduction',
  parameters: {
    notes: 'Complete guide for the LineChart component with live examples.',
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
    const [chartData, setChartData] = useState(generateSampleData(30, 'positive'));
    const [currentTrend, setCurrentTrend] = useState<'positive' | 'negative' | 'volatile'>('positive');
    const selectedValue = useSharedValue(0);

    const handleTrendChange = (trend: 'positive' | 'negative' | 'volatile') => {
      setCurrentTrend(trend);
      setChartData(generateSampleData(30, trend));
    };

    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <EtText variant="display-main" style={styles.title}>
            📈 LineChart
          </EtText>
          <EtText variant="heading-compact" style={styles.subtitle}>
            Interactive line chart component for displaying equity data with smooth animations and cursor interaction
          </EtText>
        </View>

        <View style={styles.features}>
          <EtText variant="heading-base" style={styles.featuresTitle}>
            Features
          </EtText>
          <EtText variant="body-base-regular" style={styles.featureText}>
            • Smooth animated line drawing with curved paths
          </EtText>
          <EtText variant="body-base-regular" style={styles.featureText}>
            • Interactive cursor with haptic feedback
          </EtText>
          <EtText variant="body-base-regular" style={styles.featureText}>
            • Gradient fills for positive/negative trends
          </EtText>
          <EtText variant="body-base-regular" style={styles.featureText}>
            • Configurable dimensions and margins
          </EtText>
          <EtText variant="body-base-regular" style={styles.featureText}>
            • Real-time value interpolation on touch
          </EtText>
          <EtText variant="body-base-regular" style={styles.featureText}>
            • Callback props for focus mode and cursor data
          </EtText>
        </View>

        <View style={styles.demoSection}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Basic Usage
          </EtText>
          <EtLineChart
            data={chartData}
            width={Dimensions.get('window').width - 64}
            height={200}
            balance={currentTrend === 'negative' ? 'negative' : 'positive'}
            selectedValue={selectedValue}
          />
          <View style={styles.trendButtons}>
            <EtButton
              variant={currentTrend === 'positive' ? 'primary-filled' : 'info-subtle'}
              size="small"
              onPress={() => handleTrendChange('positive')}
            >
              <EtButton.Label>Positive</EtButton.Label>
            </EtButton>
            <EtButton
              variant={currentTrend === 'negative' ? 'primary-filled' : 'info-subtle'}
              size="small"
              onPress={() => handleTrendChange('negative')}
            >
              <EtButton.Label>Negative</EtButton.Label>
            </EtButton>
            <EtButton
              variant={currentTrend === 'volatile' ? 'primary-filled' : 'info-subtle'}
              size="small"
              onPress={() => handleTrendChange('volatile')}
            >
              <EtButton.Label>Volatile</EtButton.Label>
            </EtButton>
          </View>
        </View>
        <CodeBlock
          title="Basic Implementation"
          code={`const selectedValue = useSharedValue(0);
const sampleData = [
  { timestamp: "2024-01-01T00:00:00Z", equity: 1000 },
  { timestamp: "2024-01-02T00:00:00Z", equity: 1050 },
  // ... more data points
];

<EtLineChart
  data={sampleData}
  width={300}
  height={200}
  balance="positive"
  selectedValue={selectedValue}
/>`}
        />

        <View style={styles.demoSection}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Chart Sizes
          </EtText>
          <View style={styles.sizeDemo}>
            <View style={styles.chartExample}>
              <EtText variant="body-base-medium" style={styles.chartTitle}>
                Compact (height: 120)
              </EtText>
              <EtLineChart data={sizesSampleData} width={Dimensions.get('window').width - 80} height={120} selectedValue={useSharedValue(0)} />
            </View>
            <View style={styles.chartExample}>
              <EtText variant="body-base-medium" style={styles.chartTitle}>
                Standard (height: 200)
              </EtText>
              <EtLineChart data={sizesSampleData} width={Dimensions.get('window').width - 80} height={200} selectedValue={useSharedValue(0)} />
            </View>
          </View>
        </View>
        <CodeBlock
          title="Different Sizes"
          code={`// Compact chart for widgets
<EtLineChart height={120} {...props} />

// Standard chart for main views
<EtLineChart height={200} {...props} />

// Large chart for detailed analysis
<EtLineChart height={300} {...props} />`}
        />

        <View style={styles.demoSection}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Interactive vs Static
          </EtText>
          <View style={styles.interactionDemo}>
            <View style={styles.chartExample}>
              <EtText variant="body-base-medium" style={styles.chartTitle}>
                Interactive (with cursor)
              </EtText>
              <EtLineChart
                data={interactiveSampleData}
                width={Dimensions.get('window').width - 80}
                height={150}
                isInteractive={true}
                selectedValue={useSharedValue(0)}
              />
            </View>
            <View style={styles.chartExample}>
              <EtText variant="body-base-medium" style={styles.chartTitle}>
                Static (no cursor)
              </EtText>
              <EtLineChart
                data={interactiveSampleData}
                width={Dimensions.get('window').width - 80}
                height={150}
                isInteractive={false}
                selectedValue={useSharedValue(0)}
              />
            </View>
          </View>
        </View>
        <CodeBlock
          title="Cursor Control"
          code={`// Interactive chart with cursor
<EtLineChart isInteractive={true} {...props} />

// Static chart for overview displays
<EtLineChart isInteractive={false} {...props} />`}
        />

        <View style={styles.realWorldExample}>
          <EtText variant="heading-compact" style={styles.sectionTitle}>
            Real-World Example
          </EtText>
          <View style={styles.tradingInterface}>
            <View style={styles.portfolioSection}>
              <EtText variant="heading-compact">Portfolio Performance</EtText>
              <EtLineChart
                data={portfolioSampleData}
                width={Dimensions.get('window').width - 64}
                height={180}
                balance="positive"
                selectedValue={useSharedValue(0)}
              />
            </View>
            <View style={styles.stockSection}>
              <EtText variant="heading-compact">Individual Stock</EtText>
              <EtLineChart
                data={stockSampleData}
                width={Dimensions.get('window').width - 64}
                height={140}
                balance="negative"
                selectedValue={useSharedValue(0)}
              />
            </View>
          </View>
        </View>
        <CodeBlock
          title="Trading Interface Usage"
          code={`// Portfolio dashboard
<EtLineChart
  data={portfolioData}
  balance="positive"
  height={200}
  selectedValue={portfolioValue}
/>

// Stock detail view
<EtLineChart
  data={stockData}
  balance={stockTrend}
  height={150}
  marginVertical={16}
  selectedValue={stockValue}
/>

// Widget/summary view
<EtLineChart
  data={summaryData}
  height={100}
  isInteractive={false}
  selectedValue={summaryValue}
/>`}
        />

        <View style={styles.apiReference}>
          <EtText variant="heading-base" style={styles.apiTitle}>
            API Reference
          </EtText>
          <CodeBlock
            title="LineChartProps"
            code={`interface LineChartProps {
  data: ChartDataApiEquity[];  // Required data array
  width?: number;                      // Chart width (default: screen width)
  height?: number;                     // Chart height (default: 150)
  marginVertical?: number;             // Vertical margins (default: 10)
  balance?: 'positive' | 'negative';   // Visual theme (default: 'positive')
  isInteractive?: boolean;             // Enable interaction (default: true)
  selectedValue: SharedValue<number>;  // Reanimated shared value for current selection
  onFocusModeChange?: (isFocused: boolean) => void;  // Focus mode callback
  onCursorDataChange?: (data: CursorData | null) => void;  // Cursor data callback
}

interface ChartDataApiEquity {
  timestamp: string;                   // ISO date string
  equity: number;                      // Numeric value to plot
}

interface CursorData {
  amount: number;                      // Current equity value at cursor
  pnL: number;                         // Profit/Loss at cursor position
  timestamp: string;                   // Timestamp at cursor position
}`}
          />

          <CodeBlock
            title="Key Features"
            code={`// Animations
- Line drawing animation (1000ms duration)
- Gradient fill animation (500ms delay + 500ms duration)
- Smooth value transitions with withTiming()

// Interactions  
- Pan gesture for cursor movement
- Haptic feedback on data point changes
- Real-time value interpolation between points
- onFocusModeChange callback for focus state
- onCursorDataChange callback for cursor position

// Styling
- Curved line paths using d3-shape curveBasis
- Linear gradients with configurable colors
- Responsive to theme colors via useEtoroTheme()
- Smooth stroke caps and customizable stroke width`}
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
  sizeDemo: {
    gap: 16,
    width: '100%',
  },
  interactionDemo: {
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
