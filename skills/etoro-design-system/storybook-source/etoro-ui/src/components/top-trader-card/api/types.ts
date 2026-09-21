import type { ReactNode } from 'react';
import type { ImageSourcePropType, StyleProp, ViewStyle } from 'react-native';

import type { EtUserData } from '../../data-display/user-info';

/**
 * Props for {@link EtTopTraderCard}.
 *
 * Opinionated large-image person card (Figma DS node 63763:418671):
 * - `size="large"`
 * - full-bleed `backgroundImage`
 * - content stack via {@link EtMediaCard.Content} (eyebrow + title + description)
 * - glass footer with {@link EtUserInfo} + rates ({@link EtNumber} + {@link EtPrice.Change})
 */
export interface EtTopTraderCardProps {
  /**
   * User identity for the glass footer — same shape as {@link EtUserInfo} `data`
   * (`avatar` / `title` / `subtitle`).
   */
  user: EtUserData;
  /**
   * Optional trader badge (e.g. PI/Pro crown) overlaid on the avatar via {@link EtAvatar.Badge}.
   */
  badge?: ReactNode;
  /** Full-bleed background image (required). */
  backgroundImage: ImageSourcePropType;
  /** Content eyebrow above the title. Pass localized copy from the feature edge. */
  eyebrow?: string;
  /** Primary headline in the content strip. */
  title: string;
  /** Optional tertiary description under the headline. */
  description?: string;
  /** Primary rate value shown in the footer (currency). */
  price: number;
  /** Currency code for the rate value. When omitted, the rate renders without a currency symbol. */
  currency?: string;
  /**
   * Relative change as a **decimal ratio** (e.g. `0.0005` → +0.05%).
   * Same contract as {@link EtAssetCard} `changePercent`.
   */
  changePercent: number;
  /**
   * Absolute price change (e.g. `0.09`). Used by footer {@link EtPrice.Change}.
   * When omitted, derived as `price - referencePrice` where
   * `referencePrice = price / (1 + changePercent)` (asset page / watchlist pattern).
   */
  change?: number;
  /** Optional header end action. */
  headerEnd?: ReactNode;
  /** Press handler. */
  onPress?: () => void;
  /** Accessibility label for the root pressable. */
  accessibilityLabel?: string;
  /** Container style override. */
  style?: StyleProp<ViewStyle>;
  /** Test ID for the root. */
  testID?: string;
}
