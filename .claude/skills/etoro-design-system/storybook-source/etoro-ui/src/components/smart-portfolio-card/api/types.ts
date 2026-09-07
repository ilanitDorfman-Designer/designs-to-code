import type { ChartDataApiEquity } from '@etoro/common/types';
import type { ReactNode } from 'react';
import type { ImageSourcePropType, StyleProp, ViewStyle } from 'react-native';

/**
 * Full-bleed background source for the card. At least one of
 * `backgroundImage` / `backgroundVideo` is required; both may be provided
 * (video takes precedence).
 */
export type EtSmartPortfolioCardBackground =
  | { backgroundImage: ImageSourcePropType; backgroundVideo?: string }
  | { backgroundImage?: ImageSourcePropType; backgroundVideo: string };

/**
 * Props for {@link EtSmartPortfolioCard}.
 *
 * Opinionated large media card (Figma DS node 63763:418679):
 * - `size="large"`
 * - full-bleed `backgroundImage` and/or `backgroundVideo` (at least one required)
 * - optional header: translucent badge (`label`) + trailing action (`headerEnd`)
 * - custom content: title + gain % / period / sparkline + description
 *   (not the shared eyebrow/title/description stack)
 */
export type EtSmartPortfolioCardProps = EtSmartPortfolioCardBackground & {
  /**
   * Optional header badge label (start of {@link EtMediaCard.Header}).
   * Renders via {@link EtMediaCard.Badge}.
   */
  label?: string;
  /** Optional header end action (e.g. watchlist / close icon button). */
  headerEnd?: ReactNode;
  /** Portfolio / chip title above the gain (e.g. `"Chip-Tech"`). */
  title: string;
  /**
   * Gain as a ratio (e.g. `0.1551` → `+15.51%`).
   * Same contract as {@link EtAssetCard} `changePercent`.
   */
  changePercent: number;
  /** Period caption under the gain (e.g. `"Last 24 hours"`). */
  periodLabel: string;
  /** Optional body copy under the stats row. */
  description?: string;
  /**
   * Optional sparkline series for {@link EtLineChart}.
   * Empty / omitted → chart is hidden.
   */
  chartData?: ChartDataApiEquity[];
  /**
   * Pause the background video when off-screen.
   * @default false
   */
  backgroundVideoPaused?: boolean;
  /** Press handler. */
  onPress?: () => void;
  /** Accessibility label for the root pressable. */
  accessibilityLabel?: string;
  /** Container style override. */
  style?: StyleProp<ViewStyle>;
  /** Test ID for the root. */
  testID?: string;
};
