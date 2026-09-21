import { I18nManager, type TextStyle } from 'react-native';

/**
 * Canonical RTL helpers for the design system.
 *
 * RTL is enabled app-wide via `I18nManager.forceRTL(true)` (driven by the
 * selected language). React Native / Yoga then auto-flip `flexDirection: 'row'`,
 * the logical box props (`marginStart/End`, `paddingStart/End`, `start/end`) and
 * the default text alignment. What it does NOT flip — and therefore what these
 * helpers exist for — is **physical** geometry: directional icon glyphs and any
 * hand-rolled horizontal `translateX` / scroll-offset math.
 *
 * Centralising the `I18nManager` access here keeps direction logic in one place
 * (easy to mock in tests) instead of scattered across feature code.
 */

/** True when the app is laid out right-to-left (Arabic / Hebrew). */
export function isRTL(): boolean {
  return I18nManager.isRTL;
}

/**
 * Leading-edge alignment for text that can stretch or wrap. RN's default
 * `textAlign: 'auto'` follows the *script* of the string, so Latin fallbacks
 * stay physically left even when the app is RTL; `'left'` swaps to the leading
 * edge under `I18nManager` RTL. Shared so call sites don't hand-copy the rule.
 */
export const LEADING_TEXT_STYLE: TextStyle = {
  textAlign: 'left',
};

/**
 * Horizontal direction multiplier for hand-rolled `translateX` / scroll-offset
 * math: `-1` in RTL, `+1` in LTR. Multiply an LTR-derived horizontal offset by
 * this so sliders, indicators and carousels move toward the correct edge.
 */
export function rtlSign(): number {
  return I18nManager.isRTL ? -1 : 1;
}

/**
 * Icons that flip horizontally in RTL, by explicit opt-in — the same model as
 * Android's `android:autoMirrored` and iOS's
 * `imageFlippedForRightToLeftLayoutDirection`: mirroring is per-asset metadata,
 * never inferred from the name. Only glyphs that encode *reading/navigation
 * direction* belong here (chevrons, back/forward arrows). Glyphs that merely
 * contain a direction in their name encode something else and must stay out:
 * trend arrows (`arrow-up-right` = gains), external-link
 * (`arrow-up-right-from-square`), transfer/swap (`arrow-right-left`),
 * text-alignment and media icons.
 *
 * Names are listed in normalised form (kebab-case, no `-fill` suffix); both DS
 * icon systems' names resolve here via {@link isRtlMirroredIconName}.
 */
const RTL_MIRRORED_ICON_NAMES = new Set([
  // EtIconV2 / DS React gallery
  'angle-left',
  'angle-left-small',
  'angle-right',
  'angle-right-small',
  'arrow-left',
  'arrow-right',
  // Legacy EtoroIcon registry
  'chevron-left',
  'chevron-right',
]);

/** Normalise an icon name (camelCase → kebab-case, strip `-fill` variant suffix). */
function normalizeIconName(name: string): string {
  const kebab = name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  return kebab.endsWith('-fill') ? kebab.slice(0, -'-fill'.length) : kebab;
}

/**
 * Whether an icon name is registered as auto-mirroring in RTL
 * (see {@link RTL_MIRRORED_ICON_NAMES}).
 */
export function isRtlMirroredIconName(name?: string | null): boolean {
  return name != null && name !== '' && RTL_MIRRORED_ICON_NAMES.has(normalizeIconName(name));
}

const MIRROR_TRANSFORM = [{ scaleX: -1 as const }];

/**
 * Returns a horizontal-mirror transform (`scaleX: -1`) when the app is RTL and
 * the icon mirrors — either registered in {@link RTL_MIRRORED_ICON_NAMES} or
 * forced per-usage via `flipInRTL` — otherwise `undefined`. `flipInRTL` only
 * overrides *whether* the icon mirrors; nothing mirrors in LTR.
 */
export function rtlMirrorTransform(name?: string | null, flipInRTL?: boolean): typeof MIRROR_TRANSFORM | undefined {
  const shouldMirror = flipInRTL ?? isRtlMirroredIconName(name);
  return I18nManager.isRTL && shouldMirror ? MIRROR_TRANSFORM : undefined;
}
