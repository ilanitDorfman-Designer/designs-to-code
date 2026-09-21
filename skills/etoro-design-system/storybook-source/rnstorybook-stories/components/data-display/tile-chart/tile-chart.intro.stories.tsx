import type { Meta, StoryObj } from '@storybook/react-native';
import { EtText, EtTileChart, TileChartData } from 'etoro-ui';
import { eToroLightColors } from 'etoro-ui/core/styles/colors';
import { ScrollView, StyleSheet, View } from 'react-native';

const { colors } = eToroLightColors;

const sampleTileChartDataByValue: TileChartData[] = [
  {
    label: 'Crypto',
    value: 50,
    color: [colors.cryptoPrimary, colors.cryptoGradient],
  },
  {
    label: 'Stocks',
    value: 30,
    color: [colors.stocksPrimary, colors.stocksGradient],
  },
  { label: 'ETF', value: 19, color: [colors.etfPrimary, colors.etfGradient] },
  {
    label: 'Commodities',
    value: 1,
    color: [colors.commoditiesPrimary, colors.commoditiesGradient],
  },
];

const sampleTileChartDataMixed: TileChartData[] = [
  {
    label: 'Crypto',
    value: 25,
    color: [colors.cryptoPrimary, colors.cryptoGradient],
  },
  {
    label: 'Stocks',
    value: 16,
    color: [colors.stocksPrimary, colors.stocksGradient],
  },
  { label: 'ETF', value: 20, color: [colors.etfPrimary, colors.etfGradient] },
  {
    label: 'Commodities',
    value: 12,
    color: [colors.commoditiesPrimary, colors.commoditiesGradient],
  },
  {
    label: 'Countries',
    value: 14,
    color: [colors.countriesPrimary, colors.countriesGradient],
  },
  {
    label: 'People',
    value: 14,
    color: [colors.peoplePrimary, colors.peopleGradient],
  },
  {
    label: 'Indices',
    value: 12,
    color: [colors.indicesPrimary, colors.indicesGradient],
  },
  {
    label: 'Smart Portfolios',
    value: 15,
    color: [colors.smartPortfoliosPrimary, colors.smartPortfoliosGradient],
  },
  {
    label: 'Others',
    value: 18,
    color: [colors.otherPrimary, colors.otherGradient],
  },
];

const meta: Meta<{}> = {
  title: 'eToro-UI/Components/DataDisplay/TileChart/📖 Introduction',
  parameters: {
    notes: 'Complete guide for the TileChart component with live examples.',
  },
  decorators: [(Story) => <Story />],
};

export default meta;

export const Overview: StoryObj<{}> = {
  render: () => (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <EtText variant="display-main" style={styles.title}>
          TileChart
        </EtText>
        <EtText variant="heading-compact">
          Tile chart component for displaying categorical data with percentage allocation and customizable colors
        </EtText>
      </View>
      <View>
        <View>
          <EtText variant="label-primary-bold">Vertical example</EtText>
          <EtTileChart data={sampleTileChartDataByValue} />
        </View>

        <View>
          <EtText variant="label-primary-bold">Horizontal example</EtText>
          <EtTileChart data={sampleTileChartDataByValue} direction="horizontal" styles={{ height: 340 }} />
        </View>

        <View>
          <EtText variant="label-primary-bold">Mixed example</EtText>
          <EtTileChart data={sampleTileChartDataMixed} direction="mixed" styles={{ height: 340 }} />
        </View>
      </View>
    </ScrollView>
  ),
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  header: {
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 24,
  },
  title: {
    marginBottom: 8,
  },
});
