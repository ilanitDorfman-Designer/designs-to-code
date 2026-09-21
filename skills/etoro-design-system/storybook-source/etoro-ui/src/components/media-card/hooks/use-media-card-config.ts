import { useMemo } from 'react';
import type { DimensionValue } from 'react-native';

import type { eToroTheme } from '../../../core/styles/colors';
import type { EtMediaCardProps, EtMediaCardSize, EtMediaCardVariant, MediaCardContextValue } from '../api';
import { classifyBackgroundTone, MEDIA_CARD_PADDING, MEDIA_CARD_SIZES, prefersDarkForeground, resolveMediaCardVariantColors } from '../utils';

export interface MediaCardConfig {
  size: EtMediaCardSize;
  variant: EtMediaCardVariant;
  padding: number;
  dimensions: { width: DimensionValue; height: DimensionValue };
  backgroundColor: string;
  foregroundColor: string;
  borderColor?: string;
  contextValue: MediaCardContextValue;
}

/**
 * Resolves size, variant colours, and context for EtMediaCard.
 *
 * Text colour comes from the effective surface tone:
 * - Explicit `bright` / `dark` variants always win.
 * - On `standard` solid fills, {@link classifyBackgroundTone} maps chrome
 *   (`isBright`) from near-white / near-black only — yellow / gold stay
 *   `standard`. {@link prefersDarkForeground} still flips labels to dark text
 *   when white-on-fill is below WCAG AA 4.5:1 for normal text.
 * - Image / video fills skip colour classification and keep the variant tone.
 *
 * Header / content / footer padding is a uniform `X5` (see {@link MEDIA_CARD_PADDING}).
 */
export function useMediaCardConfig({
  props,
  colors,
  hasBackgroundMedia = false,
  hasBackgroundLogo = false,
}: {
  props: Pick<EtMediaCardProps, 'size' | 'variant' | 'backgroundColor' | 'width' | 'height'>;
  colors: eToroTheme['colors'];
  /** True when root has image or video fill. */
  hasBackgroundMedia?: boolean;
  /** True when a background-placed Logo slot is present. */
  hasBackgroundLogo?: boolean;
}): MediaCardConfig {
  const size = props.size ?? 'medium';
  const variant = props.variant ?? 'standard';

  return useMemo(() => {
    const sizePreset = MEDIA_CARD_SIZES[size];
    // Consumers (smart components) can override the preset width / height.
    const dimensions = {
      width: props.width ?? sizePreset.width,
      height: props.height ?? sizePreset.height,
    };
    const padding = MEDIA_CARD_PADDING;
    const variantColors = resolveMediaCardVariantColors(variant, colors);
    const backgroundColor = props.backgroundColor ?? variantColors.defaultBackgroundColor;

    // Explicit bright/dark variant wins. Otherwise classify the solid fill so a
    // white brand colour gets dark text and charcoal gets the dark tone.
    const surfaceTone: EtMediaCardVariant =
      variant === 'bright' || variant === 'dark' ? variant : hasBackgroundMedia ? 'standard' : classifyBackgroundTone(backgroundColor);

    const surfaceColors = resolveMediaCardVariantColors(surfaceTone, colors);
    const isBrightSurface = surfaceTone === 'bright';
    const foregroundColor =
      variant === 'standard' && !hasBackgroundMedia && prefersDarkForeground(backgroundColor)
        ? colors.carbonStatic900
        : surfaceColors.foregroundColor;

    const contextValue: MediaCardContextValue = {
      size,
      padding,
      variant,
      foregroundColor,
      isBright: isBrightSurface,
      hasBackgroundMedia,
      hasBackgroundLogo,
    };

    return {
      size,
      variant,
      padding,
      dimensions,
      backgroundColor,
      foregroundColor,
      borderColor: surfaceColors.borderColor ?? variantColors.borderColor,
      contextValue,
    };
  }, [size, variant, props.backgroundColor, props.width, props.height, colors, hasBackgroundMedia, hasBackgroundLogo]);
}
