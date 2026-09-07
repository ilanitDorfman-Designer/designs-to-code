import { StyleProp, ViewStyle } from 'react-native';

// Core data types
export interface AssetInfo {
  symbol: string;
  name: string;
  currentPrice: number;
  currency?: string;
  logo: string | { uri: string };
  exchange?: string;
}

export interface CategoryBadge {
  label: string;
  color?: string;
  backgroundColor?: string;
}

export interface PriceMetrics {
  changeAmount: number;
  changePercentage: number;
  isPositive: boolean;
  onTrade?: () => void;
}

export interface MarketMetrics {
  marketCap?: string;
  volume?: string;
  peRatio?: number;
}

export interface ChartData {
  timestamp: string;
  price: number;
}

export interface CompactStats {
  changePercentage: number;
  changePeriod: string;
  marketCap?: string;
  volume?: string;
}

// Grouped configuration types
export interface AssetDisplayConfig {
  /** Enable compact chart mode */
  compact?: boolean;
  /** Enable minimal mode */
  minimal?: boolean;
  /** Asset description/content */
  description?: string;
  /** Last updated timestamp */
  lastUpdated?: string;
  /** Optional category badges */
  categories?: CategoryBadge[];
}

export interface AssetChartConfig {
  /** Chart data for compact mode */
  chartData?: ChartData[];
  /** Compact stats for chart cards */
  compactStats?: CompactStats;
}

export interface AssetInteractionConfig {
  /** Enable haptic feedback */
  haptics?: boolean;
  /** Show add button in compact mode */
  showAddButton?: boolean;
  /** Add button handler */
  onAdd?: () => void;
  /** Whether item is already added */
  isAdded?: boolean;
  /** Custom add button text */
  addButtonText?: string;
  /** Custom added button text */
  addedButtonText?: string;

  /** Show close button */
  showCloseButton?: boolean;
  /** Close button handler */
  onClose?: () => void;

  /** Show trade button instead of close button */
  showTradeButton?: boolean;
  /** Trade button handler */
  onTrade?: () => void;
  /** Custom trade button text */
  tradeButtonText?: string;

  /** Card press handler */
  onPress?: () => void;
}

export interface AssetStyleConfig {
  /** Container style */
  style?: StyleProp<ViewStyle>;
}

export interface AssetAccessibilityConfig {
  /** Test ID for testing */
  testID?: string;
  /** Accessibility label */
  accessibilityLabel?: string;
}
export interface EtAssetCardProps {
  /** Core asset information */
  asset: AssetInfo;
  /** Optional price change metrics */
  priceMetrics?: PriceMetrics;
  /** Optional market metrics */
  marketMetrics?: MarketMetrics;

  /** Display configuration */
  display?: AssetDisplayConfig;
  /** Chart configuration */
  chart?: AssetChartConfig;
  /** Interaction configuration */
  interaction?: AssetInteractionConfig;
  /** Style configuration */
  style?: AssetStyleConfig;
  /** Accessibility configuration */
  accessibility?: AssetAccessibilityConfig;
}
