import type { ReactElement, ReactNode } from 'react';
import type { DimensionValue, ImageSourcePropType, StyleProp, TextStyle, ViewStyle } from 'react-native';

import type { MediaCardFooterOverlay, MediaCardSizeKey } from '../utils';

export type { MediaCardFooterOverlay } from '../utils';

// ============================================================================
// Enums & Unions
// ============================================================================

/**
 * Card size — Figma DS Card sizes (node 38716:443435).
 * - `small` — 128×164, logo + title + subtitle (asset ticker card)
 * - `medium` — 327×230, optional header / logo / content / footer
 * - `large` — 327×377, optional header / logo / content / footer
 */
export type EtMediaCardSize = MediaCardSizeKey;

/**
 * Surface / foreground treatment. **Required for text colour** — foreground
 * is derived only from `variant` (see {@link resolveMediaCardVariantColors}):
 * - `standard` — asset / passed colour fill; text = `carbonStatic050`
 * - `bright` — white fill (`carbonStatic050`); text = `carbonStatic900`
 * - `dark` — charcoal fill (`bgDarkSurface`); text = `carbonStatic050`
 *
 * Card **fill** precedence: `backgroundVideo` → `backgroundImage` → solid colour.
 */
export type EtMediaCardVariant = 'standard' | 'bright' | 'dark';

/**
 * Slot type identifier for runtime slot detection via `__SLOT_TYPE`.
 * Static properties survive minification (unlike `displayName`).
 */
export type MediaCardSlotType = 'header' | 'content' | 'footer' | 'logo' | 'title' | 'subtitle';

/**
 * Logo placement.
 * - `inline` — rendered in the content flow (default for small)
 * - `background` — large watermark behind content (medium / large asset cards)
 */
export type MediaCardLogoPlacement = 'inline' | 'background';

// ============================================================================
// Root Props
// ============================================================================

/**
 * Props for the EtMediaCard root component.
 *
 * @example Small asset card
 * ```tsx
 * <EtMediaCard size="small" variant="standard" backgroundColor="#CC2914">
 *   <EtMediaCard.Logo source={{ uri: logoUrl }} />
 *   <EtMediaCard.Title>186.79</EtMediaCard.Title>
 *   <EtMediaCard.Subtitle>▲ 4.35%</EtMediaCard.Subtitle>
 * </EtMediaCard>
 * ```
 *
 * @example Medium — header / logo / content / footer
 * ```tsx
 * <EtMediaCard size="medium" variant="standard" backgroundColor="#CC2914">
 *   <EtMediaCard.Logo source={{ uri: logoUrl }} placement="background" />
 *   <EtMediaCard.Header><EtText>Label</EtText></EtMediaCard.Header>
 *   <EtMediaCard.Content><EtText>Body copy…</EtText></EtMediaCard.Content>
 *   <EtMediaCard.Footer>…</EtMediaCard.Footer>
 * </EtMediaCard>
 * ```
 */
export interface EtMediaCardProps {
  /**
   * Card size — selects the default width/height from the Figma DS presets
   * (`small` 128×164, `medium` 327×230, `large` 327×377). @default 'medium'
   */
  size?: EtMediaCardSize;
  /**
   * Override the size preset's width. Smart components building on the card can
   * set this (e.g. `'100%'` to fill a carousel slot, or a fixed px). Falls back
   * to the {@link size} preset when omitted.
   */
  width?: DimensionValue;
  /**
   * Override the size preset's height. Falls back to the {@link size} preset
   * when omitted.
   */
  height?: DimensionValue;
  /** Surface / foreground treatment. @default 'standard' */
  variant?: EtMediaCardVariant;
  /**
   * Solid card fill — any colour (e.g. instrument logo brand
   * `backgroundColor`). Underlays image / video when those are set.
   */
  backgroundColor?: string;
  /**
   * Full-bleed background image. Takes precedence over `backgroundColor`;
   * overridden by `backgroundVideo` when both are set.
   */
  backgroundImage?: ImageSourcePropType;
  /**
   * Full-bleed looping muted background video URI.
   * Highest precedence among colour / image / video fills.
   */
  backgroundVideo?: string;
  /**
   * Pause the background video (e.g. when the card is off-screen).
   * Only applies when {@link backgroundVideo} is set.
   * @default false
   */
  backgroundVideoPaused?: boolean;
  /**
   * Figma full-card "Overlay" gloss (`white 0.75 → transparent` + `mix-blend: overlay`).
   * Off by default — enable from smart cards that need it (currently `EtAssetCard`).
   * @default false
   */
  overlay?: boolean;
  /** Compound slot children. */
  children?: ReactNode;
  /**
   * Optional accessibility label for the card container.
   * The root is never marked `accessible` — nested controls (header actions,
   * overflow pills) must stay in the accessibility tree. Prefer
   * {@link MediaCardContentProps.accessibilityLabel} /
   * {@link MediaCardFooterProps.accessibilityLabel} on the pressable region.
   */
  accessibilityLabel?: string;
  /** Container style override. */
  style?: StyleProp<ViewStyle>;
  /** Test ID for the root. */
  testID?: string;
}

// ============================================================================
// Slot Props
// ============================================================================

export interface MediaCardSlotProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/**
 * Props for {@link EtMediaCard.Header}.
 *
 * Prefer `start` / `end` for the standard badge + trailing-action recipe
 * (Asset Card, Smart Portfolio). When either is set, `children` is ignored and
 * a leading spacer is inserted automatically if `start` is omitted.
 */
export interface MediaCardHeaderProps {
  /** Leading slot — typically {@link EtMediaCard.Badge}. */
  start?: ReactNode;
  /** Trailing slot — typically {@link EtIconButton}. */
  end?: ReactNode;
  /** Custom header children (used when `start` / `end` are omitted). */
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/**
 * Props for {@link EtMediaCard.Content}.
 *
 * Layout (Figma): stretch row, column / flex-end / flex-start,
 * uniform `X5` (20px) padding on all sides.
 *
 * Structured stack (shared by Trending Stock / Top Trader):
 * - `eyebrow` → `body-secondary-medium`
 * - `title` → `body-base-semibold`
 * - `description` → `label-tertiary-regular` (or legacy `body-tiny-medium` when alone)
 *
 * Progressive frost is **always** present (Figma content overlay slot) unless
 * opted out:
 * - Progressive BG blur (`blur(4px)`) — soft at content top → strong at bottom
 * - Flat 8% tint — Carbon 900 `#1B1E21` @ `0.08`, same direction (darker at bottom)
 *
 * Pass `blur={false}` to opt out. Pass `children` for custom content when not
 * using the structured props.
 */
export interface MediaCardContentProps {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  /** Press handler for the content region (small price stack or medium/large body). */
  onPress?: () => void;
  /** Accessibility label when {@link onPress} is set. */
  accessibilityLabel?: string;
  /**
   * Content frost overlay (progressive blur + variant-tinted 8% fill).
   * @default `undefined` (on). Pass `false` to opt out.
   */
  blur?: boolean;
  /** Small label above the title (e.g. `"Trending Stock"` / `"Top Trader"`). */
  eyebrow?: string;
  /** Primary headline in the content strip. */
  title?: string;
  /**
   * Body / subtitle under the headline.
   * With `eyebrow` / `title`, uses tertiary label style; alone keeps legacy body-tiny.
   */
  description?: string;
}

/**
 * @deprecated Prefer {@link MediaCardFooterOverlay} presets.
 * Kept for advanced colour overrides.
 */
export type MediaCardFooterOverlayOpacity = 0.1 | 0.15;

/**
 * Props for {@link EtMediaCard.Footer}.
 *
 * The footer uses a light glass blur (kept lighter than the content frost — it
 * leans on the scrim). Prefer `overlay` presets; `overlayColor` /
 * `overlayOpacity` override when set.
 *
 * Blur tint follows the parent card `variant` from MediaCard context.
 */
export interface MediaCardFooterProps extends MediaCardSlotProps {
  /** Press handler for the glass footer strip. */
  onPress?: () => void;
  /** Accessibility label when {@link onPress} is set. */
  accessibilityLabel?: string;
  /**
   * Glass scrim preset.
   * - `media` — `#1B1E21` (`carbonStatic900`) @ `0.15`
   * - `muted` — `#999999` (Carbon Neutral 500) @ `0.1`
   *
   * When omitted, defaults from card `variant`: `standard` → `media`, `bright` / `dark` → `muted`.
   */
  overlay?: MediaCardFooterOverlay;
  /**
   * Override scrim colour. When set, takes precedence over {@link overlay} colour.
   */
  overlayColor?: string;
  /**
   * Override scrim opacity. When set with {@link overlayColor}, replaces the preset opacity.
   */
  overlayOpacity?: MediaCardFooterOverlayOpacity;
}

export interface MediaCardLogoProps {
  /** Image source — remote `{ uri }`, or bundled `require(...)`. */
  source: ImageSourcePropType;
  /** Logo size in px. Defaults by card size: small=48, medium=80, large=96. */
  size?: number;
  /** @default 'inline' for small; consumers set 'background' for watermark. */
  placement?: MediaCardLogoPlacement;
  /**
   * Render the logo inside the boxed instrument avatar (rounded square brand
   * fill + gradient overlay). @default `true`
   *
   * Set `false` to show just the logo mark with no background box — e.g. the
   * small asset card, where the card surface already carries the brand colour.
   */
  boxed?: boolean;
  /**
   * Brand fill for the boxed avatar (rounded square behind the logo), e.g. the
   * asset's `backgroundColor`. Matches the portfolio-list instrument avatar so
   * every logo reads consistently. Falls back to a neutral surface when omitted.
   * Ignored when `boxed={false}`.
   */
  backgroundColor?: string;
  /**
   * Short initials rendered inside the box when `source` is missing or fails to
   * load so the avatar never renders empty. Text colour auto-contrasts the box.
   */
  fallback?: string;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export interface MediaCardTextSlotProps {
  children: ReactNode;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
  testID?: string;
}

export type EtMediaCardChildren =
  | ReactElement<MediaCardSlotProps | MediaCardContentProps | MediaCardFooterProps | MediaCardLogoProps | MediaCardTextSlotProps>
  | Array<
      ReactElement<MediaCardSlotProps | MediaCardContentProps | MediaCardFooterProps | MediaCardLogoProps | MediaCardTextSlotProps> | null | false
    >
  | null
  | false;

// ============================================================================
// Context
// ============================================================================

export interface MediaCardContextValue {
  size: EtMediaCardSize;
  /** Uniform header / content / footer padding in px (`X5` = 20). */
  padding: number;
  /** Drives text colour — see {@link EtMediaCardVariant}. */
  variant: EtMediaCardVariant;
  /**
   * Text / icon colour. Near-white `standard` fills and fills where white text
   * fails WCAG AA 4.5:1 (normal text) use `carbonStatic900`; otherwise
   * `carbonStatic050`. Chrome ({@link isBright}) stays near-white-only.
   */
  foregroundColor: string;
  /**
   * Whether the card renders **bright chrome** (light footer / frost) — `true`
   * for the `bright` variant, or a `standard` card whose solid fill is
   * near-white via {@link classifyBackgroundTone}. Not used for yellow / gold.
   */
  isBright: boolean;
  /** True when root has `backgroundImage` or `backgroundVideo`. */
  hasBackgroundMedia: boolean;
  /** True when a `Logo` with `placement="background"` is present. */
  hasBackgroundLogo: boolean;
}
