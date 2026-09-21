// @ts-expect-error -- @react-native/normalize-colors ships without TypeScript types
import normalizeColor from '@react-native/normalize-colors';

/**
 * Card surface tone derived from a solid background colour.
 * Aligns with {@link EtMediaCardVariant}:
 * - `bright` — near white → dark text
 * - `dark` — near black / charcoal → light text
 * - `standard` — everything else (brand / mid tones) → light text
 */
export type MediaCardBackgroundTone = 'bright' | 'dark' | 'standard';

/**
 * Minimum value (0–255) every RGB channel must reach for a colour to count as
 * "near white". Requiring all three channels to be high restricts the match to
 * white / off-white / very light grey and deliberately excludes saturated or
 * mid-tone brand colours (e.g. vivid reds/yellows), which stay `standard`.
 */
const NEAR_WHITE_MIN_CHANNEL = 224;

/**
 * Maximum value (0–255) every RGB channel must stay at/under for a colour to
 * count as "near dark". Requiring all three channels to be low restricts the
 * match to black / charcoal / very dark grey and deliberately excludes
 * saturated brand colours with low luminance (e.g. deep reds), which stay
 * `standard`.
 */
const NEAR_DARK_MAX_CHANNEL = 64;

/** Fully opaque alpha (0–1). Transparent / semi-transparent fills are never classified. */
const OPAQUE_ALPHA_THRESHOLD = 1;

type ParsedRgba = { r: number; g: number; b: number; a: number };

/** Linearizes an 8-bit sRGB channel (0–255) for relative-luminance math. */
function linearizeChannel(value: number): number {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

/** True when r/g/b are within `0..255` and alpha within `0..1` (rejects `rgb(300,…)`, `rgba(…, 2)`). */
function isValidRgba(r: number, g: number, b: number, a: number): boolean {
  return [r, g, b].every((channel) => Number.isInteger(channel) && channel >= 0 && channel <= 255) && Number.isFinite(a) && a >= 0 && a <= 1;
}

/** CSS named colours used for tone classification (lowercase keys). */
const NAMED_COLORS: Record<string, string> = {
  white: '#ffffff',
  black: '#000000',
  transparent: '#00000000',
  whitesmoke: '#f5f5f5',
  snow: '#fffafa',
  ghostwhite: '#f8f8ff',
  ivory: '#fffff0',
  floralwhite: '#fffaf0',
  seashell: '#fff5ee',
  gainsboro: '#dcdcdc',
  lightgray: '#d3d3d3',
  lightgrey: '#d3d3d3',
  darkgray: '#a9a9a9',
  darkgrey: '#a9a9a9',
  gray: '#808080',
  grey: '#808080',
  dimgray: '#696969',
  dimgrey: '#696969',
};

/** Converts HSL (h 0–360, s/l 0–1) → 8-bit RGB. */
function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const hp = (((h % 360) + 360) % 360) / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  let r = 0;
  let g = 0;
  let b = 0;
  if (hp < 1) {
    r = c;
    g = x;
  } else if (hp < 2) {
    r = x;
    g = c;
  } else if (hp < 3) {
    g = c;
    b = x;
  } else if (hp < 4) {
    g = x;
    b = c;
  } else if (hp < 5) {
    r = x;
    b = c;
  } else {
    r = c;
    b = x;
  }
  const m = l - c / 2;
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

/**
 * Unpacks RN `normalizeColor` `0xRRGGBBAA` into 8-bit channels.
 * Used for CSS3/SVG keywords and `hwb()` that our local parsers do not cover.
 */
function parseRgbaFromPlatform(color: string): ParsedRgba | null {
  const packed = normalizeColor(color);
  if (typeof packed !== 'number') {
    return null;
  }
  return {
    r: (packed >>> 24) & 0xff,
    g: (packed >>> 16) & 0xff,
    b: (packed >>> 8) & 0xff,
    a: (packed & 0xff) / 255,
  };
}

/** Parses `#rgb` / `#rrggbb` / `#rrggbbaa` / `rgb()` / `rgba()` / `hsl()` / `hwb()` / named colours → RGBA or `null`. */
function parseRgba(color: string): ParsedRgba | null {
  const value = color.trim();

  const namedHex = NAMED_COLORS[value.toLowerCase()];
  if (namedHex) {
    return parseRgba(namedHex);
  }

  if (value.startsWith('#')) {
    let hex = value.slice(1);
    if (hex.length === 3 || hex.length === 4) {
      hex = hex
        .split('')
        .map((ch) => ch + ch)
        .join('');
    }
    if ((hex.length !== 6 && hex.length !== 8) || !/^[\da-f]+$/i.test(hex)) {
      return null;
    }
    const r = Number.parseInt(hex.slice(0, 2), 16);
    const g = Number.parseInt(hex.slice(2, 4), 16);
    const b = Number.parseInt(hex.slice(4, 6), 16);
    const a = hex.length === 8 ? Number.parseInt(hex.slice(6, 8), 16) / 255 : 1;
    return { r, g, b, a };
  }

  // rgb/rgba: comma-separated or modern space-separated (optional / alpha)
  const rgbMatch = value.match(/^rgba?\(\s*(\d+(?:\.\d+)?)\s*[, ]\s*(\d+(?:\.\d+)?)\s*[, ]\s*(\d+(?:\.\d+)?)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/i);
  if (rgbMatch) {
    const r = Math.round(Number(rgbMatch[1]));
    const g = Math.round(Number(rgbMatch[2]));
    const b = Math.round(Number(rgbMatch[3]));
    let a = 1;
    if (rgbMatch[4] !== undefined) {
      const raw = rgbMatch[4];
      a = raw.endsWith('%') ? Number(raw.slice(0, -1)) / 100 : Number(raw);
    }
    return isValidRgba(r, g, b, a) ? { r, g, b, a } : null;
  }

  // hsl/hsla: comma-separated or modern space-separated
  const hslMatch = value.match(/^hsla?\(\s*(-?[\d.]+)\s*[, ]\s*([\d.]+)%\s*[, ]\s*([\d.]+)%(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/i);
  if (hslMatch) {
    const h = Number(hslMatch[1]);
    const s = Number(hslMatch[2]) / 100;
    const l = Number(hslMatch[3]) / 100;
    let a = 1;
    if (hslMatch[4] !== undefined) {
      const raw = hslMatch[4];
      a = raw.endsWith('%') ? Number(raw.slice(0, -1)) / 100 : Number(raw);
    }
    if (![h, s, l, a].every(Number.isFinite) || s < 0 || s > 1 || l < 0 || l > 1 || a < 0 || a > 1) {
      return null;
    }
    const { r, g, b } = hslToRgb(h, s, l);
    return isValidRgba(r, g, b, a) ? { r, g, b, a } : null;
  }

  // Remaining CSS3/SVG keywords (e.g. `aliceblue`) and `hwb()` — strict rgb/hsl
  // failures above must not fall through here (platform parser clamps channels).
  if (/^hwb\(/i.test(value) || /^[a-z]+$/i.test(value)) {
    return parseRgbaFromPlatform(value);
  }

  return null;
}

function relativeLuminanceFromRgba(rgba: ParsedRgba): number {
  return 0.2126 * linearizeChannel(rgba.r) + 0.7152 * linearizeChannel(rgba.g) + 0.0722 * linearizeChannel(rgba.b);
}

/** WCAG contrast ratio between two relative luminances (0–1). */
export function contrastRatio(luminanceA: number, luminanceB: number): number {
  const lighter = Math.max(luminanceA, luminanceB);
  const darker = Math.min(luminanceA, luminanceB);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Relative luminance (0 = black, 1 = white) of a hex / rgb(a) / hsl(a) / hwb() / named colour, or
 * `null` when the colour can't be parsed. Alpha is ignored for luminance.
 */
export function getRelativeLuminance(color: string | undefined): number | null {
  if (!color) {
    return null;
  }
  const rgba = parseRgba(color);
  if (!rgba) {
    return null;
  }
  return relativeLuminanceFromRgba(rgba);
}

/**
 * WCAG AA for **normal** text (labels, body, small numerals).
 * Large-text AA is 3:1 — too low for these cards.
 */
export const MIN_NORMAL_TEXT_CONTRAST = 4.5;

/**
 * Whether small/normal labels should use dark text on this solid fill.
 *
 * Independent of {@link classifyBackgroundTone}: gold / magenta stay `standard`
 * chrome, but white-on-fill below 4.5:1 still flips the foreground (e.g. white
 * on `#FF00FF` is ~3.14:1).
 */
export function prefersDarkForeground(color: string | undefined): boolean {
  const luminance = getRelativeLuminance(color);
  if (luminance == null) {
    return false;
  }
  const whiteContrast = contrastRatio(1, luminance);
  const blackContrast = contrastRatio(luminance, 0);
  return whiteContrast < MIN_NORMAL_TEXT_CONTRAST && blackContrast > whiteContrast;
}

/**
 * Classifies a solid background colour into the card **chrome** tone
 * (`isBright` / footer / frost) — not label colour:
 * - `bright` — near-white / off-white / very light grey (all channels ≥ 224)
 * - `dark` — near-black / charcoal (all channels ≤ 64)
 * - `standard` — brand / mid tones (including yellow / gold / magenta)
 *
 * Label colour uses {@link prefersDarkForeground} (WCAG AA 4.5:1).
 *
 * Explicit card `variant` still wins when set to `bright` / `dark`; this helper
 * is for solid fills (e.g. asset brand colour on a `standard` card).
 */
export function classifyBackgroundTone(color: string | undefined): MediaCardBackgroundTone {
  if (!color) {
    return 'standard';
  }
  const rgba = parseRgba(color);
  if (!rgba || rgba.a < OPAQUE_ALPHA_THRESHOLD) {
    return 'standard';
  }

  if ([rgba.r, rgba.g, rgba.b].every((channel) => channel >= NEAR_WHITE_MIN_CHANNEL)) {
    return 'bright';
  }

  if ([rgba.r, rgba.g, rgba.b].every((channel) => channel <= NEAR_DARK_MAX_CHANNEL)) {
    return 'dark';
  }

  return 'standard';
}

/**
 * Whether a solid surface colour is (essentially) **white**.
 * Prefer {@link classifyBackgroundTone} when you need the full bright / dark / standard split.
 */
export function isNearWhiteColor(color: string | undefined): boolean {
  return classifyBackgroundTone(color) === 'bright';
}
