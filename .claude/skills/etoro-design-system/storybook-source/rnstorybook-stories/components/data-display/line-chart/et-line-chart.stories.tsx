import type { Meta, StoryObj } from '@storybook/react-native';
import { ChartMarker } from 'etoro-ui/components/data-display/line-chart/api';
import { Dimensions, StyleSheet, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';

import { EtLineChart, EtText } from 'etoro-ui';

type Story = StoryObj<typeof EtLineChart>;

// Sample data generator
const generateSampleData = (days: number = 30, trend: 'positive' | 'negative' | 'volatile' = 'positive') => {
  const data: { timestamp: string; equity: number }[] = [];
  let equity = 1000;
  const now = new Date();

  for (let i = 0; i < days; i++) {
    const date = new Date(now.getTime() - (days - i - 1) * 24 * 60 * 60 * 1000);

    switch (trend) {
      case 'positive':
        equity += Math.random() * 50 - 10; // mostly positive trend
        break;
      case 'negative':
        equity += Math.random() * 30 - 40; // mostly negative trend
        break;
      case 'volatile':
        equity += Math.random() * 100 - 50; // volatile
        break;
    }

    data.push({
      timestamp: date.toISOString(),
      equity: Math.max(100, equity), // don't go below 100
    });
  }

  return data;
};

const pickMarkerTimestamps = (data: { timestamp: string }[], indices: number[]): ChartMarker[] =>
  indices.filter((i) => i < data.length).map((i) => ({ timestamp: data[i].timestamp }));

const meta: Meta<typeof EtLineChart> = {
  title: 'eToro-UI/Components/DataDisplay/EtLineChart',
  component: EtLineChart,
  parameters: {
    notes: 'Interactive line chart component for displaying equity data over time.',
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

// Pre-computed stable datasets for deterministic rendering across re-renders
const trendPositiveData = generateSampleData(30, 'positive');
const trendNegativeData = generateSampleData(30, 'negative');
const trendVolatileData = generateSampleData(30, 'volatile');
const tradingPortfolioData = generateSampleData(60, 'positive');
const tradingStockData = generateSampleData(30, 'volatile');

export const Interactive: Story = {
  render: (args) => {
    const selectedValue = useSharedValue(0);
    return <EtLineChart {...args} selectedValue={selectedValue} />;
  },
  args: {
    data: generateSampleData(30, 'positive'),
    width: Dimensions.get('window').width - 32,
    height: 200,
    marginVertical: 10,
    balance: 'positive',
    isInteractive: true,
  },
  argTypes: {
    balance: {
      control: 'select',
      options: ['positive', 'negative'],
    },
    height: {
      control: { type: 'range', min: 100, max: 400, step: 50 },
    },
    marginVertical: {
      control: { type: 'range', min: 5, max: 50, step: 5 },
    },
    isInteractive: {
      control: 'boolean',
    },
  },
};

export const Trends: Story = {
  render: () => {
    const positiveValue = useSharedValue(0);
    const negativeValue = useSharedValue(0);
    const volatileValue = useSharedValue(0);

    return (
      <View style={styles.showcase}>
        <EtText variant="heading-compact" style={styles.title}>
          Chart Trends
        </EtText>

        <View style={styles.chartContainer}>
          <EtText variant="body-base-medium" style={styles.chartTitle}>
            Positive Trend
          </EtText>
          <EtLineChart
            data={trendPositiveData}
            width={Dimensions.get('window').width - 64}
            height={150}
            balance="positive"
            selectedValue={positiveValue}
          />
        </View>

        <View style={styles.chartContainer}>
          <EtText variant="body-base-medium" style={styles.chartTitle}>
            Negative Trend
          </EtText>
          <EtLineChart
            data={trendNegativeData}
            width={Dimensions.get('window').width - 64}
            height={150}
            balance="negative"
            selectedValue={negativeValue}
          />
        </View>

        <View style={styles.chartContainer}>
          <EtText variant="body-base-medium" style={styles.chartTitle}>
            Volatile
          </EtText>
          <EtLineChart
            data={trendVolatileData}
            width={Dimensions.get('window').width - 64}
            height={150}
            balance="positive"
            selectedValue={volatileValue}
          />
        </View>
      </View>
    );
  },
};

export const Sizes: Story = {
  render: () => {
    const smallValue = useSharedValue(0);
    const mediumValue = useSharedValue(0);
    const largeValue = useSharedValue(0);

    const sampleData = generateSampleData(20, 'positive');

    return (
      <View style={styles.showcase}>
        <EtText variant="heading-compact" style={styles.title}>
          Chart Sizes
        </EtText>

        <View style={styles.chartContainer}>
          <EtText variant="body-base-medium" style={styles.chartTitle}>
            Small (100px)
          </EtText>
          <EtLineChart data={sampleData} width={Dimensions.get('window').width - 64} height={100} selectedValue={smallValue} />
        </View>

        <View style={styles.chartContainer}>
          <EtText variant="body-base-medium" style={styles.chartTitle}>
            Medium (200px)
          </EtText>
          <EtLineChart data={sampleData} width={Dimensions.get('window').width - 64} height={200} selectedValue={mediumValue} />
        </View>

        <View style={styles.chartContainer}>
          <EtText variant="body-base-medium" style={styles.chartTitle}>
            Large (300px)
          </EtText>
          <EtLineChart data={sampleData} width={Dimensions.get('window').width - 64} height={300} selectedValue={largeValue} />
        </View>
      </View>
    );
  },
};

export const States: Story = {
  render: () => {
    const normalValue = useSharedValue(0);
    const noCursorValue = useSharedValue(0);

    const sampleData = generateSampleData(15, 'positive');

    return (
      <View style={styles.showcase}>
        <EtText variant="heading-compact" style={styles.title}>
          Chart States
        </EtText>

        <View style={styles.chartContainer}>
          <EtText variant="body-base-medium" style={styles.chartTitle}>
            With Cursor (Interactive)
          </EtText>
          <EtLineChart data={sampleData} width={Dimensions.get('window').width - 64} height={150} isInteractive={true} selectedValue={normalValue} />
        </View>

        <View style={styles.chartContainer}>
          <EtText variant="body-base-medium" style={styles.chartTitle}>
            Without Cursor (Static)
          </EtText>
          <EtLineChart
            data={sampleData}
            width={Dimensions.get('window').width - 64}
            height={150}
            isInteractive={false}
            selectedValue={noCursorValue}
          />
        </View>
      </View>
    );
  },
};

export const TradingInterface: Story = {
  render: () => {
    const portfolioValue = useSharedValue(0);
    const stockValue = useSharedValue(0);

    return (
      <View style={styles.showcase}>
        <EtText variant="heading-compact" style={styles.title}>
          Trading Interface
        </EtText>

        <View style={styles.tradingExample}>
          <View style={styles.chartSection}>
            <EtText variant="heading-compact" style={styles.sectionTitle}>
              Portfolio Performance
            </EtText>
            <EtLineChart
              data={tradingPortfolioData}
              width={Dimensions.get('window').width - 64}
              height={200}
              balance="positive"
              selectedValue={portfolioValue}
            />
          </View>

          <View style={styles.chartSection}>
            <EtText variant="heading-compact" style={styles.sectionTitle}>
              AAPL Stock
            </EtText>
            <EtLineChart
              data={tradingStockData}
              width={Dimensions.get('window').width - 64}
              height={150}
              balance="negative"
              selectedValue={stockValue}
            />
          </View>
        </View>
      </View>
    );
  },
};

// Pre-computed data for markers story
const markersChartData = generateSampleData(30, 'positive');
const cashFlowMarkers = pickMarkerTimestamps(markersChartData, [3, 10, 17, 22, 28]);

export const Markers: Story = {
  render: () => {
    const withMarkersValue = useSharedValue(0);
    const fewMarkersValue = useSharedValue(0);
    const manyMarkersValue = useSharedValue(0);

    const fewMarkers = pickMarkerTimestamps(markersChartData, [5, 20]);
    const manyMarkers = pickMarkerTimestamps(markersChartData, [1, 4, 7, 10, 13, 16, 19, 22, 25, 28]);

    return (
      <View style={styles.showcase}>
        <EtText variant="heading-compact" style={styles.title}>
          Deposit Markers
        </EtText>

        <View style={styles.chartContainer}>
          <EtLineChart
            data={markersChartData}
            width={Dimensions.get('window').width - 64}
            height={200}
            balance="positive"
            markers={cashFlowMarkers}
            selectedValue={withMarkersValue}
          />
        </View>

        <View style={styles.chartContainer}>
          <EtText variant="body-base-medium" style={styles.chartTitle}>
            Few Markers
          </EtText>
          <EtLineChart
            data={markersChartData}
            width={Dimensions.get('window').width - 64}
            height={150}
            balance="positive"
            markers={fewMarkers}
            selectedValue={fewMarkersValue}
          />
        </View>

        <View style={styles.chartContainer}>
          <EtText variant="body-base-medium" style={styles.chartTitle}>
            Many Markers
          </EtText>
          <EtLineChart
            data={markersChartData}
            width={Dimensions.get('window').width - 64}
            height={150}
            balance="positive"
            markers={manyMarkers}
            selectedValue={manyMarkersValue}
          />
        </View>
      </View>
    );
  },
};

const styles = StyleSheet.create({
  decorator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  showcase: {
    alignItems: 'center',
    gap: 16,
    width: '100%',
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  chartContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 8,
  },
  chartTitle: {
    textAlign: 'center',
    opacity: 0.8,
  },
  tradingExample: {
    width: '100%',
    gap: 24,
  },
  chartSection: {
    width: '100%',
    alignItems: 'center',
    gap: 12,
  },
  sectionTitle: {
    textAlign: 'center',
  },
});
