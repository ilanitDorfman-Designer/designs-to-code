import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';

import { EtLineChart, EtPositionCard } from 'etoro-ui';
import { useEtoroTheme } from 'etoro-ui/core';

// Mock chart data for positive trend
const mockPositiveData = Array.from({ length: 20 }, (_, i) => ({
  timestamp: `2024-01-${String(i + 1).padStart(2, '0')}`,
  equity: 1000 + Math.random() * 200 + i * 15,
  pnL: Math.random() * 50,
}));

// Mock chart data for negative trend
const mockNegativeData = Array.from({ length: 20 }, (_, i) => ({
  timestamp: `2024-01-${String(i + 1).padStart(2, '0')}`,
  equity: 1200 - Math.random() * 100 - i * 8,
  pnL: -Math.random() * 30,
}));

const meta = {
  title: 'eToro-UI/Components/DataDisplay/EtPositionCard',
  component: EtPositionCard,
  decorators: [
    (Story) => (
      <View style={styles.container}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof EtPositionCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  args: { children: null },
  render: () => {
    const { colors } = useEtoroTheme();
    const [isExpanded, setIsExpanded] = useState(false);
    const selectedValue = useSharedValue(0);
    const chartWidth = Dimensions.get('window').width - 64;

    return (
      <EtPositionCard expandDirection="down" isExpanded={isExpanded} onExpandedChange={setIsExpanded} handleBackgroundColor={colors.bgNeutralPrimary}>
        <EtPositionCard.Header>
          <View style={styles.headerStart}>
            <EtPositionCard.Symbol>TSLA</EtPositionCard.Symbol>
            <EtPositionCard.Name>Tesla Inc</EtPositionCard.Name>
          </View>
          <View style={styles.headerEnd}>
            <EtPositionCard.Price>194.86</EtPositionCard.Price>
            <EtPositionCard.Change value={3.45} percentage={1.8} />
          </View>
        </EtPositionCard.Header>

        <EtPositionCard.Divider />

        <EtPositionCard.ExpandedContent>
          <View style={styles.chartContainer}>
            <EtLineChart
              data={mockPositiveData}
              selectedValue={selectedValue}
              width={chartWidth}
              height={120}
              balance="positive"
              isInteractive={false}
            />
          </View>
          <EtPositionCard.StatRow label="Today's Return" value="$45.00 (5.2%)" />
          <EtPositionCard.StatRow label="Buying Avg.price" value="$185.00" />
        </EtPositionCard.ExpandedContent>

        <EtPositionCard.Footer>
          <View style={styles.footerRow}>
            <EtPositionCard.Label>Net Value</EtPositionCard.Label>
            <EtPositionCard.Action icon="share" onPress={() => {}} />
          </View>
          <EtPositionCard.Value>$2,450.00</EtPositionCard.Value>
          <EtPositionCard.SecondaryInfo start={<EtPositionCard.Change value={45.0} percentage={5.2} />} end="12.5 shares" />
        </EtPositionCard.Footer>
      </EtPositionCard>
    );
  },
};

export const Loading: Story = {
  args: { children: null },
  render: () => {
    const { colors } = useEtoroTheme();
    const selectedValue = useSharedValue(0);
    const chartWidth = Dimensions.get('window').width - 64;

    return (
      <EtPositionCard isLoading handleBackgroundColor={colors.bgNeutralPrimary}>
        <EtPositionCard.Header>
          <View style={styles.headerStart}>
            <EtPositionCard.Symbol>AAPL</EtPositionCard.Symbol>
            <EtPositionCard.Name>Apple inc</EtPositionCard.Name>
          </View>
          <View style={styles.headerEnd}>
            <EtPositionCard.Price>197.93</EtPositionCard.Price>
            <EtPositionCard.Change value={1.95} percentage={1.03} />
          </View>
        </EtPositionCard.Header>

        <EtPositionCard.Divider />

        <EtPositionCard.ExpandedContent>
          <View style={styles.chartContainer}>
            <EtLineChart
              data={mockPositiveData}
              selectedValue={selectedValue}
              width={chartWidth}
              height={120}
              balance="positive"
              isInteractive={true}
            />
          </View>
          <EtPositionCard.StatRow label="Today's Return" value="$699.95" />
          <EtPositionCard.StatRow label="Buying Avg.price" value="$185.00" />
        </EtPositionCard.ExpandedContent>

        <EtPositionCard.Footer>
          <EtPositionCard.Label>Net Value</EtPositionCard.Label>
          <EtPositionCard.Value>$1,699.19</EtPositionCard.Value>
          <EtPositionCard.SecondaryInfo start={<EtPositionCard.Change value={699.95} percentage={69.3} />} end="6.921 shares" />
        </EtPositionCard.Footer>
      </EtPositionCard>
    );
  },
};

export const NegativeCard: Story = {
  args: { children: null },
  render: () => {
    const { colors } = useEtoroTheme();
    const [isExpanded, setIsExpanded] = useState(false);
    const percentage = -1.39;
    const selectedValue = useSharedValue(0);
    const chartWidth = Dimensions.get('window').width - 64;

    return (
      <EtPositionCard
        isExpanded={isExpanded}
        onExpandedChange={setIsExpanded}
        handleBackgroundColor={colors.bgNeutralPrimary}
        variant={percentage >= 0 ? 'positive' : 'negative'}
      >
        <EtPositionCard.Header>
          <View style={styles.headerStart}>
            <EtPositionCard.Symbol>NVDA</EtPositionCard.Symbol>
            <EtPositionCard.Name>NVIDIA Corp</EtPositionCard.Name>
          </View>
          <View style={styles.headerEnd}>
            <EtPositionCard.Price>875.50</EtPositionCard.Price>
            <EtPositionCard.Change value={-12.35} percentage={-1.39} />
          </View>
        </EtPositionCard.Header>

        <EtPositionCard.Divider />

        <EtPositionCard.ExpandedContent>
          <View style={styles.chartContainer}>
            <EtLineChart
              data={mockNegativeData}
              selectedValue={selectedValue}
              width={chartWidth}
              height={120}
              balance="negative"
              isInteractive={false}
            />
          </View>
          <EtPositionCard.StatRow label="Today's Return" value="-$123.50 (-2.1%)" />
          <EtPositionCard.StatRow label="Buying Avg.price" value="$920.00" />
        </EtPositionCard.ExpandedContent>

        <EtPositionCard.Footer>
          <View style={styles.footerRow}>
            <EtPositionCard.Label>Net Value</EtPositionCard.Label>
            <EtPositionCard.Action icon="share" onPress={() => {}} />
          </View>
          <EtPositionCard.Value>$8,755.00</EtPositionCard.Value>
          <EtPositionCard.SecondaryInfo start={<EtPositionCard.Change value={-123.5} percentage={-2.1} />} end="10 shares" />
        </EtPositionCard.Footer>
      </EtPositionCard>
    );
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  headerStart: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  headerEnd: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  chartContainer: {
    marginVertical: 8,
  },
});
