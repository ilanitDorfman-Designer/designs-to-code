import type { ReactNode } from 'react';
import type { ImageSourcePropType, StyleProp, ViewStyle } from 'react-native';

import type { EtMediaCardSize, EtMediaCardVariant, MediaCardFooterOverlay, MediaCardFooterOverlayOpacity } from '../../media-card';

/**
 * Asset identity + market snapshot for {@link EtAssetCard}.
 *
 * Matches the app’s established instrument logo contract used across
 * watchlist / top-movers / `EtAssetInfo` / `InstrumentImages.svg`:
 * - `logoUrl` — CDN logo URI
 * - `backgroundColor` — brand colour used as the card fill when
 *   `variant="standard"` and no image/video override is passed
 *
 * Map BFF/API models at the render edge, e.g.:
 * ```ts
 * {
 *   logoUrl: images.svg?.uri ?? images['150x150']?.uri ?? '',
 *   backgroundColor: images.svg?.backgroundColor,
 *   symbol, name, price, changePercent, currency,
 * }
 * ```
 */
export interface EtAssetCardAsset {
  /** Ticker symbol, e.g. `"TSLA"`. */
  symbol: string;
  /** Optional display name / subtitle, e.g. `"Tesla Inc"`. */
  name?: string;
  /**
   * Instrument logo CDN URL (same role as `AssetIdentityData.logoUrl` /
   * `InfoAvatarData.source` / `InstrumentImages.svg.uri`).
   * Prefer URLs that embed brand hex (`…/ID_CC2914_FFFFFF.svg`) so colour
   * can be inferred when `backgroundColor` is omitted.
   */
  logoUrl: string;
  /**
   * Brand background colour from the asset logo metadata
   * (`InstrumentImages.svg.backgroundColor` / `InfoAvatarData.backgroundColor`).
   *
   * For `variant="standard"`, this is the default **card** fill when no
   * `backgroundImage` / `backgroundVideo` is passed on the card.
   * When omitted, inferred via `extractImageBackgroundColor(logoUrl)`.
   */
  backgroundColor?: string;
  /** Current price (absolute). */
  price: number;
  /** Currency code for price formatting, e.g. `"USD"`. */
  currency?: string;
  /**
   * Period change as a **decimal ratio** (e.g. `0.0435` → +4.35%).
   * Same contract as `EtNumber` `format="percentage"`.
   * Converted for {@link EtPrice.Change} (`changePercentage` expects percent units).
   */
  changePercent: number;
  /**
   * Absolute price change (e.g. `1.95`). Used by footer {@link EtPrice.Change}.
   * When omitted, derived as `price - referencePrice` where
   * `referencePrice = price / (1 + changePercent)` (asset page / watchlist pattern).
   */
  change?: number;
}

/**
 * Props for {@link EtAssetCard}.
 *
 * Medium / large compose `Header` / `Logo` / `Content` / `Footer` on
 * {@link EtMediaCard}. Card fill can be colour, image, or video.
 */
export interface EtAssetCardProps {
  /** Asset to display — see {@link EtAssetCardAsset}. */
  asset: EtAssetCardAsset;
  /** Card size. @default `'small'` */
  size?: EtMediaCardSize;
  /**
   * Defines both surface look and **text colour**. @default `'standard'`
   * - `standard` — fill = asset brand colour; text = `carbonStatic050`
   * - `bright` — fill = `carbonStatic050`; text = `carbonStatic900`
   * - `dark` — fill = `bgDarkSurface`; text = `carbonStatic050`
   *
   * Text colour is resolved from `variant` only (MediaCard context).
   */
  variant?: EtMediaCardVariant;
  /**
   * Optional full-bleed background image. Overrides asset brand colour fill
   * (still underlays `backgroundVideo` if both are set).
   */
  backgroundImage?: ImageSourcePropType;
  /** Optional full-bleed looping muted background video URI. */
  backgroundVideo?: string;
  /**
   * Pause the background video (e.g. when the card is off-screen).
   * Only applies when {@link backgroundVideo} is set.
   * @default false
   */
  backgroundVideoPaused?: boolean;
  /** Optional header label (medium / large) — renders {@link EtBadge} at the start. */
  label?: string;
  /**
   * Optional header end action (medium / large), e.g. {@link EtIconButton} / {@link EtButton}.
   * Placed at the trailing edge of {@link EtMediaCard.Header}.
   */
  headerEnd?: ReactNode;
  /**
   * Optional content eyebrow (medium / large) — small label above the title
   * inside the content strip (Figma “Trending Stock” recipe).
   */
  eyebrow?: string;
  /**
   * Optional content headline (medium / large) — primary title in the content strip.
   * Prefer this over stuffing a long headline into {@link description}.
   */
  title?: string;
  /**
   * Optional body copy (medium / large).
   * With `eyebrow` / `title`, renders as the tertiary subtitle under the headline;
   * alone, keeps the legacy single-paragraph content style.
   */
  description?: string;
  /**
   * Place the asset logo in the glass footer (next to symbol) instead of as a
   * background watermark.
   * @default `true` when `backgroundImage` / `backgroundVideo` is set; otherwise `false`.
   */
  logoInFooter?: boolean;
  /**
   * Glass footer overlay preset (medium / large).
   * - `media` — Carbon Neutral 900 static `#1B1E21` @ `0.15`
   * - `muted` — Carbon Neutral 500 `#999999` @ `0.1`
   *
   * When omitted, defaults from card `variant`: `standard` → `media`,
   * `bright` / `dark` → `muted`.
   */
  footerOverlay?: MediaCardFooterOverlay;
  /**
   * Override glass footer scrim colour (takes precedence over {@link footerOverlay}).
   */
  footerOverlayColor?: string;
  /**
   * Override glass footer scrim opacity (`0.1` | `0.15`).
   * Use with {@link footerOverlayColor} for fully custom scrims.
   */
  footerOverlayOpacity?: MediaCardFooterOverlayOpacity;
  /**
   * Style override for the glass footer root (`EtMediaCard.Footer`).
   */
  footerStyle?: StyleProp<ViewStyle>;
  /**
   * Progressive BG blur on the content strip (medium / large).
   * @default `true` when card has image / video / background logo; otherwise `false`.
   * Pass `true` / `false` to force enable / disable.
   */
  contentBlur?: boolean;
  /** Press handler for the glass footer (medium / large). */
  onFooterPress?: () => void;
  /** Press handler for the content region — price stack on small, body on medium / large. */
  onContentPress?: () => void;
  /**
   * @deprecated Use {@link onFooterPress} (medium / large) or {@link onContentPress} (small).
   */
  onPress?: () => void;
  /** Accessibility label for the pressable footer or content region. */
  accessibilityLabel?: string;
  /** Container style override. */
  style?: StyleProp<ViewStyle>;
  /** Test ID for the root. */
  testID?: string;
}
