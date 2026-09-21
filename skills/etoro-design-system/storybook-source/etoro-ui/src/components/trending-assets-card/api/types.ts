import type { ReactNode } from 'react';
import type { ImageSourcePropType, StyleProp, ViewStyle } from 'react-native';

/**
 * Asset logo shown in the {@link EtTrendingAssetsCard} footer row.
 */
export interface EtTrendingAssetsCardAsset {
  /** Instrument symbol (used for a11y / fallback). */
  symbol: string;
  /** Instrument logo CDN URL. */
  logoUrl: string;
  /** Optional brand fill behind the logo (instrument avatar). */
  backgroundColor?: string;
}

/**
 * Full-bleed background source for the card. At least one of
 * `backgroundImage` / `backgroundVideo` is required; both may be provided
 * (video takes precedence).
 */
export type EtTrendingAssetsCardBackground =
  | { backgroundImage: ImageSourcePropType; backgroundVideo?: string }
  | { backgroundImage?: ImageSourcePropType; backgroundVideo: string };

/**
 * Props for {@link EtTrendingAssetsCard}.
 *
 * Opinionated large media card (Figma DS node 63763:418675):
 * - `size="large"`
 * - full-bleed `backgroundImage` and/or `backgroundVideo` (at least one required)
 * - content stack via {@link EtMediaCard.Content} (eyebrow + title + description)
 * - glass footer with a row of asset icons + optional `+N` overflow pill
 */
export type EtTrendingAssetsCardProps = EtTrendingAssetsCardBackground & {
  /** Related assets rendered as logos in the glass footer. */
  assets: EtTrendingAssetsCardAsset[];
  /**
   * Max logos shown before the overflow pill.
   * @default 5
   */
  maxVisible?: number;
  /** Content eyebrow above the title. Pass localized copy from the feature edge. */
  eyebrow?: string;
  /** Primary headline in the content strip. */
  title: string;
  /** Optional tertiary description under the headline. */
  description?: string;
  /** Optional header end action. */
  headerEnd?: ReactNode;
  /**
   * Pause the background video when off-screen.
   * @default false
   */
  backgroundVideoPaused?: boolean;
  /** Press handler. */
  onPress?: () => void;
  /**
   * Handler for the `+N` overflow pill.
   * When provided, the consumer controls the overflow interaction (e.g. navigate to a list).
   * When omitted, tapping `+N` expands the footer in place into a horizontal carousel of all logos.
   */
  onOverflowPress?: () => void;
  /** Accessibility label for the root pressable. */
  accessibilityLabel?: string;
  /** Container style override. */
  style?: StyleProp<ViewStyle>;
  /** Test ID for the root. */
  testID?: string;
};
