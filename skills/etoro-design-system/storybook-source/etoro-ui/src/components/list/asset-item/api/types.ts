import type { ImageProps } from 'expo-image';
import type { ReactElement, ReactNode } from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

import type { AvatarMarketStatus } from '../../../social/avatar';
import type { BadgeColor } from '../../../status/badge';

// ========== Slot Identity ==========

/**
 * Slot type identifier used for runtime slot detection.
 * Stored as a static `__SLOT_TYPE` property on each subcomponent so it
 * survives minification (unlike `displayName`, which is a debug-only aid).
 */
export type SlotType = 'logo' | 'content' | 'symbol' | 'name' | 'label' | 'price' | 'change' | 'trailing' | 'divider' | 'skeleton' | 'rate-chip';

// ========== Size & Sentiment ==========

/** Size variant. Controls vertical padding and logo size. */
export type AssetItemSize = 'large' | 'small';

/**
 * Layout variant for the row. Controls where `Change` renders and which
 * subcomponents are honored.
 *
 * - `'default'`: classic row — `Logo → Content → Label → Price/Change → Trailing`.
 * - `'trading-view'`: `Change` renders under the symbol, `Price` and `Trailing`
 *   are ignored (warned in dev), and `RateChip` siblings are rendered as a
 *   horizontal pair on the right (e.g. Buy/Sell quotes).
 */
export type AssetItemLayout = 'default' | 'trading-view';

/** Sentiment for `EtAssetItem.Change` and `EtAssetItem.RateChip`. Drives the color via theme tokens. */
export type ChangeSentiment = 'positive' | 'negative' | 'neutral';

/** Skeleton loading variant. */
export type AssetItemSkeletonVariant = 'symbol-only' | '2-lines' | 'rate-chips';

// ========== Subcomponent Props ==========

/** Props for `EtAssetItem.Logo`. Renders a square `EtAvatar` (instrument variant). */
export interface AssetItemLogoProps {
  /** Image source URI. Pass `undefined` to render a placeholder background. */
  source?: string;
  /** Fallback content rendered by the underlying avatar while the logo is unavailable. */
  fallback?: ReactNode;
  /** Explicit avatar background color for instrument SVGs whose URL does not encode one. */
  imageBackgroundColor?: string;
  /** Optional market-status dot rendered on top of the logo. */
  marketStatus?: AvatarMarketStatus;
  /** Background ring color around the optional market-status dot. */
  marketStatusBackgroundColor?: string;
  /** Test ID for the optional market-status dot. */
  marketStatusTestID?: string;
  /** Container style override */
  style?: StyleProp<ViewStyle>;
  /** Test ID for testing */
  testID?: string;
  /** Forwarded onError handler from the underlying image */
  onError?: ImageProps['onError'];
  /** Optional accessibility label for the image */
  accessibilityLabel?: string;
}

/** Props for `EtAssetItem.Content`. Vertical stack containing Symbol/Name. */
export interface AssetItemContentProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/** Props for `EtAssetItem.Symbol`. Primary line; semibold, single-line, ellipsized. */
export interface AssetItemSymbolProps {
  children: ReactNode;
  style?: StyleProp<TextStyle>;
  testID?: string;
}

/** Props for `EtAssetItem.Name`. Secondary line; tertiary text, single-line, ellipsized. */
export interface AssetItemNameProps {
  children: ReactNode;
  style?: StyleProp<TextStyle>;
  testID?: string;
}

/**
 * Props for `EtAssetItem.Label`.
 *
 * Tailored, opinionated middle-slot pill. Internally renders `EtBadge` with
 * `size="small"`. Public API is intentionally narrow so consumers cannot drift
 * from the design system.
 */
export interface AssetItemLabelProps {
  /** Text content displayed inside the pill */
  children: string;
  /** Color variant from the design system. Default: `'neutral'` */
  color?: BadgeColor;
  /** Container style override */
  style?: StyleProp<ViewStyle>;
  /** Test ID for testing */
  testID?: string;
}

/** Props for `EtAssetItem.Price`. Right-aligned formatted price string. */
export interface AssetItemPriceProps {
  /** Pre-formatted price string (e.g. "$186.79") */
  value: string;
  /** Text style override */
  style?: StyleProp<TextStyle>;
  /** Test ID for testing */
  testID?: string;
}

/** Props for `EtAssetItem.Change`. Right-aligned formatted change string with sentiment color. */
export interface AssetItemChangeProps {
  /** Pre-formatted change string (e.g. "1.95 (-1.03%)"). Consumers control formatting. */
  value: string;
  /** Sentiment driving the color. Default: `'neutral'` */
  sentiment?: ChangeSentiment;
  /**
   * Whether the label auto-shrinks to fit its column via iOS
   * `adjustsFontSizeToFit` (down to a `0.75` `minimumFontScale`). Defaults to
   * `true` in the `'trading-view'` layout and `false` in `'default'`.
   *
   * Pass `false` when the value is already sized to fit statically: iOS can latch
   * a single Text view to a tiny scale on a degenerate first layout pass and
   * never recompute it, rendering that one row illegibly small (PE-814).
   */
  shrinkToFit?: boolean;
  /** Text style override */
  style?: StyleProp<TextStyle>;
  /** Test ID for testing */
  testID?: string;
}

/** Props for `EtAssetItem.Trailing`. Arbitrary right-side slot (replaces the old `rightElement`). */
export interface AssetItemTrailingProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/**
 * Props for `EtAssetItem.RateChip`.
 *
 * Display-only sentiment-colored pill rendered in the right-hand slot of the
 * `'trading-view'` layout. Compose two of them inside `EtAssetItem` (typically
 * a Buy and a Sell rate) — they will be laid out horizontally with a fixed gap.
 */
export interface AssetItemRateChipProps {
  /** Pre-formatted value displayed inside the chip (e.g. `"11756.62"`). */
  value: string;
  /** Sentiment driving the chip background and text color. Default: `'neutral'`. */
  sentiment?: ChangeSentiment;
  /** Optional caption rendered above the value (e.g. `"Buy"`, `"Sell"`). */
  label?: string;
  /** Container style override */
  style?: StyleProp<ViewStyle>;
  /** Test ID for testing */
  testID?: string;
}

/** Props for `EtAssetItem.Divider`. Hairline separator below the row. */
export interface AssetItemDividerProps {
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/** Props for `EtAssetItem.Skeleton`. Loading placeholder; size inherited from parent. */
export interface AssetItemSkeletonProps {
  /** Skeleton layout variant. Default: `'2-lines'` */
  variant?: AssetItemSkeletonVariant;
  /** Vertical padding size. Defaults to the parent `EtAssetItem` size. */
  size?: AssetItemSize;
  /** Container style override */
  style?: StyleProp<ViewStyle>;
  /** Test ID for testing */
  testID?: string;
}

// ========== Children Type ==========

/** Acceptable children for `EtAssetItem`. */
export type EtAssetItemChildren = ReactElement | Array<ReactElement | null | false | undefined> | null | false | undefined;

// ========== Root Props ==========

/**
 * Props for `EtAssetItem`.
 *
 * @example Basic
 * ```tsx
 * <EtAssetItem size="large" onPress={openAsset}>
 *   <EtAssetItem.Logo source={asset.logoUri} />
 *   <EtAssetItem.Content>
 *     <EtAssetItem.Symbol>AAPL</EtAssetItem.Symbol>
 *     <EtAssetItem.Name>Apple Inc</EtAssetItem.Name>
 *   </EtAssetItem.Content>
 *   <EtAssetItem.Price value="$186.79" />
 *   <EtAssetItem.Change value="1.95 (-1.03%)" sentiment="negative" />
 * </EtAssetItem>
 * ```
 *
 * @example With label and trailing element
 * ```tsx
 * <EtAssetItem size="large">
 *   <EtAssetItem.Logo source={asset.logoUri} />
 *   <EtAssetItem.Content>
 *     <EtAssetItem.Symbol>META</EtAssetItem.Symbol>
 *   </EtAssetItem.Content>
 *   <EtAssetItem.Label color="neutral">Edited</EtAssetItem.Label>
 *   <EtAssetItem.Trailing>
 *     <EtButton ... />
 *   </EtAssetItem.Trailing>
 * </EtAssetItem>
 * ```
 *
 * @example Loading
 * ```tsx
 * <EtAssetItem size="large">
 *   <EtAssetItem.Skeleton variant="2-lines" />
 *   <EtAssetItem.Divider />
 * </EtAssetItem>
 * ```
 */
export interface EtAssetItemProps {
  /** Compound subcomponents (Logo, Content, Symbol, Name, Label, Price, Change, Trailing, RateChip, Divider, Skeleton). */
  children?: EtAssetItemChildren;
  /** Size variant. Default: `'large'`. */
  size?: AssetItemSize;
  /**
   * Layout variant. Default: `'default'`.
   *
   * - `'default'`: classic row.
   * - `'trading-view'`: `Change` renders under the symbol; `RateChip` siblings
   *   replace the right-hand price column. `Price` and `Trailing` are ignored.
   */
  layout?: AssetItemLayout;
  /** When `true`, lowers opacity and disables press handling. Default: `false`. */
  disabled?: boolean;
  /** Press handler for the row. When set, the row is rendered as a `Pressable`. */
  onPress?: () => void;
  /** Container style override */
  style?: StyleProp<ViewStyle>;
  /** Test ID for testing */
  testID?: string;
  /**
   * Accessibility label for the row. Required when `onPress` is set so screen
   * readers announce the row as a button; pass the symbol or a richer string.
   */
  accessibilityLabel?: string;
  /** Optional accessibility hint */
  accessibilityHint?: string;
}
