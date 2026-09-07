import type { FontWeightKey } from './font-mapping';

/**
 * Skia-side typeface registry.
 *
 * Skia maintains its own font registry that is completely separate
 * from the `expo-font` registry that drives RN `<Text>` rendering, so
 * any component that draws text through Skia (e.g. `EtBlurredText`)
 * has to load the TTFs directly via `useFont(asset, size)`.
 *
 * The TTFs ship with the lib (`../assets/fonts/`) so `etoro-ui` stays
 * a leaf in the project graph — pulling them from `apps/etoro-mobile`
 * would draw a `ui → app` edge and close a cycle through every
 * feature lib that already depends on `ui`. The app continues to
 * register its own copy with `expo-font`; consolidating onto this
 * single copy is a follow-up.
 */
const FONT_LIGHT = require('../assets/fonts/eToro0.7-Light.ttf');
const FONT_REGULAR = require('../assets/fonts/eToro0.7-Regular.ttf');
const FONT_MEDIUM = require('../assets/fonts/eToro0.7-Medium.ttf');
const FONT_SEMIBOLD = require('../assets/fonts/eToro0.7-Semibold.ttf');
const FONT_BOLD = require('../assets/fonts/eToro0.7-Bold.ttf');
const FONT_EXTRABOLD = require('../assets/fonts/eToro0.7-Extrabold.ttf');

/**
 * Maps a design-system `FontWeightKey` to the Metro asset handle for
 * the matching eToro TTF. Asset handles are opaque numeric ids that
 * Skia's `useFont` resolves to a typeface; callers should not depend
 * on the concrete value.
 */
const SKIA_FONT_BY_WEIGHT: Record<FontWeightKey, number> = {
  light: FONT_LIGHT,
  regular: FONT_REGULAR,
  medium: FONT_MEDIUM,
  semiBold: FONT_SEMIBOLD,
  bold: FONT_BOLD,
  extraBold: FONT_EXTRABOLD,
};

/**
 * Looks up the eToro TTF asset matching a design-system font weight.
 * Use this with Skia's `useFont(asset, size)` hook when you need to
 * render text through a Skia `<Canvas>` (for blur, masking, custom
 * paint, etc.).
 */
export function getSkiaFontAsset(weight: FontWeightKey): number {
  return SKIA_FONT_BY_WEIGHT[weight];
}
