import type { Meta, StoryObj } from '@storybook/react-native';
import { EtText } from 'etoro-ui';
import { BreakdownChartData, EtBreakdownChart } from 'etoro-ui/components/data-display/breakdown-chart';
import { useEtoroTheme } from 'etoro-ui/core';
import { StyleSheet, View } from 'react-native';

type Story = StoryObj<typeof EtBreakdownChart>;

// Sample data sets for different scenarios
const portfolioAllocationData: BreakdownChartData[] = [
  { key: 'Stocks', value: 45, color: ['#4ADEF7', '#16C1DF'] },
  { key: 'Crypto', value: 25, color: ['#FFC180', '#FF9C33'] },
  { key: 'ETFs', value: 15, color: ['#C7B2FF', '#A280FF'] },
  { key: 'Commodities', value: 10, color: ['#8A9BE5', '#506AE5'] },
  { key: 'Currencies', value: 5, color: ['#FFB2E8', '#FF80D8'] },
];

const assetTypeData: BreakdownChartData[] = [
  { key: 'AAPL', value: 30, color: ['#4ADEF7', '#16C1DF'] },
  { key: 'TSLA', value: 25, color: ['#FFC180', '#FF9C33'] },
  { key: 'GOOGL', value: 20, color: ['#C7B2FF', '#A280FF'] },
  { key: 'MSFT', value: 15, color: ['#8A9BE5', '#506AE5'] },
  { key: 'AMZN', value: 10, color: ['#FFB2E8', '#FF80D8'] },
];

const twoItemData: BreakdownChartData[] = [
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

const singleItemData: BreakdownChartData[] = [{ key: 'Stocks', value: 100, color: ['#4ADEF7', '#16C1DF'] }];

const meta: Meta<typeof EtBreakdownChart> = {
  title: 'eToro-UI/Components/DataDisplay/BreakdownChart',
  component: EtBreakdownChart,
  parameters: {
    notes:
      'A horizontal stacked bar chart component for displaying proportional data breakdown. Features animated transitions, gradient colors per segment, optional labels, and automatic condensing of excess items into "Other".',
  },
  decorators: [
    (Story) => {
      const { colors } = useEtoroTheme();

      return (
        <View style={[styles.decorator, { backgroundColor: colors.bgNeutralPrimary }]}>
          <Story />
        </View>
      );
    },
  ],
};

export default meta;

export const Interactive: Story = {
  render: (args) => <EtBreakdownChart {...args} />,
  args: {
    data: portfolioAllocationData,
    height: 12,
    cornerRadius: 4,
    gap: 2,
    maxBars: 9,
    showLabels: true,
    enableAnimation: true,
    animationDuration: 300,
  },
  argTypes: {
    height: {
      control: { type: 'range', min: 6, max: 24, step: 2 },
    },
    cornerRadius: {
      control: { type: 'range', min: 0, max: 12, step: 1 },
    },
    gap: {
      control: { type: 'range', min: 0, max: 8, step: 1 },
    },
    maxBars: {
      control: { type: 'range', min: 3, max: 9, step: 1 },
    },
    showLabels: {
      control: 'boolean',
    },
    enableAnimation: {
      control: 'boolean',
    },
    animationDuration: {
      control: { type: 'range', min: 100, max: 1000, step: 100 },
    },
  },
};

export const BasicUsage: Story = {
  render: () => {
    const { colors } = useEtoroTheme();

    return (
      <View style={styles.showcase}>
        <EtText variant="heading-compact" style={[styles.title, { color: colors.textPrimaryNeutral }]}>
          Basic Usage
        </EtText>

        <View style={[styles.section, { backgroundColor: colors.bgNeutralSecondary }]}>
          <EtText variant="heading-compact" style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>
            Portfolio Allocation
          </EtText>
          <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral, marginBottom: 8 }}>
            Simple breakdown chart with default settings
          </EtText>
          <EtBreakdownChart data={portfolioAllocationData} />
        </View>

        <View style={[styles.section, { backgroundColor: colors.bgNeutralSecondary }]}>
          <EtText variant="heading-compact" style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>
            Two-way Split
          </EtText>
          <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral, marginBottom: 8 }}>
            Simple profit/loss comparison
          </EtText>
          <EtBreakdownChart data={twoItemData} />
        </View>

        <View style={[styles.section, { backgroundColor: colors.bgNeutralSecondary }]}>
          <EtText variant="heading-compact" style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>
            Single Item
          </EtText>
          <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral, marginBottom: 8 }}>
            Edge case with only one data point
          </EtText>
          <EtBreakdownChart data={singleItemData} />
        </View>
      </View>
    );
  },
};

export const VisualStyles: Story = {
  render: () => {
    const { colors } = useEtoroTheme();

    return (
      <View style={styles.showcase}>
        <EtText variant="heading-compact" style={[styles.title, { color: colors.textPrimaryNeutral }]}>
          Visual Styles
        </EtText>

        <View style={[styles.section, { backgroundColor: colors.bgNeutralSecondary }]}>
          <EtText variant="heading-compact" style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>
            Small Height (8px)
          </EtText>
          <EtBreakdownChart data={portfolioAllocationData} height={8} />
        </View>

        <View style={[styles.section, { backgroundColor: colors.bgNeutralSecondary }]}>
          <EtText variant="heading-compact" style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>
            Large Height (20px)
          </EtText>
          <EtBreakdownChart data={portfolioAllocationData} height={20} />
        </View>

        <View style={[styles.section, { backgroundColor: colors.bgNeutralSecondary }]}>
          <EtText variant="heading-compact" style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>
            Rounded Corners (8px radius)
          </EtText>
          <EtBreakdownChart data={portfolioAllocationData} height={16} cornerRadius={8} />
        </View>

        <View style={[styles.section, { backgroundColor: colors.bgNeutralSecondary }]}>
          <EtText variant="heading-compact" style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>
            No Corner Radius (Sharp edges)
          </EtText>
          <EtBreakdownChart data={portfolioAllocationData} cornerRadius={0} />
        </View>

        <View style={[styles.section, { backgroundColor: colors.bgNeutralSecondary }]}>
          <EtText variant="heading-compact" style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>
            Large Gap (4px)
          </EtText>
          <EtBreakdownChart data={portfolioAllocationData} gap={4} />
        </View>

        <View style={[styles.section, { backgroundColor: colors.bgNeutralSecondary }]}>
          <EtText variant="heading-compact" style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>
            No Gap (Continuous bar)
          </EtText>
          <EtBreakdownChart data={portfolioAllocationData} gap={0} />
        </View>
      </View>
    );
  },
};

export const LabelOptions: Story = {
  render: () => {
    const { colors } = useEtoroTheme();

    return (
      <View style={styles.showcase}>
        <EtText variant="heading-compact" style={[styles.title, { color: colors.textPrimaryNeutral }]}>
          Label Options
        </EtText>

        <View style={[styles.section, { backgroundColor: colors.bgNeutralSecondary }]}>
          <EtText variant="heading-compact" style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>
            With Labels (Default)
          </EtText>
          <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral, marginBottom: 8 }}>
            Labels show percentage values below each segment
          </EtText>
          <EtBreakdownChart data={portfolioAllocationData} showLabels={true} />
        </View>

        <View style={[styles.section, { backgroundColor: colors.bgNeutralSecondary }]}>
          <EtText variant="heading-compact" style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>
            Without Labels
          </EtText>
          <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral, marginBottom: 8 }}>
            Compact view without labels - suitable for tight spaces
          </EtText>
          <EtBreakdownChart data={portfolioAllocationData} showLabels={false} />
        </View>
      </View>
    );
  },
};

export const OtherCondensing: Story = {
  render: () => {
    const { colors } = useEtoroTheme();

    return (
      <View style={styles.showcase}>
        <EtText variant="heading-compact" style={[styles.title, { color: colors.textPrimaryNeutral }]}>
          "Other" Condensing Behavior
        </EtText>

        <View style={[styles.section, { backgroundColor: colors.bgNeutralSecondary }]}>
          <EtText variant="heading-compact" style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>
            12 Items with maxBars=9 (Default)
          </EtText>
          <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral, marginBottom: 8 }}>
            First 9 items shown, remaining 3 condensed into "Other"
          </EtText>
          <EtBreakdownChart data={manyItemsData} maxBars={9} />
        </View>

        <View style={[styles.section, { backgroundColor: colors.bgNeutralSecondary }]}>
          <EtText variant="heading-compact" style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>
            12 Items with maxBars=5
          </EtText>
          <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral, marginBottom: 8 }}>
            First 5 items shown, remaining 7 condensed into "Other"
          </EtText>
          <EtBreakdownChart data={manyItemsData} maxBars={5} />
        </View>

        <View style={[styles.section, { backgroundColor: colors.bgNeutralSecondary }]}>
          <EtText variant="heading-compact" style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>
            12 Items with maxBars=3
          </EtText>
          <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral, marginBottom: 8 }}>
            Minimal view - only top 3 categories
          </EtText>
          <EtBreakdownChart data={manyItemsData} maxBars={3} />
        </View>
      </View>
    );
  },
};

export const AnimationOptions: Story = {
  render: () => {
    const { colors } = useEtoroTheme();

    return (
      <View style={styles.showcase}>
        <EtText variant="heading-compact" style={[styles.title, { color: colors.textPrimaryNeutral }]}>
          Animation Options
        </EtText>

        <View style={[styles.section, { backgroundColor: colors.bgNeutralSecondary }]}>
          <EtText variant="heading-compact" style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>
            Animation Enabled (Default - 300ms)
          </EtText>
          <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral, marginBottom: 8 }}>
            Smooth transition when data changes
          </EtText>
          <EtBreakdownChart data={portfolioAllocationData} enableAnimation={true} animationDuration={300} />
        </View>

        <View style={[styles.section, { backgroundColor: colors.bgNeutralSecondary }]}>
          <EtText variant="heading-compact" style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>
            Slow Animation (800ms)
          </EtText>
          <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral, marginBottom: 8 }}>
            Emphasizes the transition effect
          </EtText>
          <EtBreakdownChart data={portfolioAllocationData} enableAnimation={true} animationDuration={800} />
        </View>

        <View style={[styles.section, { backgroundColor: colors.bgNeutralSecondary }]}>
          <EtText variant="heading-compact" style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>
            Animation Disabled
          </EtText>
          <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral, marginBottom: 8 }}>
            Instant render without transition
          </EtText>
          <EtBreakdownChart data={portfolioAllocationData} enableAnimation={false} />
        </View>
      </View>
    );
  },
};

export const RealWorldExamples: Story = {
  render: () => {
    const { colors } = useEtoroTheme();

    return (
      <View style={styles.showcase}>
        <EtText variant="heading-compact" style={[styles.title, { color: colors.textPrimaryNeutral }]}>
          Real World Examples
        </EtText>

        <View style={[styles.section, { backgroundColor: colors.bgNeutralSecondary }]}>
          <EtText variant="heading-compact" style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>
            Portfolio Overview
          </EtText>
          <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral, marginBottom: 8 }}>
            Asset class distribution in a user's portfolio
          </EtText>
          <EtBreakdownChart
            data={portfolioAllocationData}
            height={14}
            cornerRadius={6}
            testID="portfolio-breakdown"
            accessibilityLabel="Portfolio allocation breakdown chart"
          />
        </View>

        <View style={[styles.section, { backgroundColor: colors.bgNeutralSecondary }]}>
          <EtText variant="heading-compact" style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>
            Top Holdings
          </EtText>
          <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral, marginBottom: 8 }}>
            Distribution of top stocks in portfolio
          </EtText>
          <EtBreakdownChart data={assetTypeData} height={12} gap={3} testID="holdings-breakdown" accessibilityLabel="Top holdings distribution" />
        </View>

        <View style={[styles.section, { backgroundColor: colors.bgNeutralSecondary }]}>
          <EtText variant="heading-compact" style={[styles.sectionTitle, { color: colors.textPrimaryNeutral }]}>
            Performance Summary
          </EtText>
          <EtText variant="body-secondary-regular" style={{ color: colors.textSecondaryNeutral, marginBottom: 8 }}>
            Win/loss ratio visualization
          </EtText>
          <EtBreakdownChart
            data={twoItemData}
            height={16}
            cornerRadius={8}
            testID="performance-breakdown"
            accessibilityLabel="Performance win loss ratio"
          />
        </View>
      </View>
    );
  },
};

const styles = StyleSheet.create({
  decorator: {
    flex: 1,
    padding: 16,
  },
  showcase: {
    width: '100%',
    gap: 16,
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    marginBottom: 4,
  },
});
