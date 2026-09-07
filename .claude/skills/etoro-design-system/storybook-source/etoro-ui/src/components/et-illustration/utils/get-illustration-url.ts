import type { IllustrationName, IllustrationSize, IllustrationTheme } from '../api/types';
import { ILLUSTRATION_ASSET_FORMAT } from '../illustration-assets.generated';
import { ILLUSTRATION_META } from '../illustration-meta';

/** eToro static CDN origin used to build illustration asset URLs. */
const CDN_BASE_URL = 'https://etoro-cdn.etorostatic.com/web-client/et-plus';

/** Directory that holds every illustration asset (flat, `name_size_theme.ext`). */
export const ILLUSTRATIONS_CDN_BASE_URL = `${CDN_BASE_URL}/etoro/illustrations`;

/**
 * Whether a dedicated (non-scaled) variant asset exists for `name` at `size`. When true the
 * variant file is loaded and rendered at its own intrinsic aspect; otherwise the base
 * (default-size) asset is loaded and scaled to fit the size token box.
 */
export function hasIllustrationVariant(name: IllustrationName, size: IllustrationSize): boolean {
  return ILLUSTRATION_META[name]?.variants?.[size] != null;
}

/**
 * Resolve which asset file to load: a dedicated variant when one exists for the requested
 * size, otherwise the illustration's base (Figma default-size) asset.
 */
function resolveAssetSize(name: IllustrationName, requested?: IllustrationSize): IllustrationSize {
  const meta = ILLUSTRATION_META[name];
  const defaultSize = meta?.defaultSize ?? 'm';
  const size = requested ?? defaultSize;
  return hasIllustrationVariant(name, size) ? size : defaultSize;
}

/**
 * Flat filename on the CDN: `{name}_{resolvedSize}_{theme}.{png|svg}`.
 * Uses a dedicated size variant when one exists, otherwise the Figma default size.
 */
function resolveIllustrationFileName(name: IllustrationName, theme: IllustrationTheme, size?: IllustrationSize): string {
  const assetSize = resolveAssetSize(name, size);
  const stem = `${name}_${assetSize}_${theme}`;
  const format = ILLUSTRATION_ASSET_FORMAT[stem] ?? 'png';
  return `${stem}.${format}`;
}

/**
 * Flat CDN filename for an illustration (`{name}_{assetSize}_{theme}.{png|svg}`).
 * Theme can change the extension (e.g. `calendar_xxl_light.svg` vs `calendar_xxl_dark.png`).
 */
export function getIllustrationFileName(name: IllustrationName, theme: IllustrationTheme, size?: IllustrationSize): string {
  return resolveIllustrationFileName(name, theme, size);
}

/**
 * Build the CDN URL for an illustration. The CDN ships each illustration at its Figma
 * default size plus any dedicated size variants (e.g. the wide XL status art); other sizes
 * are produced by scaling the base asset at render time, so the URL always points at either
 * the base or a variant file:
 *
 * `{cdn}/etoro/illustrations/{name}_{assetSize}_{theme}.{format}`
 *
 * Format (png/svg) comes from the generated asset map and can differ per theme.
 *
 * @example
 * getIllustrationUrl('coupon', 'light')       // …/coupon_s_light.png
 * getIllustrationUrl('error', 'dark', 'xl')   // …/error_xl_dark.png
 * getIllustrationUrl('card', 'light', 'xxl')  // …/card_m_light.svg  (no xxl variant → base)
 */
export function getIllustrationUrl(name: IllustrationName, theme: IllustrationTheme, size?: IllustrationSize): string {
  return `${ILLUSTRATIONS_CDN_BASE_URL}/${resolveIllustrationFileName(name, theme, size)}`;
}
