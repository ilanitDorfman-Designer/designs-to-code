import { StyleSheet, View } from 'react-native';

import { eToroTheme } from '../../../../core/styles';
import { EtText } from '../../../../foundations/text';
import { EtButton } from '../../../button/et-button';
import { PriceMetrics } from '../api/types';
import { formatChange, formatPrice } from '../utils';

interface AssetPriceMetricsProps {
  /** Current asset price */
  currentPrice: number;
  /** Asset currency */
  currency?: string;
  /** Price metrics data */
  priceMetrics: PriceMetrics;
  /** Trade button text */
  tradeButtonText?: string;
  /** Colors from theme */
  colors: eToroTheme['colors'];
}

export function AssetPriceMetrics({ currentPrice, currency, priceMetrics, tradeButtonText = 'Trade', colors }: AssetPriceMetricsProps) {
  return (
    <View style={styles.priceContainer}>
      <View style={styles.priceLeft}>
        <View style={styles.priceItem}></View>
        <View style={styles.priceItem}>
          <EtText variant="heading-base" style={{ color: colors.textPrimaryNeutral }}>
            {formatPrice(currentPrice, currency)}
          </EtText>
          <EtText
            variant="body-tiny-medium"
            style={{
              color: priceMetrics.isPositive ? colors.actionBrandText : colors.actionBrandVarText,
            }}
          >
            {priceMetrics.isPositive ? '▲' : '▼'} {formatChange(priceMetrics.changeAmount, priceMetrics.changePercentage)}
          </EtText>
        </View>
      </View>
      <EtButton variant="primary-filled" size="small" onPress={priceMetrics.onTrade}>
        <EtButton.Label>{tradeButtonText}</EtButton.Label>
      </EtButton>
    </View>
  );
}

const styles = StyleSheet.create({
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  priceLeft: {
    flexDirection: 'row',
  },
  priceItem: {
    alignItems: 'flex-start',
  },
});
