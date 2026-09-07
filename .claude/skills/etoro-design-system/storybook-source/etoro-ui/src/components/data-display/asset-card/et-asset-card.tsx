import { Pressable, StyleSheet, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';

import { useEtoroTheme } from '../../../core/hooks';
import { EtText } from '../../../foundations/text';
import { EtAssetCardProps } from './api';
import { AssetChart, AssetHeader, AssetPriceMetrics, CategoryBadges } from './components';
import { useAssetCardHandlers } from './hooks';
import { generateMockChartData, initProps } from './utils';

/** @deprecated not actively maintained — use EtAssetCard from `components/asset-card` (EtMediaCard-based). Kept as EtLegacyAssetCard export. */
export function EtAssetCard(props: EtAssetCardProps) {
  const { asset, priceMetrics, display, chart, interaction, style, accessibility } = initProps(props);
  const { colors } = useEtoroTheme();
  const selectedValue = useSharedValue(0);

  // Use centralized handlers with haptic feedback
  const { handlePress, handleClose, handleAdd } = useAssetCardHandlers({
    onPress: interaction?.onPress,
    onClose: interaction?.onClose,
    onTrade: interaction?.onTrade,
    onAdd: interaction?.onAdd,
    haptics: interaction?.haptics,
  });

  // Get chart data (provided or generated)
  const finalChartData =
    chart?.chartData ||
    (display?.compact && chart?.compactStats ? generateMockChartData(asset.currentPrice, chart.compactStats.changePercentage > 0) : []);

  return (
    <Pressable
      style={[
        styles.card,
        display?.compact && styles.compactCard,
        display?.minimal && styles.minimalCard,
        {
          backgroundColor: colors.bgNeutralQuaternary,
          borderColor: colors.dividerPrimary,
          shadowColor: colors.dividerPrimary,
        },
        style?.style,
      ]}
      onPress={interaction?.onPress ? handlePress : undefined}
      testID={accessibility?.testID}
      accessibilityLabel={accessibility?.accessibilityLabel}
      accessibilityRole="button"
    >
      {/* Header Section */}
      <AssetHeader
        asset={asset}
        colors={colors}
        compact={display?.compact}
        minimal={display?.minimal}
        showCloseButton={interaction?.showCloseButton}
        onClose={handleClose}
        showAddButton={interaction?.showAddButton}
        onAdd={handleAdd}
        isAdded={interaction?.isAdded}
        addButtonText={interaction?.addButtonText}
        addedButtonText={interaction?.addedButtonText}
      />

      {/* Category Badges */}
      <CategoryBadges categories={display?.categories || []} colors={colors} />

      {/* Description Section - Only show in regular mode */}
      {!display?.compact && display?.description && (
        <View style={styles.content}>
          <EtText variant="body-base-regular" style={[styles.contentText, { color: colors.textPrimaryNeutral }]}>
            {display?.description}
          </EtText>
        </View>
      )}

      {/* Chart Section - Only show in compact mode */}
      {display?.compact && finalChartData.length > 0 && (
        <AssetChart
          currentPrice={asset.currentPrice}
          currency={asset.currency}
          chartData={finalChartData}
          compactStats={chart?.compactStats}
          colors={colors}
          selectedValue={selectedValue}
        />
      )}

      {/* Timestamp Footer - Only show in regular mode */}
      {!display?.compact && display?.lastUpdated && (
        <View>
          <EtText variant="body-tiny-regular" style={[styles.contentText, { color: colors.textPrimaryNeutral }]}>
            {display?.lastUpdated}
          </EtText>
        </View>
      )}

      {/* Price Metrics - Only show in regular mode */}
      {!display?.compact && priceMetrics && !display?.minimal && (
        <AssetPriceMetrics
          currentPrice={asset.currentPrice}
          currency={asset.currency}
          priceMetrics={priceMetrics}
          tradeButtonText={interaction?.tradeButtonText}
          colors={colors}
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 20,
    marginVertical: 6,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  compactCard: {
    width: 200,
    paddingBottom: 0,
  },
  minimalCard: {
    paddingVertical: 24,
    paddingHorizontal: 12,
    width: 180,
  },
  content: {
    marginBottom: 12,
  },
  contentText: {
    lineHeight: 25,
  },
});
