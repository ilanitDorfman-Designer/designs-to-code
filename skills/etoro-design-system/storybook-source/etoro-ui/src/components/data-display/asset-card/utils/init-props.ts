import { EtAssetCardProps } from '../api';

export function initProps(props: EtAssetCardProps): EtAssetCardProps {
  return {
    ...props,
    asset: {
      ...props.asset,
      symbol: props.asset?.symbol || '',
      name: props.asset?.name || '',
      currentPrice: props.asset?.currentPrice || 0,
      currency: props.asset?.currency || undefined,
      logo: props.asset?.logo || '',
      exchange: props.asset?.exchange || undefined,
    },
    priceMetrics: {
      ...props.priceMetrics,
      changeAmount: props.priceMetrics?.changeAmount || 0,
      changePercentage: props.priceMetrics?.changePercentage || 0,
      isPositive: props.priceMetrics?.isPositive || false,
      onTrade: props.priceMetrics?.onTrade || undefined,
    },
    marketMetrics: {
      ...props.marketMetrics,
      marketCap: props.marketMetrics?.marketCap || undefined,
      volume: props.marketMetrics?.volume || undefined,
      peRatio: props.marketMetrics?.peRatio || undefined,
    },
    display: {
      ...props.display,
      compact: props.display?.compact || false,
      minimal: props.display?.minimal || false,
      description: props.display?.description || undefined,
      lastUpdated: props.display?.lastUpdated || undefined,
      categories: props.display?.categories || [],
    },
    chart: {
      ...props.chart,
      chartData: props.chart?.chartData || [],
      compactStats: props.chart?.compactStats || undefined,
    },
    interaction: {
      ...props.interaction,
      haptics: props.interaction?.haptics || true,
      showAddButton: props.interaction?.showAddButton || false,
      isAdded: props.interaction?.isAdded || false,
      addButtonText: props.interaction?.addButtonText || 'Add',
      addedButtonText: props.interaction?.addedButtonText || 'Added',
      showCloseButton: props.interaction?.showCloseButton || false,
      showTradeButton: props.interaction?.showTradeButton || false,
      tradeButtonText: props.interaction?.tradeButtonText || 'Trade',
      onPress: props.interaction?.onPress || undefined,
      onClose: props.interaction?.onClose || undefined,
      onTrade: props.interaction?.onTrade || undefined,
      onAdd: props.interaction?.onAdd || undefined,
    },
    style: {
      ...props.style,
    },
    accessibility: {
      ...props.accessibility,
      testID: props.accessibility?.testID || undefined,
      accessibilityLabel: props.accessibility?.accessibilityLabel || undefined,
    },
  };
}
