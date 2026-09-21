import { StyleProp, ViewStyle } from 'react-native';

export interface TickerItem {
  instrumentId: number; // For tracking
  name: string; // Display name (e.g., "BTC", "SPX500")
  currentPrice: number; // Current price of asset
  dailyChange: number; // Daily change percentage (can be positive or negative)
  navigationUrl: string; // URL for navigation to the asset
  currencySymbol?: string; // Currency symbol (default: '$')
  minPrecision?: number; // Minimum decimal places
  maxPrecision?: number; // Maximum decimal places
}

export interface TickerThemeColors {
  readonly textSecondaryNeutral: string;
  readonly statusPositive: string;
  readonly statusNegative: string;
}

export interface TickerItemProps {
  item: TickerItem;
  colors: TickerThemeColors;
  testID?: string;
}

export interface TickerContentProps {
  items: TickerItem[];
  colors: TickerThemeColors;
}

export interface TickerAccessibilityConfig {
  /**
   * Accessibility label for the ticker component
   * @default "Financial ticker displaying stock prices and changes"
   */
  accessibilityLabel?: string;
  /**
   * Additional accessibility hint
   * @default "Swipe to interact with scrolling ticker"
   */
  accessibilityHint?: string;
  /**
   * Test identifier for testing and automation
   */
  testID?: string;
}

export interface EtTickerProps {
  /**
   * Array of ticker items to display
   */
  tickersData: TickerItem[];
  /**
   * Animation speed (higher values = faster scrolling)
   * Range: 0.1 to 2.0
   * @default 0.5
   */
  speed?: number;
  /**
   * Additional style for the ticker
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Accessibility configuration
   */
  accessibility?: TickerAccessibilityConfig;
  /**
   * Enable gradient fade effect at the edges
   * Creates a smooth fade-in/fade-out effect on the left and right edges
   * @default true
   */
  gradient?: boolean;
}
