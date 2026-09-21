import { StyleSheet, View } from 'react-native';
import { SharedValue } from 'react-native-reanimated';

import { eToroTheme } from '../../../../core/styles';
import { EtText } from '../../../../foundations/text';
import { EtLineChart } from '../../line-chart/et-line-chart';
import { ChartData, CompactStats } from '../api/types';
import { formatChange, formatPrice } from '../utils';

interface AssetChartProps {
  /** Asset current price */
  currentPrice: number;
  /** Asset currency */
  currency?: string;
  /** Chart data */
  chartData: ChartData[];
  /** Compact stats for display */
  compactStats?: CompactStats;
  /** Colors from theme */
  colors: eToroTheme['colors'];
  /** Selected value for chart interaction */
  selectedValue: SharedValue<number>;
}

export function AssetChart({ currentPrice, currency, chartData, compactStats, colors, selectedValue }: AssetChartProps) {
  if (!chartData || chartData.length === 0) return null;

  const isPositive = compactStats?.changePercentage && compactStats.changePercentage >= 0;

  return (
    <>
      {/* Asset Price Display */}
      <View style={styles.priceContainer}>
        <EtText variant="heading-base" style={{ color: colors.textPrimaryNeutral }}>
          {formatPrice(currentPrice, currency)}
        </EtText>
        <EtText
          variant="body-tiny-regular"
          style={{
            color: isPositive ? colors.actionBrandText : colors.actionBrandVarText,
          }}
        >
          {isPositive ? '▲' : '▼'} {formatChange(compactStats?.changePercentage || 0, compactStats?.changePercentage || 0)}
        </EtText>
      </View>

      {/* Chart Display */}
      <View style={styles.chartContainer}>
        <EtLineChart
          data={chartData.map((d) => ({
            timestamp: d.timestamp,
            equity: d.price,
          }))}
          width={215}
          height={80}
          balance={isPositive ? 'positive' : 'negative'}
          selectedValue={selectedValue}
          isInteractive={false}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  priceContainer: {
    justifyContent: 'center',
    flexDirection: 'column',
    paddingVertical: 0,
    alignItems: 'center',
  },
  chartContainer: {
    alignItems: 'center',
  },
});
