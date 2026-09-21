import { Image } from 'expo-image';
import { memo, useMemo } from 'react';
import { View } from 'react-native';

import { useEtoroTheme } from '../../core/hooks/use-etoro-theme';
import type { EtIllustrationProps, IllustrationName, IllustrationSize } from './api/types';
import { ILLUSTRATION_SIZE_PX, resolveIllustrationSize } from './illustration-gallery';
import { ILLUSTRATION_META } from './illustration-meta';
import { getIllustrationUrl } from './utils/get-illustration-url';

/**
 * Compute render dimensions. `size` scales the illustration to *fit* the size token's
 * nominal box (aspect kept). When a size-specific variant asset exists for `name`
 * (e.g. the wide XL status art), its own intrinsic dimensions drive the aspect ratio;
 * otherwise the base asset's intrinsic dimensions do. Explicit `width`/`height` override.
 */
function resolveDimensions({ name, size, width, height }: { name: IllustrationName; size: IllustrationSize; width?: number; height?: number }): {
  width: number;
  height: number;
} {
  const meta = ILLUSTRATION_META[name];
  const variant = meta?.variants?.[size];
  const iw = variant?.width || meta?.width || ILLUSTRATION_SIZE_PX[size].width;
  const ih = variant?.height || meta?.height || ILLUSTRATION_SIZE_PX[size].height;

  if (width != null && height != null) {
    return { width, height };
  }
  if (width != null) {
    return { width, height: (width * ih) / iw };
  }
  if (height != null) {
    return { width: (height * iw) / ih, height };
  }
  // A dedicated size variant is drawn for that size in Figma — render it at its own
  // intrinsic dimensions (don't re-fit it into the token box, whose nominal aspect may
  // differ, e.g. the wide 375×158 status XL banners).
  if (variant) {
    return { width: iw, height: ih };
  }
  // Base asset: scale to *fit* the size token's nominal box (aspect ratio preserved).
  const box = ILLUSTRATION_SIZE_PX[size];
  const scale = Math.min(box.width / iw, box.height / ih);
  return { width: iw * scale, height: ih * scale };
}

/**
 * Internal renderer. Resolves theme from the app unless `theme` is passed, loads the CDN
 * asset via `expo-image`, and keeps a sized placeholder when metadata is missing.
 */
function EtIllustrationBase({ name, size: sizeProp, theme: themeProp, width, height, style, testID, accessibilityLabel }: EtIllustrationProps) {
  const { dark } = useEtoroTheme();
  const theme = themeProp ?? (dark ? 'dark' : 'light');
  const size = resolveIllustrationSize(name, sizeProp);
  const dimensions = resolveDimensions({ name, size, width, height });
  const label = accessibilityLabel ?? name;

  const uri = useMemo(() => getIllustrationUrl(name, theme, size), [name, theme, size]);

  // Unknown name / missing meta → empty placeholder (layout + a11y stay stable).
  if (!ILLUSTRATION_META[name]) {
    return (
      <View
        style={[{ width: dimensions.width, height: dimensions.height }, style]}
        testID={testID}
        accessibilityLabel={label}
        accessibilityRole="image"
      />
    );
  }

  return (
    <View
      style={[{ width: dimensions.width, height: dimensions.height }, style]}
      testID={testID}
      accessibilityLabel={label}
      accessibilityRole="image"
    >
      <Image
        source={{ uri }}
        style={{ width: dimensions.width, height: dimensions.height }}
        contentFit="contain"
        // Disk cache would keep a previous CDN upload at the same URL. Skip it in
        // development so `<EtIllustration name="…" />` shows the file you just shipped.
        cachePolicy={__DEV__ ? 'none' : 'disk'}
        recyclingKey={uri}
        accessible={false}
      />
    </View>
  );
}

EtIllustrationBase.displayName = 'EtIllustration';

/**
 * EtIllustration — Design System illustration loaded from the CDN.
 *
 * Pass a `name`; theme follows the app light/dark unless `theme` is set, and `size` defaults
 * to the illustration's Figma-native token (overridable). Dedicated size variants (e.g. the
 * wide XL status art) load a different asset; other sizes scale the base asset. Formats are
 * mixed per asset (PNG for feTurbulence art, SVG for flat line art) and resolved internally.
 *
 * @example
 * // Theme follows app light/dark automatically
 * <EtIllustration name="error" size="m" />
 *
 * @example
 * // Force dark asset (e.g. Storybook side-by-side)
 * <EtIllustration name="paper_plane" size="xxl" theme="dark" />
 */
export const EtIllustration = memo(EtIllustrationBase);
