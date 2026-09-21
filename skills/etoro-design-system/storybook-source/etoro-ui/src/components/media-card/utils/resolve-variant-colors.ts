import type { eToroTheme } from '../../../core/styles/colors';
import type { EtMediaCardVariant } from '../api';

export interface MediaCardVariantColors {
  /**
   * Default solid fill when no `backgroundImage` / `backgroundVideo` is set.
   * For `standard`, callers typically override with asset brand colour.
   */
  defaultBackgroundColor: string;
  /**
   * Text / icon colour derived from {@link EtMediaCardVariant}:
   * - `bright` → `carbonStatic900` (Carbon/Neutral/900 static)
   * - `standard` | `dark` → `carbonStatic050` (Carbon/Neutral/050 static)
   */
  foregroundColor: string;
  borderColor?: string;
}

/**
 * Maps card `variant` → surface + text colours (theme tokens only).
 *
 * Variant is the single source of truth for foreground; do not pick text
 * colour independently of `variant`.
 */
export function resolveMediaCardVariantColors(variant: EtMediaCardVariant, colors: eToroTheme['colors']): MediaCardVariantColors {
  switch (variant) {
    case 'bright':
      return {
        defaultBackgroundColor: colors.carbonStatic050,
        foregroundColor: colors.carbonStatic900,
        borderColor: colors.dividerQuinary,
      };
    case 'dark':
      return {
        defaultBackgroundColor: colors.bgDarkSurface,
        foregroundColor: colors.carbonStatic050,
      };
    case 'standard':
    default:
      return {
        defaultBackgroundColor: colors.bgNeutralSecondary,
        foregroundColor: colors.carbonStatic050,
      };
  }
}
