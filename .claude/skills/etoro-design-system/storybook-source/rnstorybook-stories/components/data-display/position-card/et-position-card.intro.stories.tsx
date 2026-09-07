import type { Meta, StoryObj } from '@storybook/react-native';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';

import { EtLineChart, EtPositionCard, EtText } from 'etoro-ui';
import { useEtoroTheme } from 'etoro-ui/core';

// Mock chart data
const mockData = Array.from({ length: 20 }, (_, i) => ({
  timestamp: `2024-01-${String(i + 1).padStart(2, '0')}`,
  equity: 1000 + Math.random() * 200 + i * 15,
  pnL: Math.random() * 50,
}));

type Story = StoryObj<{}>;

function IntroductionContent() {
  const { colors } = useEtoroTheme();
  const selectedValue = useSharedValue(0);
  const chartWidth = Dimensions.get('window').width - 64;

  return (
    <ScrollView style={[styles.container]}>
      <EtText variant="display-main" style={styles.title}>
        EtPositionCard
      </EtText>
      <EtText variant="heading-compact" style={styles.subtitle}>
        Expandable card with smooth animation
      </EtText>

      <EtText variant="heading-base" style={styles.sectionTitle}>
        Features
      </EtText>
      <EtText variant="body-secondary-regular">- Compound component pattern</EtText>
      <EtText variant="body-secondary-regular">- Smooth expand/collapse animation</EtText>
      <EtText variant="body-secondary-regular">- Curved bottom with handle indicator</EtText>
      <EtText variant="body-secondary-regular">- Built-in loading state with skeletons</EtText>
      <EtText variant="body-secondary-regular">- Controlled and uncontrolled modes</EtText>

      <EtText variant="heading-base" style={styles.sectionTitle}>
        Example
      </EtText>
      <View style={styles.cardDemo}>
        <EtPositionCard>
          <EtPositionCard.Header>
            <View style={styles.headerLeft}>
              <EtPositionCard.Symbol>AAPL</EtPositionCard.Symbol>
              <EtPositionCard.Name>Apple inc</EtPositionCard.Name>
            </View>
            <View style={styles.headerRight}>
              <EtPositionCard.Price>197.93</EtPositionCard.Price>
              <EtPositionCard.Change value={45.0} percentage={5.2} />
            </View>
          </EtPositionCard.Header>
          <EtPositionCard.ExpandedContent>
            <View style={styles.chartContainer}>
              <EtLineChart data={mockData} selectedValue={selectedValue} width={chartWidth} height={120} balance="positive" isInteractive={false} />
            </View>
            <EtPositionCard.StatRow label="Today's Return" value="$45.00 (5.2%)" />
            <EtPositionCard.StatRow label="Buying Avg.price" value="$185.00" />
          </EtPositionCard.ExpandedContent>
          <EtPositionCard.Divider />
          <EtPositionCard.Footer>
            <EtPositionCard.Label>Net Value</EtPositionCard.Label>
            <EtPositionCard.Value>$1,699.19</EtPositionCard.Value>
            <EtPositionCard.SecondaryInfo start={<EtPositionCard.Change value={45.0} percentage={5.2} />} end="6.921 shares" />
          </EtPositionCard.Footer>
        </EtPositionCard>
      </View>

      <EtText variant="heading-base" style={styles.sectionTitle}>
        Usage
      </EtText>
      <EtText variant="body-secondary-regular" style={[styles.code, { backgroundColor: colors.bgNeutralSecondary }]}>
        {`<EtPositionCard>
  <EtPositionCard.Header>
    <EtPositionCard.Symbol>AAPL</EtPositionCard.Symbol>
    <EtPositionCard.Name>Apple inc</EtPositionCard.Name>
    <EtPositionCard.Price>197.93</EtPositionCard.Price>
    <EtPositionCard.Change value={1.95} percentage={-1.03} />
  </EtPositionCard.Header>

  <EtPositionCard.ExpandedContent>
    <EtLineChart {...chartProps} />
    <EtPositionCard.StatRow label="Today's Return" value="$699.95" />
  </EtPositionCard.ExpandedContent>

  <EtPositionCard.Footer>
    <EtPositionCard.Label>Net Value</EtPositionCard.Label>
    <EtPositionCard.Value>$1,699.19</EtPositionCard.Value>
  </EtPositionCard.Footer>
</EtPositionCard>`}
      </EtText>
    </ScrollView>
  );
}

const meta: Meta<{}> = {
  title: 'eToro-UI/Components/DataDisplay/EtPositionCard/Introduction',
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
  render: () => <IntroductionContent />,
};

const styles = StyleSheet.create({
  decorator: { flex: 1, padding: 16 },
  container: { flex: 1 },
  title: { textAlign: 'center', marginBottom: 8 },
  subtitle: { textAlign: 'center', opacity: 0.8, marginBottom: 24 },
  sectionTitle: { marginTop: 24, marginBottom: 12 },
  cardDemo: { marginVertical: 16 },
  code: { fontFamily: 'Courier', fontSize: 11, padding: 12, borderRadius: 8 },
  headerLeft: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  headerRight: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  chartContainer: {
    marginBottom: 16,
  },
});
