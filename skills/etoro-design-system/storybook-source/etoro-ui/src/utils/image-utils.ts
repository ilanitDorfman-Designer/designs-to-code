/**
 * Instrument image types for logo extraction
 */
export interface InstrumentImages {
  svg?: { uri: string; backgroundColor?: string; textColor?: string };
  '150x150'?: { uri: string; width?: number; height?: number };
  '50x50'?: { uri: string; width?: number; height?: number };
  '35x35'?: { uri: string; width?: number; height?: number };
  [key: string]: unknown;
}

const ENCODED_HEX_PATTERN = /^[0-9A-Fa-f]{3}$|^[0-9A-Fa-f]{6}$/;
const IMAGE_EXTENSION_PATTERN = /\.(svg|png|jpg|jpeg|gif|webp)$/i;

export interface ImageEncodedColors {
  background?: string;
  foreground?: string;
}

/**
 * Reads brand hexes encoded in an avatar/logo CDN filename.
 *
 * URLs follow `…/{id}_{background}[_{foreground}].{ext}` (e.g.
 * `1001_0A2240_FFFFFF.svg`). Query strings are ignored.
 */
export function extractImageEncodedColors(url: string | undefined): ImageEncodedColors {
  if (!url?.includes('_')) return {};

  const filename =
    url
      .split('/')
      .pop()
      ?.replace(/[?#].*$/, '') ?? '';
  const nameWithoutExtension = filename.replace(IMAGE_EXTENSION_PATTERN, '');
  const hexes = nameWithoutExtension
    .split('_')
    .slice(1)
    .filter((segment) => ENCODED_HEX_PATTERN.test(segment))
    .map((segment) => `#${segment}`);

  return { background: hexes[0], foreground: hexes[1] };
}

/**
 * Extracts a hex background colour embedded in an avatar/logo CDN URL.
 *
 * URLs follow the pattern `…_<hex>[?…]` where `<hex>` is a 3- or 6-char
 * hex colour code placed after the last underscore.
 *
 * @returns A CSS hex colour string (e.g. `"#F0A"`) or `undefined`
 */
export function extractImageBackgroundColor(url: string | undefined): string | undefined {
  return extractImageEncodedColors(url).background;
}

/**
 * Extracts the preferred logo URI from instrument images object.
 * Prefers higher quality images in this order: svg → 150x150 → 50x50 → 35x35
 *
 * @param images - Instrument images object containing various resolutions
 * @returns The URI string of the best available image, or undefined if none available
 *
 * @example
 * ```ts
 * const logo = getPreferredLogoUri(instrument.images);
 * // Returns: "https://example.com/logo.svg" or undefined
 * ```
 */
export function getPreferredLogoUri(images?: InstrumentImages): string | undefined {
  if (!images) return undefined;

  // Prefer SVG for best quality and scalability
  if (images.svg && 'uri' in images.svg) {
    return images.svg.uri;
  }

  // Fallback to largest raster image available
  if (images['150x150'] && 'uri' in images['150x150']) {
    return images['150x150'].uri;
  }

  if (images['50x50'] && 'uri' in images['50x50']) {
    return images['50x50'].uri;
  }

  if (images['35x35'] && 'uri' in images['35x35']) {
    return images['35x35'].uri;
  }

  return undefined;
}
