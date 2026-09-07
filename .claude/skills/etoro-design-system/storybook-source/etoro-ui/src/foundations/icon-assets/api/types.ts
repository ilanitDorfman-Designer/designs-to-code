import { StyleProp, ViewStyle } from 'react-native';

// Valid icon names (extracted from the current component)
export type IconName =
  | 'allAccounts'
  | 'arrowGain'
  | 'arrowLoss'
  | 'arrowUpFill'
  | 'arrowDownFill'
  | 'barChart'
  | 'map'
  | 'arrow'
  | 'plus'
  | 'plusLine'
  | 'user'
  | 'settings'
  | 'logout'
  | 'chevronRight'
  | 'chevronLeft'
  | 'chevronDown'
  | 'chevronUp'
  | 'creditCard'
  | 'heart'
  | 'star'
  | 'chat'
  | 'apple'
  | 'mail'
  | 'close'
  | 'closeSmall'
  | 'deleteText'
  | 'wallet'
  | 'portfolio'
  | 'popular-investor'
  | 'discover'
  | 'watchlist'
  | 'home'
  | 'search'
  | 'searchLine'
  | 'faceId'
  | 'fingerPrint'
  | 'etorianClub'
  | 'inviteFriends'
  | 'support'
  | 'menu'
  | 'display'
  | 'trading'
  | 'notification'
  | 'privacy'
  | 'coins'
  | 'minus'
  | 'deposit'
  | 'more'
  | 'calendar'
  | 'academy'
  | 'eyeOff'
  | 'eye'
  | 'appleDark'
  | 'metaDark'
  | 'google'
  | 'googleDark'
  | 'gainers'
  | 'losers'
  | 'moreVertical'
  | 'news'
  | 'upcomingEvent'
  | 'yeild'
  | 'btc'
  | 'ai'
  | 'watched'
  | 'like'
  | 'comment'
  | 'share'
  | 'switchUnits'
  | 'torii'
  | 'checked'
  | 'checkCircle'
  | 'checkLine'
  | 'triangleUp'
  | 'triangleDown'
  | 'trade'
  | 'priceAlert'
  | 'pro-investor'
  | 'loader'
  | 'trash'
  | 'expand'
  | 'bullishArrow'
  | 'afterHours'
  | 'bullish'
  | 'v'
  | 'error'
  | 'copy'
  | 'sortDescending'
  | 'caretUp'
  | 'caretDown'
  | 'exclamationCircleLine'
  | 'infoCircleLine'
  | 'infoCircleFill'
  | 'history'
  | 'wifiOff'
  | 'wifiSlow'
  | 'issueReport';

// Icon categories for better organization
export type IconCategory = 'navigation' | 'trading' | 'user' | 'actions' | 'brand' | 'media' | 'ui';

// Standard icon sizes
export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | number;

// Grouped configuration interfaces
export interface IconConfig {
  /** Icon name from the available set */
  iconName: IconName;
  /**
   * Per-usage override for RTL auto-mirroring (matches EtIconV2's prop).
   * Registered navigation glyphs (chevrons, back/forward) mirror automatically
   * in RTL; pass `false` to keep one physical, or `true` to force-mirror an
   * unregistered glyph. Has no effect in LTR.
   */
  flipInRTL?: boolean;
}

export interface IconAppearanceConfig {
  /** Icon size (predefined or custom number) */
  size?: IconSize;
  /** Icon color override */
  color?: string;
}

export interface IconStyleConfig {
  /** Whether icon supports fill */
  hasFill?: boolean;
  /** Fill color for supported icons */
  fill?: string;
  /** Container style */
  style?: StyleProp<ViewStyle>;
}

export interface IconAccessibilityConfig {
  /** Test ID for testing */
  testID?: string;
  /** Accessibility label */
  accessibilityLabel?: string;
  /** Accessibility hint */
  accessibilityHint?: string;
  /** Accessibility role */
  accessibilityRole?: 'image' | 'button' | 'none';
}

export interface IconAdvancedConfig {
  /** Custom props passed to the underlying SVG component */
  svgProps?: Record<string, unknown>;
  /** Whether to cache the icon component */
  cache?: boolean;
}

// Enhanced grouped props interface
export interface EtoroIconProps {
  /** Icon configuration (required) */
  icon: IconConfig;
  /** Appearance configuration */
  appearance?: IconAppearanceConfig;
  /** Style configuration */
  style?: IconStyleConfig;
  /** Accessibility configuration */
  accessibility?: IconAccessibilityConfig;
  /** Advanced configuration */
  advanced?: IconAdvancedConfig;
}

// Icon metadata interface
export interface IconMetadata {
  name: IconName;
  category: IconCategory;
  supportsFill: boolean;
  defaultSize: number;
  keywords: string[];
}
