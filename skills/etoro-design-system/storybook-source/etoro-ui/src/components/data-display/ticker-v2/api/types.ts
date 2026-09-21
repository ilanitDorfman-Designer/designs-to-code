import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

/**
 * Data model for an individual ticker item
 */
export interface TickerItem {
  instrumentId: number;
  name: string;
  currentPrice: number;
  dailyChange: number | null;
  currencySymbol?: string;
  minPrecision?: number;
  maxPrecision?: number;
  // Additional fields for navigation
  displayName?: string;
  symbolFull?: string;
  typeId?: number;
  exchangeId?: number;
  stocksIndustryId?: number;
  imageUri?: string;
}

/**
 * Context value shared with all ticker subcomponents
 */
export interface TickerContextValue {
  /** Resolved text color from theme */
  textColor: string;
  /** Color for positive daily changes */
  positiveColor: string;
  /** Color for negative daily changes */
  negativeColor: string;
  /** Animation speed multiplier */
  speed: number;
  /** Callback when a ticker item name is pressed */
  onItemPress?: (item: TickerItem) => void;
}

/**
 * Props for EtTicker.Item subcomponent
 */
export interface TickerItemProps {
  /** Ticker item data to display */
  item: TickerItem;
  /** Test identifier */
  testID?: string;
}

/**
 * Props for EtTicker.Content subcomponent
 */
export interface TickerContentProps {
  /** Array of ticker items to render */
  items: TickerItem[];
}

/**
 * Props for EtTicker.Gradient subcomponent
 */
export interface TickerGradientProps {
  /** Width of each gradient edge in pixels */
  width?: number;
  /** If true, only renders the right gradient (e.g. when EtTicker.Start is present) */
  rightOnly?: boolean;
  /** Content to apply the mask to (when used as a wrapper) */
  children?: ReactNode;
}

/**
 * Props for EtTicker.Start / EtTicker.End subcomponents.
 * Renders a fixed slot at the start or end of the ticker row.
 */
export interface TickerSlotProps {
  /** Content to render in the slot (e.g. filter icon wrapped in Pressable) */
  children: ReactNode;
  /** Additional styles for the slot wrapper */
  style?: StyleProp<ViewStyle>;
  /** Test identifier */
  testID?: string;
}

/**
 * Main EtTicker props
 *
 * Supports two usage patterns:
 * - **Simple**: Pass `items` prop and the component renders everything internally
 * - **Compound**: Pass children (`EtTicker.Content`, `EtTicker.Gradient`, etc.) for full control
 *
 * @example Simple usage
 * ```tsx
 * <EtTicker items={data} speed={0.5} />
 * ```
 *
 * @example Compound usage
 * ```tsx
 * <EtTicker speed={0.5}>
 *   <EtTicker.Gradient>
 *     <EtTicker.Marquee withGesture>
 *       <EtTicker.Content items={data} />
 *     </EtTicker.Marquee>
 *   </EtTicker.Gradient>
 * </EtTicker>
 * ```
 */
export interface EtTickerProps {
  /**
   * Array of ticker items to display.
   * Used in simple mode; ignored when children are provided.
   */
  items?: TickerItem[];
  /**
   * Animation speed multiplier (higher values = faster scrolling).
   * @default 0.25
   */
  speed?: number;
  /**
   * Enable gradient fade effect at the edges.
   * Only used in simple mode (no children).
   * @default true
   */
  gradient?: boolean;
  /** Additional style for the ticker container */
  style?: StyleProp<ViewStyle>;
  /** Test identifier */
  testID?: string;
  /** Accessibility label for the ticker */
  accessibilityLabel?: string;
  /** Accessibility hint for the ticker */
  accessibilityHint?: string;
  /**
   * Callback when a ticker item name is pressed.
   * Receives the full TickerItem data for navigation or tracking.
   */
  onItemPress?: (item: TickerItem) => void;
  /**
   * Compound children for advanced composition.
   * When provided, `items` and `gradient` props are ignored.
   */
  children?: ReactNode;
}
