import type { Meta, StoryObj } from '@storybook/react-native';
import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { EtPerformanceBars, PerformanceBarsColors, PerformanceBarsDataItem } from 'etoro-ui/components/data-display/performance-bars';
import { EtText } from 'etoro-ui';
import { useEtoroTheme } from 'etoro-ui/core';
import { makeTransparent } from 'etoro-ui/core/styles';
import { generateSampleData } from '../../../utils/data-generators';

type Story = StoryObj<typeof EtPerformanceBars>;

const meta: Meta<typeof EtPerformanceBars> = {
  title: 'eToro-UI/Components/DataDisplay/PerformanceBars',
  component: EtPerformanceBars,
  parameters: {
    notes:
      'Performance bars with center-based layout, gradient fills, slot backgrounds, optional selection (selectedIndex/onBarClick), and scale indicators.',
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

export const Interactive: Story = {
  render: (args) => <EtPerformanceBars {...args} />,
  args: {
    data: generateSampleData(7, 'mixed'),
    numberOfBars: 7,
    height: 160,
    barGap: 4,
    barBorderRadius: 4,
    showScale: true,
  },
  argTypes: {
    numberOfBars: {
      control: { type: 'range', min: 1, max: 12, step: 1 },
    },
    height: {
      control: { type: 'range', min: 80, max: 300, step: 20 },
    },
    barGap: {
      control: { type: 'range', min: 0, max: 16, step: 2 },
    },
    barBorderRadius: {
      control: { type: 'range', min: 0, max: 12, step: 2 },
    },
    showScale: {
      control: 'boolean',
    },
  },
};

export const Trends: Story = {
  render: () => {
    const positiveData = useMemo(() => generateSampleData(7, 'positive'), []);
    const negativeData = useMemo(() => generateSampleData(7, 'negative'), []);
    const mixedData = useMemo(() => generateSampleData(7, 'mixed'), []);

    return (
      <View style={styles.showcase}>
        <EtText variant="heading-compact" style={styles.title}>
          Chart Trends
        </EtText>

        <View style={styles.chartContainer}>
          <EtText variant="body-base-medium" style={styles.chartTitle}>
            Positive Trend (bars go up from center)
          </EtText>
          <EtPerformanceBars data={positiveData} height={140} />
        </View>

        <View style={styles.chartContainer}>
          <EtText variant="body-base-medium" style={styles.chartTitle}>
            Negative Trend (bars go down from center)
          </EtText>
          <EtPerformanceBars data={negativeData} height={140} />
        </View>

        <View style={styles.chartContainer}>
          <EtText variant="body-base-medium" style={styles.chartTitle}>
            Mixed Trend (bars extend both directions)
          </EtText>
          <EtPerformanceBars data={mixedData} height={140} />
        </View>
      </View>
    );
  },
};

export const Sizes: Story = {
  render: () => {
    const sampleData = useMemo(() => generateSampleData(5, 'mixed'), []);

    return (
      <View style={styles.showcase}>
        <EtText variant="heading-compact" style={styles.title}>
          Chart Sizes
        </EtText>

        <View style={styles.chartContainer}>
          <EtText variant="body-base-medium" style={styles.chartTitle}>
            Compact (80px)
          </EtText>
          <EtPerformanceBars data={sampleData} height={80} />
        </View>

        <View style={styles.chartContainer}>
          <EtText variant="body-base-medium" style={styles.chartTitle}>
            Medium (160px)
          </EtText>
          <EtPerformanceBars data={sampleData} height={160} />
        </View>

        <View style={styles.chartContainer}>
          <EtText variant="body-base-medium" style={styles.chartTitle}>
            Large (240px)
          </EtText>
          <EtPerformanceBars data={sampleData} height={240} />
        </View>
      </View>
    );
  },
};

export const BarStyles: Story = {
  render: () => {
    const sampleData = useMemo(() => generateSampleData(6, 'mixed'), []);

    return (
      <View style={styles.showcase}>
        <EtText variant="heading-compact" style={styles.title}>
          Bar Styles
        </EtText>

        <View style={styles.chartContainer}>
          <EtText variant="body-base-medium" style={styles.chartTitle}>
            No Gap (barGap: 0)
          </EtText>
          <EtPerformanceBars data={sampleData} height={120} barGap={0} />
        </View>

        <View style={styles.chartContainer}>
          <EtText variant="body-base-medium" style={styles.chartTitle}>
            Default Gap (barGap: 4)
          </EtText>
          <EtPerformanceBars data={sampleData} height={120} barGap={4} />
        </View>

        <View style={styles.chartContainer}>
          <EtText variant="body-base-medium" style={styles.chartTitle}>
            Wide Gap (barGap: 12)
          </EtText>
          <EtPerformanceBars data={sampleData} height={120} barGap={12} />
        </View>

        <View style={styles.chartContainer}>
          <EtText variant="body-base-medium" style={styles.chartTitle}>
            Square Bars (borderRadius: 0)
          </EtText>
          <EtPerformanceBars data={sampleData} height={120} barBorderRadius={0} />
        </View>

        <View style={styles.chartContainer}>
          <EtText variant="body-base-medium" style={styles.chartTitle}>
            Rounded Bars (borderRadius: 8)
          </EtText>
          <EtPerformanceBars data={sampleData} height={120} barBorderRadius={8} />
        </View>
      </View>
    );
  },
};

export const ScaleOptions: Story = {
  render: () => {
    const sampleData = useMemo(() => generateSampleData(7, 'mixed'), []);

    return (
      <View style={styles.showcase}>
        <EtText variant="heading-compact" style={styles.title}>
          Scale Options
        </EtText>

        <View style={styles.chartContainer}>
          <EtText variant="body-base-medium" style={styles.chartTitle}>
            With Scale (default)
          </EtText>
          <EtPerformanceBars data={sampleData} height={140} showScale={true} />
        </View>

        <View style={styles.chartContainer}>
          <EtText variant="body-base-medium" style={styles.chartTitle}>
            Without Scale
          </EtText>
          <EtPerformanceBars data={sampleData} height={140} showScale={false} />
        </View>
      </View>
    );
  },
};

export const DataCounts: Story = {
  render: () => {
    const data3 = useMemo(() => generateSampleData(3, 'mixed'), []);
    const data7 = useMemo(() => generateSampleData(7, 'mixed'), []);
    const data12 = useMemo(() => generateSampleData(12, 'mixed'), []);

    return (
      <View style={styles.showcase}>
        <EtText variant="heading-compact" style={styles.title}>
          Different Data Counts
        </EtText>

        <View style={styles.chartContainer}>
          <EtText variant="body-base-medium" style={styles.chartTitle}>
            3 Bars
          </EtText>
          <EtPerformanceBars data={data3} height={120} />
        </View>

        <View style={styles.chartContainer}>
          <EtText variant="body-base-medium" style={styles.chartTitle}>
            7 Bars (Weekly)
          </EtText>
          <EtPerformanceBars data={data7} height={120} />
        </View>

        <View style={styles.chartContainer}>
          <EtText variant="body-base-medium" style={styles.chartTitle}>
            12 Bars (Monthly)
          </EtText>
          <EtPerformanceBars data={data12} height={120} />
        </View>
      </View>
    );
  },
};

export const EmptySlots: Story = {
  render: () => {
    const data = useMemo(() => generateSampleData(5, 'mixed'), []);
    return (
      <View style={styles.showcase}>
        <EtText variant="heading-compact" style={styles.title}>
          Fixed 10 Slots, 5 Data Items (Empty Slots Show Grey Background)
        </EtText>
        <View style={styles.chartContainer}>
          <EtPerformanceBars data={data} numberOfBars={10} height={140} showScale />
        </View>
      </View>
    );
  },
};

function MutedBarsStoryContent() {
  const { colors } = useEtoroTheme();

  const data: PerformanceBarsDataItem[] = useMemo(
    () => [{ value: 18.4, muted: true }, { value: 22.1, muted: true }, { value: 19.8 }, { value: -8.4 }, { value: 18.2 }, { value: 26.5 }],
    [],
  );

  const colorScheme = useMemo<PerformanceBarsColors>(
    () => ({
      positiveBar: [colors.verdictPositive400Static, colors.verdictPositive600Static],
      negativeBar: [colors.verdictNegative600Static, colors.verdictNegative400Static],
      slot: [colors.carbon100, makeTransparent(colors.carbon100)],
      selectedPositive: [colors.carbon100, makeTransparent(colors.carbon100)],
      selectedNegative: [colors.carbon100, makeTransparent(colors.carbon100)],
      mutedBar: [colors.carbon500, colors.carbon400],
    }),
    [colors],
  );

  return (
    <View style={styles.showcase}>
      <EtText variant="heading-compact" style={styles.title}>
        Muted Bars (e.g. back-tested / simulated results)
      </EtText>
      <View style={styles.chartContainer}>
        <EtText variant="body-base-medium" style={styles.chartTitle}>
          First two bars are `muted` — grey instead of green/red
        </EtText>
        <EtPerformanceBars data={data} colorScheme={colorScheme} height={160} showScale={false} />
      </View>
    </View>
  );
}

export const MutedBars: Story = {
  render: () => <MutedBarsStoryContent />,
};

function SelectionStoryContent() {
  const data = useMemo(() => generateSampleData(5, 'mixed'), []);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleBarClick = useCallback((index: number) => {
    setSelectedIndex((prev) => (prev === index ? null : index));
  }, []);

  const selectedItem = selectedIndex != null && data[selectedIndex] ? data[selectedIndex] : null;

  return (
    <View style={styles.showcase}>
      <EtText variant="heading-compact" style={styles.title}>
        Selection (Parent Manages State, Displays Value Below)
      </EtText>
      <View style={styles.chartContainer}>
        <EtPerformanceBars data={data} numberOfBars={10} selectedIndex={selectedIndex} onBarClick={handleBarClick} height={140} showScale />
        {selectedItem && (
          <EtText variant="body-secondary-semibold" style={styles.selectedTitle}>
            {selectedItem.value >= 0 ? '+' : ''}
            {selectedItem.value.toFixed(2)}%
          </EtText>
        )}
      </View>
    </View>
  );
}

export const Selection: Story = {
  render: () => <SelectionStoryContent />,
};

export const TradingInterface: Story = {
  render: () => {
    const weeklyPerformance: PerformanceBarsDataItem[] = [
      { value: 2.5 },
      { value: -1.2 },
      { value: 3.8 },
      { value: 0.5 },
      { value: -2.1 },
      { value: 1.9 },
      { value: 4.2 },
    ];

    const monthlyReturns: PerformanceBarsDataItem[] = [
      { value: 8.5 },
      { value: -3.2 },
      { value: 5.1 },
      { value: 2.8 },
      { value: -1.5 },
      { value: 6.3 },
    ];

    return (
      <View style={styles.showcase}>
        <EtText variant="heading-compact" style={styles.title}>
          Trading Interface
        </EtText>

        <View style={styles.tradingExample}>
          <View style={styles.chartSection}>
            <EtText variant="heading-compact" style={styles.sectionTitle}>
              Weekly Performance
            </EtText>
            <EtPerformanceBars data={weeklyPerformance} height={160} />
          </View>

          <View style={styles.chartSection}>
            <EtText variant="heading-compact" style={styles.sectionTitle}>
              Monthly Returns
            </EtText>
            <EtPerformanceBars data={monthlyReturns} height={180} />
          </View>
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
    gap: 24,
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
  selectedTitle: {
    marginTop: 8,
    textAlign: 'center',
  },
});
