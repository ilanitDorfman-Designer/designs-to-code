import type { NumericKeyValue } from './api/types';

export type KeypadRenderKey = NumericKeyValue | 'clear';

/** 4-row x 3-column layout: 1 2 3 / 4 5 6 / 7 8 9 / . 0 C */
export const KEY_ROWS: KeypadRenderKey[][] = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['.', '0', 'clear'],
];

/** Grid position of the "5" key — the origin the entrance flare blooms out from. */
export const FLARE_ORIGIN_ROW = 1;
export const FLARE_ORIGIN_COL = 1;

/**
 * Offset (in cells) of a key from the center "5", used to seed the flare's initial
 * translate so each key starts pulled toward "5". "5" itself is `{ colFactor: 0, rowFactor: 0 }`.
 */
export function getFlareOffset(rowIndex: number, colIndex: number): { colFactor: number; rowFactor: number } {
  return { colFactor: FLARE_ORIGIN_COL - colIndex, rowFactor: FLARE_ORIGIN_ROW - rowIndex };
}

/**
 * Concentric ring index of a key around the center "5" (Chebyshev distance), so keys enter in
 * distinct layers: `0` = `{5}`, `1` = the 8 surrounding keys, `2` = the bottom row (`. 0 C`).
 * Drives the layer-by-layer entrance stagger.
 */
export function getFlareRing(rowIndex: number, colIndex: number): number {
  return Math.max(Math.abs(rowIndex - FLARE_ORIGIN_ROW), Math.abs(colIndex - FLARE_ORIGIN_COL));
}

/** Design (tall-device) height of a single key row, in points. Matches execution Figma (4×64 = 256). */
export const KEY_ROW_HEIGHT = 64;

/**
 * Floor for the responsive row height on small/old devices. Kept so that, with the top band,
 * the keypad never shrinks below the execution layout's reserved area (4×57 + 28 ≈ 256), which
 * avoids a gap opening under the keypad while still freeing vertical space for the amount area.
 */
export const MIN_KEY_ROW_HEIGHT = 57;

/** At or above this window height the keypad renders at its full design row height. */
export const KEYPAD_FULL_HEIGHT_MIN_SCREEN = 740;

/**
 * Row height adapted to the device: full {@link KEY_ROW_HEIGHT} on tall screens, scaled down
 * linearly toward {@link MIN_KEY_ROW_HEIGHT} on short/old devices so the whole 4-row grid fits
 * without squeezing the surrounding content. Falls back to the full height when the window height
 * is unknown (e.g. `0` in tests before layout).
 */
export function getResponsiveKeyRowHeight(windowHeight: number): number {
  if (!windowHeight || windowHeight >= KEYPAD_FULL_HEIGHT_MIN_SCREEN) return KEY_ROW_HEIGHT;
  const scaled = Math.round((windowHeight / KEYPAD_FULL_HEIGHT_MIN_SCREEN) * KEY_ROW_HEIGHT);
  return Math.max(MIN_KEY_ROW_HEIGHT, Math.min(KEY_ROW_HEIGHT, scaled));
}

/** Largest press-circle diameter that fits inside a key cell (bounded by both cell width and row height). */
export function getPressCircleSize(cellWidth: number, rowHeight: number = KEY_ROW_HEIGHT): number {
  return Math.min(cellWidth, rowHeight);
}

/** Vertical gap between key rows, in points. Figma cells abut (no inter-row gap). */
export const KEY_ROW_GAP = 0;

/**
 * Intrinsic height of the premium keypad: 4 rows + 3 inter-row gaps.
 * Mirror this into the execution layout's reserved area constant.
 */
export const KEYPAD_INTRINSIC_HEIGHT = KEY_ROW_HEIGHT * 4 + KEY_ROW_GAP * 3;

/** Height of the optional top band (rounded-top hairline edge + grabber) above the key rows. */
export const KEYPAD_TOP_BAND_HEIGHT = 28;

/** Corner radius for the keypad panel's rounded top edge (SVG outline). */
export const KEYPAD_TOP_RADIUS = 32;

/** Stroke width of the hairline top edge outline. */
export const KEYPAD_EDGE_STROKE_WIDTH = 1.2;

/**
 * How far the outline extends below the top before it fully fades out. Kept just
 * past the corner radius so the side hairlines dissolve gradually as they descend
 * (the gradient reaches full transparency at this y), matching the Figma "Keyboard Top".
 */
export const KEYPAD_EDGE_FADE_HEIGHT = 25;

/** Width of the grabber pill inside the top band. */
export const KEYPAD_GRABBER_WIDTH = 24;

/** Height of the grabber pill inside the top band. */
export const KEYPAD_GRABBER_HEIGHT = 4;
