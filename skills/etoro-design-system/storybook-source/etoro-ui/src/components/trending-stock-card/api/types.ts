import type { ReactNode } from 'react';
import type { ImageSourcePropType, StyleProp, ViewStyle } from 'react-native';

import type { EtAssetCardAsset } from '../../asset-card';

/**
 * Props for {@link EtTrendingStockCard}.
 *
 * Opinionated large-image asset card (Figma DS node 63763:418667):
 * - `size="large"`
 * - full-bleed `backgroundImage`
 * - content stack: eyebrow + title (+ optional description subtitle)
 * - muted/dark glass footer + content blur
 * - logo in footer (default for image fills)
 * - no header badge — "Trending Stock" lives in the content eyebrow
 */
export interface EtTrendingStockCardProps {
  /** Asset to display — same contract as {@link EtAssetCard}. */
  asset: EtAssetCardAsset;
  /** Full-bleed background image (required for this card recipe). */
  backgroundImage: ImageSourcePropType;
  /** Content eyebrow above the headline. @default `'Trending Stock'` */
  eyebrow?: string;
  /** Primary headline in the content strip (Figma display/body semibold). */
  title: string;
  /** Optional tertiary subtitle under the headline. */
  description?: string;
  /** Optional header end action (e.g. dismiss / watchlist). */
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
