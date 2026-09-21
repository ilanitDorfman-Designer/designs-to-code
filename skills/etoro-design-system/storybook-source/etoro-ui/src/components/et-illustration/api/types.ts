import type { StyleProp, ViewStyle } from 'react-native';

/**
 * Illustration size tokens matching Figma DS sizes. By default an illustration is a single
 * SVG and `size` scales it to fit the token's nominal box (aspect ratio preserved); the
 * default per illustration is its Figma native size (e.g. `coupon` → `s`, status icons →
 * `m`, coast-to-coast → `xxl`).
 *
 * Some illustrations ship a **dedicated variant asset** for a given size — a genuinely
 * different (not just scaled) layout. Passing that `size` loads the variant asset and it is
 * rendered at its **own intrinsic dimensions** (it was drawn for that size in Figma, so it is
 * not re-fit into the token box), which means the height varies per illustration. Current XL
 * variants: the status illustrations (`error`, `success`, `connection_error`, `warning`,
 * `pending`) → wide banners. Exact dimensions live in
 * `ILLUSTRATION_META[name].variants`. When no variant exists for the requested size, the base
 * SVG is scaled to fit the token box below.
 * - `s`  — 124×124 (CMS / cards)
 * - `m`  — 152×152 (drawer / empty)
 * - `xl` — 375×158 nominal box; XL variant art renders at its own intrinsic size (see
 *          `ILLUSTRATION_META[name].variants.xl`)
 * - `xxl` — 375×230 (UX / screens, coast-to-coast)
 */
export type IllustrationSize = 's' | 'm' | 'xl' | 'xxl';

/** Theme used to pick light vs dark assets. */
export type IllustrationTheme = 'light' | 'dark';

/**
 * CDN asset format. Loaded via `expo-image` either way. Flat line art ships as `svg`;
 * anything with a Figma `feTurbulence` stipple ships as `png` (feTurbulence is not
 * rendered by react-native-svg on native). A few illustrations mix per theme.
 */
export type IllustrationFormat = 'png' | 'svg';

/**
 * Canonical illustration names from Figma "Illustrations — Images — 2026".
 * Names are snake_case (underscore-delimited), matching the CDN asset stems
 * (`{name}_{size}_{theme}`). Every name has a base asset; some also have
 * size-specific variants (see `ILLUSTRATION_META[name].variants` and {@link IllustrationSize}).
 */
export type IllustrationName =
  | 'magnifying_glass'
  | 'error'
  | 'success'
  | 'connection_error'
  | 'warning'
  | 'pending'
  | 'empty_list'
  | 'settings'
  | 'like'
  | 'card'
  | 'coupon'
  | 'empty_bar_chart'
  | 'refer_a_friend'
  | 'shield_lock'
  | 'calendar'
  | 'target'
  | 'phone_coins'
  | 'assets'
  | 'paper_plane'
  | 'shield_and_users'
  | 'verify'
  | 'shield_checkmark';

/**
 * Props for {@link EtIllustration}.
 *
 * @example
 * ```tsx
 * <EtIllustration name="error" size="m" />
 * <EtIllustration name="paper_plane" size="xxl" />
 * ```
 */
export interface EtIllustrationProps {
  /** Illustration name matching the CDN asset stem (snake_case). */
  name: IllustrationName;

  /**
   * Size token. Loads a dedicated variant asset for that size when one exists (e.g. the
   * wide XL status art), otherwise scales the base SVG to fit the token's box (aspect
   * preserved). Defaults to the illustration's Figma native size when omitted.
   */
  size?: IllustrationSize;

  /**
   * Optional light/dark asset override. Omit to follow the app theme
   * (`useEtoroTheme().dark`). Pass `'light'` or `'dark'` only when a screen
   * must show a specific asset regardless of the current theme.
   */
  theme?: IllustrationTheme;

  /** Optional explicit width override (px). Aspect ratio preserved when only one dimension is set. */
  width?: number;

  /** Optional explicit height override (px). Aspect ratio preserved when only one dimension is set. */
  height?: number;

  /** Optional style applied to the wrapper view. */
  style?: StyleProp<ViewStyle>;
  /** Optional test id forwarded to the wrapper view. */
  testID?: string;
  /** Accessibility label. Defaults to `name`. */
  accessibilityLabel?: string;
}
