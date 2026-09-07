/**
 * Pill-glow fallbacks so black/white avatars stay visible against the theme:
 * black → white in dark mode, white → gray in light mode. Brand tints are unchanged.
 */
export const DARK_MODE_AVATAR_GLOW_FALLBACK = '#FFFFFF';
/** Carbon 550 — reads on a light surface without looking like a black wash. */
export const LIGHT_MODE_WHITE_AVATAR_GLOW_FALLBACK = '#737373';

/**
 * Relative luminance below this disappears against a dark screen (near-black
 * logos such as XRP). Saturated brand colors stay above it.
 */
const DARK_GLOW_LUMINANCE_THRESHOLD = 0.06;

/**
 * Relative luminance above this disappears against a light screen (near-white
 * logos). Saturated brand colors stay below it.
 */
const LIGHT_GLOW_LUMINANCE_THRESHOLD = 0.85;

/**
 * max(R,G,B) − min(R,G,B) below this is treated as grey/black/white. Navy and
 * other dark brand tints sit above it, so they keep their hue instead of being
 * inverted to white/gray.
 */
const ACHROMATIC_CHROMA_THRESHOLD = 0.08;

/** Prefer the other encoded tint when its chroma exceeds this gap (brand vs paper). */
const BRAND_CHROMA_GAP = 0.08;

interface Rgb {
  r: number;
  g: number;
  b: number;
  /** 0–1 opacity. Formats without an alpha channel report 1. */
  a: number;
}

/**
 * Prefer the saturated brand tint over paper/ink. Light-grey SVG pads with a
 * navy logo should glow blue, not white.
 */
export function pickAvatarBrandColor(background?: string, foreground?: string): string | undefined {
  if (!foreground) return background;
  if (!background) return foreground;

  const backgroundRgb = parseCssColorToRgb(background);
  const foregroundRgb = parseCssColorToRgb(foreground);
  if (!backgroundRgb) return foreground;
  if (!foregroundRgb) return background;

  const backgroundChroma = channelChroma(backgroundRgb);
  const foregroundChroma = channelChroma(foregroundRgb);
  if (foregroundChroma > backgroundChroma + BRAND_CHROMA_GAP) return foreground;
  if (backgroundChroma > foregroundChroma + BRAND_CHROMA_GAP) return background;

  const backgroundLuminance = relativeLuminance(backgroundRgb);
  const foregroundLuminance = relativeLuminance(foregroundRgb);
  if (backgroundLuminance > LIGHT_GLOW_LUMINANCE_THRESHOLD && foregroundLuminance <= LIGHT_GLOW_LUMINANCE_THRESHOLD) {
    return foreground;
  }
  if (foregroundLuminance > LIGHT_GLOW_LUMINANCE_THRESHOLD && backgroundLuminance <= LIGHT_GLOW_LUMINANCE_THRESHOLD) {
    return background;
  }

  return background;
}

/**
 * Color fed into the instrument-header pill glow.
 *
 * `pickAvatarBrandColor` prefers ink over a white pad (black logo on white),
 * which would skip the light-mode gray glow. Achromatic black/white pads keep
 * the pad colour so theme fallbacks can run; chromatic logos still win.
 */
export function pickAvatarGlowSource(background?: string, foreground?: string): string | undefined {
  const backgroundRgb = background ? parseCssColorToRgb(background) : undefined;
  if (backgroundRgb && isAchromatic(backgroundRgb)) {
    const luminance = relativeLuminance(backgroundRgb);
    const foregroundRgb = foreground ? parseCssColorToRgb(foreground) : undefined;
    const foregroundIsAchromatic = !foregroundRgb || isAchromatic(foregroundRgb);

    if (luminance < DARK_GLOW_LUMINANCE_THRESHOLD && foregroundIsAchromatic) return background;
    if (luminance > LIGHT_GLOW_LUMINANCE_THRESHOLD && foregroundIsAchromatic) return background;
  }

  return pickAvatarBrandColor(background, foreground);
}

/**
 * Map a near-black tint to white in dark mode, and a near-white tint to gray
 * in light mode. Greyscale only — brand colors keep their original hue.
 *
 * See-through tints are exempt: the fallbacks are opaque, so applying one would
 * paint a solid halo the avatar never had. A fully transparent tint reports "no
 * color" so the caller can use its own neutral glow; partial alpha is kept as-is.
 */
export function resolveAvatarGlowColor(color: string | undefined, isDarkMode: boolean): string | undefined {
  if (!color) return color;

  const rgb = parseCssColorToRgb(color);
  if (!rgb) return color;
  if (rgb.a === 0) return undefined;
  if (rgb.a < 1) return color;
  if (!isAchromatic(rgb)) return color;

  const luminance = relativeLuminance(rgb);
  if (isDarkMode && luminance < DARK_GLOW_LUMINANCE_THRESHOLD) return DARK_MODE_AVATAR_GLOW_FALLBACK;
  if (!isDarkMode && luminance > LIGHT_GLOW_LUMINANCE_THRESHOLD) return LIGHT_MODE_WHITE_AVATAR_GLOW_FALLBACK;

  return color;
}

function isAchromatic(rgb: Rgb): boolean {
  return channelChroma(rgb) < ACHROMATIC_CHROMA_THRESHOLD;
}

function channelChroma({ r, g, b }: Rgb): number {
  return (Math.max(r, g, b) - Math.min(r, g, b)) / 255;
}

function parseCssColorToRgb(color: string): Rgb | undefined {
  const trimmed = color.trim();
  const hex = trimmed.startsWith('#') ? trimmed.slice(1) : trimmed;

  if (/^[0-9A-Fa-f]{3,4}$/.test(hex)) {
    return {
      r: parseInt(hex[0] + hex[0], 16),
      g: parseInt(hex[1] + hex[1], 16),
      b: parseInt(hex[2] + hex[2], 16),
      a: hex.length === 4 ? parseInt(hex[3] + hex[3], 16) / 255 : 1,
    };
  }

  if (/^[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$/.test(hex)) {
    return {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16),
      a: hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1,
    };
  }

  const rgbMatch = trimmed.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?\)/i);
  if (!rgbMatch) return undefined;

  return {
    r: Number(rgbMatch[1]),
    g: Number(rgbMatch[2]),
    b: Number(rgbMatch[3]),
    a: rgbMatch[4] === undefined ? 1 : Number(rgbMatch[4]),
  };
}

function relativeLuminance({ r, g, b }: Rgb): number {
  return 0.2126 * channelToLinear(r) + 0.7152 * channelToLinear(g) + 0.0722 * channelToLinear(b);
}

function channelToLinear(channel: number): number {
  const srgb = channel / 255;
  return srgb <= 0.03928 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
}
