import { memo } from 'react';
import { type ImageSourcePropType, StyleSheet, View } from 'react-native';

import { EtAvatar } from '../../social/avatar';
import type { MediaCardLogoProps, MediaCardSlotType } from '../api';
import { useMediaCardContext } from '../api';

const DEFAULT_LOGO_SIZE = {
  /** Figma small asset card mark. */
  small: 48,
  /** Figma medium "Slot" / watermark — 80×80 (e.g. bright card logo at y≈41). */
  medium: 80,
  /** Figma large watermark. */
  large: 96,
} as const;

/** EtAvatar `large` pixel size — the base we scale from to reach `logoSize`. */
const AVATAR_BASE_SIZE = 48;

/**
 * Maps {@link ImageSourcePropType} onto {@link EtAvatar.Image}.
 * Remote `{ uri }` sources go through `src`; bundled `require(...)` ids (and
 * source arrays) go through `source` so expo-image can load them.
 */
function resolveAvatarImage(source: ImageSourcePropType): { src?: string; source?: ImageSourcePropType } | undefined {
  if (typeof source === 'number') {
    return { source };
  }
  if (Array.isArray(source) && source.length > 0) {
    return { source };
  }
  if (source && typeof source === 'object' && 'uri' in source && typeof source.uri === 'string' && source.uri.length > 0) {
    return { src: source.uri };
  }
  return undefined;
}

/**
 * EtMediaCard.Logo — asset / brand logo rendered via the shared {@link EtAvatar}.
 *
 * - `boxed` (default) — the instrument avatar (rounded square + brand fill +
 *   gradient overlay), matching the portfolio-list instrument avatar.
 * - `boxed={false}` — just the logo mark, no background box, for surfaces that
 *   already carry the brand colour (e.g. the small asset card).
 *
 * Placement:
 * - `placement="inline"` (default) — in content flow (small card)
 * - `placement="background"` — crisp, full-opacity mark centred on top of the
 *   card background; the frosted content strip layers over it and only the
 *   overlapping part is blurred (the logo itself is never blurred — Figma)
 *
 * EtAvatar tops out at 48px, so larger `size`s are reached with a scale
 * transform (the artwork is vector / high-res, so it stays crisp).
 */
function MediaCardLogoComponent({ source, size, boxed = true, backgroundColor, fallback, accessibilityLabel, style, testID }: MediaCardLogoProps) {
  const { size: cardSize } = useMediaCardContext();
  const logoSize = size ?? DEFAULT_LOGO_SIZE[cardSize];
  const scale = logoSize / AVATAR_BASE_SIZE;
  const image = resolveAvatarImage(source);

  return (
    <View style={[styles.placement, { width: logoSize, height: logoSize }, style]} testID={testID} pointerEvents="none">
      <View style={{ transform: [{ scale }] }}>
        <EtAvatar
          size="large"
          shape="square"
          variant={boxed ? 'instrument' : 'default'}
          imageBackgroundColor={boxed ? backgroundColor : undefined}
          accessibilityLabel={accessibilityLabel}
        >
          {image ? (
            <EtAvatar.Image {...(image.src ? { src: image.src } : { source: image.source })} contentFit={boxed ? 'cover' : 'contain'} />
          ) : null}
          <EtAvatar.Fallback>{fallback ?? '—'}</EtAvatar.Fallback>
        </EtAvatar>
      </View>
    </View>
  );
}

export const MediaCardLogo = memo(MediaCardLogoComponent);
MediaCardLogo.displayName = 'EtMediaCard.Logo';
(MediaCardLogo as typeof MediaCardLogo & { __SLOT_TYPE: MediaCardSlotType }).__SLOT_TYPE = 'logo';

const styles = StyleSheet.create({
  placement: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
  },
});
