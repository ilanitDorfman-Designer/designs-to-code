import { Platform } from 'react-native';

import { neutralV2 } from '../../../core/styles/colors/primitives';
import type { EtMediaCardVariant } from '../api/types';

/**
 * Glass footer overlay presets (Figma "Glass card footer"), keyed by card variant.
 *
 * - `media` — `standard` variant:
 *   Carbon Neutral 900 static `#1B1E21` @ `0.15` + light glass blur (text: Carbon 050 static)
 * - `muted` — `dark` / `bright` variants:
 *   Carbon Neutral 500 static `#999999` @ `0.1` + light glass blur
 *   (text: Carbon 050 static on `dark`, Carbon 900 static on `bright`)
 */
export type MediaCardFooterOverlay = 'media' | 'muted';

export interface MediaCardFooterOverlayResolved {
  color: string;
  opacity: number;
}

/**
 * Default glass footer preset from card variant + effective surface tone.
 * Near-white `standard` fills ({@link classifyBackgroundTone} → `bright`) use `muted` like `bright` cards.
 */
export function resolveMediaCardFooterOverlayPreset(variant: EtMediaCardVariant, isBright: boolean): MediaCardFooterOverlay {
  if (isBright || variant !== 'standard') {
    return 'muted';
  }
  return 'media';
}

/** Carbon Neutral 500 primitive — Figma `--Carbon-Neutral-500` (static, not theme-flipped). */
const CARBON_NEUTRAL_500 = neutralV2[500];

/**
 * Android bright footer fill — mirrors {@link useGlassSurface} `ANDROID_LIGHT_FALLBACK_BACKGROUND`.
 * Grey scrim over dimezis blur reads muddy on white card fills without this base.
 */
export const ANDROID_BRIGHT_FOOTER_FILL = 'rgba(255, 255, 255, 0.76)';

/**
 * Resolves glass footer scrim colour + opacity.
 *
 * @param overlay - Preset (`media` | `muted`). @default `'media'`
 * @param carbonStatic900 - Theme token `colors.carbonStatic900` (`#1B1E21`)
 * @param isBright - Effective bright surface (explicit `bright` variant or near-white standard fill)
 * @param carbonStatic050 - Theme token `colors.carbonStatic050` for Android bright scrim
 */
export function resolveMediaCardFooterOverlay(
  overlay: MediaCardFooterOverlay = 'media',
  carbonStatic900: string,
  isBright = false,
  carbonStatic050?: string,
): MediaCardFooterOverlayResolved {
  if (overlay === 'muted') {
    if (Platform.OS === 'android' && isBright) {
      return { color: carbonStatic050 ?? '#FFFFFF', opacity: 0.08 };
    }
    return { color: CARBON_NEUTRAL_500, opacity: 0.1 };
  }
  return { color: carbonStatic900, opacity: 0.15 };
}

/** Android dimezis frost is lighter than iOS — a small scrim bump is enough; heavy scrims read muddy. */
const ANDROID_FOOTER_SCRIM_OPACITY: Record<MediaCardFooterOverlay, number> = {
  media: 0.17,
  muted: 0.11,
};

/**
 * Resolves footer scrim opacity, boosting on Android when the caller did not override it.
 * Bright cards keep the iOS muted opacity — a grey scrim bump reads too dark on white fills.
 */
export function resolveMediaCardFooterScrimOpacity(
  overlay: MediaCardFooterOverlay,
  iosOpacity: MediaCardFooterOverlayResolved['opacity'],
  override?: number,
  isBright = false,
): number {
  if (override != null) {
    return override;
  }
  if (Platform.OS === 'android') {
    if (isBright) {
      return iosOpacity;
    }
    return ANDROID_FOOTER_SCRIM_OPACITY[overlay];
  }
  return iosOpacity;
}
