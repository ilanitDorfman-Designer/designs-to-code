import type { ColorValue } from 'react-native';
import { Platform } from 'react-native';

import type { EtMediaCardVariant } from '../api/types';

/**
 * Figma Media card full-surface "Overlay" layer
 * (`63232:318093` / DS — React):
 *
 * ```
 * background: linear-gradient(180deg, rgba(255,255,255,0.75) 0%, rgba(44,44,44,0) 100%);
 * mix-blend-mode: overlay;
 * ```
 *
 * Same recipe family as crypto-card's `getOverlayColor` (there: white @ `0.4`),
 * but Media card uses Figma's `0.75` stop. Not a shared component — different opacity.
 */
export const MEDIA_CARD_OVERLAY_COLORS: readonly [ColorValue, ColorValue] = ['rgba(255, 255, 255, 0.75)', 'rgba(44, 44, 44, 0)'];

export interface MediaCardOverlayResolved {
  colors: readonly [ColorValue, ColorValue];
  useMixBlendOverlay: boolean;
}

/**
 * Resolves full-card gloss overlay colours + whether to apply `mix-blend-mode: overlay`.
 *
 * On Android the blend mode reads as a milky wash over dark fills — use a softer
 * gradient and skip the blend mode so the gloss matches iOS more closely.
 */
export function resolveMediaCardOverlay(variant: EtMediaCardVariant, isBright = false): MediaCardOverlayResolved {
  if (Platform.OS !== 'android') {
    return {
      colors: MEDIA_CARD_OVERLAY_COLORS,
      useMixBlendOverlay: supportsMediaCardOverlayMixBlend(),
    };
  }

  const colors =
    variant === 'dark' && !isBright
      ? (['rgba(255, 255, 255, 0.12)', 'rgba(44, 44, 44, 0)'] as const)
      : (['rgba(255, 255, 255, 0.32)', 'rgba(44, 44, 44, 0)'] as const);

  return { colors, useMixBlendOverlay: false };
}

/**
 * Android Q (API 29) is the first release with the BlendMode APIs RN uses for
 * `mixBlendMode`. On API 28 (Pie) the style is unsupported — omit it and keep
 * the gradient gloss without blend.
 */
export const ANDROID_MIX_BLEND_MIN_API = 29;

/** Whether the full-card Overlay may set `mixBlendMode: 'overlay'`. */
export function supportsMediaCardOverlayMixBlend(): boolean {
  if (Platform.OS !== 'android') {
    return true;
  }
  const version = typeof Platform.Version === 'number' ? Platform.Version : Number.parseInt(String(Platform.Version), 10);
  return Number.isFinite(version) && version >= ANDROID_MIX_BLEND_MIN_API;
}
