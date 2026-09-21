import type { Meta, StoryObj } from '@storybook/react-native';
import { Dimensions, StyleSheet, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';

import { EtMultiLineChart, EtText } from 'etoro-ui';
import { useEtoroTheme } from 'etoro-ui/core';

type Story = StoryObj<typeof EtMultiLineChart>;

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

const meta: Meta<typeof EtMultiLineChart> = {
  title: 'eToro-UI/Components/DataDisplay/EtMultiLineChart',
  component: EtMultiLineChart,
  parameters: {
    notes: 'Compare chart: multiple stroke-only line series on a unified y-domain with per-tick gridlines.',
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
const primaryData = generateSampleData(30, 'positive');
const benchmarkData = generateSampleData(30, 'volatile');
const peerData = generateSampleData(30, 'negative');
const secondPeerData = generateSampleData(30, 'positive');

export const CompareSeries: Story = {
  render: () => {
    const fourSeriesValue = useSharedValue(0);
    const twoSeriesValue = useSharedValue(0);
    const { colors } = useEtoroTheme();

    return (
      <View style={styles.showcase}>
        <EtText variant="heading-compact" style={styles.title}>
          Compare Chart
        </EtText>

        <View style={styles.chartContainer}>
          <EtText variant="body-base-medium" style={styles.chartTitle}>
            Four Series (DS maximum)
          </EtText>
          <EtMultiLineChart
            series={[
              { data: primaryData, color: colors.verdictPositive600 },
              { data: benchmarkData, color: colors.accentB700 },
              { data: peerData, color: colors.accentD700 },
              { data: secondPeerData, color: colors.accentF700 },
            ]}
            width={Dimensions.get('window').width - 64}
            height={200}
            yAxisTickCount={4}
            yAxisTickFormat={(value) => String(Math.round(value))}
            selectedValue={fourSeriesValue}
          />
        </View>

        <View style={styles.chartContainer}>
          <EtText variant="body-base-medium" style={styles.chartTitle}>
            Two Series
          </EtText>
          <EtMultiLineChart
            series={[
              { data: primaryData, color: colors.verdictPositive600 },
              { data: benchmarkData, color: colors.accentB700 },
            ]}
            width={Dimensions.get('window').width - 64}
            height={150}
            yAxisTickCount={3}
            yAxisTickFormat={(value) => String(Math.round(value))}
            selectedValue={twoSeriesValue}
          />
        </View>
      </View>
    );
  },
};

export const GridlineVariants: Story = {
  render: () => {
    const withoutGridlinesValue = useSharedValue(0);
    const hiddenLabelsValue = useSharedValue(0);
    const manualLabelsValue = useSharedValue(0);
    const { colors } = useEtoroTheme();

    const series = [
      { data: primaryData, color: colors.verdictPositive600 },
      { data: benchmarkData, color: colors.accentB700 },
    ];
    const width = Dimensions.get('window').width - 64;

    return (
      <View style={styles.showcase}>
        <EtText variant="heading-compact" style={styles.title}>
          Gridline Variants
        </EtText>

        <View style={styles.chartContainer}>
          <EtText variant="body-base-medium" style={styles.chartTitle}>
            Gridlines Off
          </EtText>
          <EtMultiLineChart series={series} width={width} height={150} yAxisTickCount={4} showGridlines={false} selectedValue={withoutGridlinesValue} />
        </View>

        <View style={styles.chartContainer}>
          <EtText variant="body-base-medium" style={styles.chartTitle}>
            Gridlines Only (hidden labels)
          </EtText>
          <EtMultiLineChart series={series} width={width} height={150} yAxisTickCount={4} yAxisLabelsHidden selectedValue={hiddenLabelsValue} />
        </View>

        <View style={styles.chartContainer}>
          <EtText variant="body-base-medium" style={styles.chartTitle}>
            Manual Labels
          </EtText>
          <EtMultiLineChart series={series} width={width} height={150} yAxisLabels={['+40%', '+20%', '0%', '-20%']} selectedValue={manualLabelsValue} />
        </View>
      </View>
    );
  },
};

export const NonInteractive: Story = {
  render: () => {
    const staticValue = useSharedValue(0);
    const { colors } = useEtoroTheme();

    return (
      <View style={styles.showcase}>
        <EtText variant="heading-compact" style={styles.title}>
          Static (no cursor)
        </EtText>
        <EtMultiLineChart
          series={[
            { data: primaryData, color: colors.verdictPositive600 },
            { data: benchmarkData, color: colors.accentB700 },
            { data: peerData, color: colors.accentD700 },
          ]}
          width={Dimensions.get('window').width - 64}
          height={180}
          yAxisTickCount={4}
          yAxisTickFormat={(value) => String(Math.round(value))}
          isInteractive={false}
          selectedValue={staticValue}
        />
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
});
