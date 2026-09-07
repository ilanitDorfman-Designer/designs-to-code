import type { ImageErrorEventData, ImageLoadEventData } from 'expo-image';
import { Image } from 'expo-image';
import { FC, memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';

import { useAvatarContext } from '../utils/context';
import { getBorderRadius, getSizeValue } from '../utils/styles';
import type { AvatarImageProps } from '../utils/types';

/**
 * Parses the background color encoded in eToro instrument SVG URLs.
 * URL format: `…/market-avatars/{id}/{id}_{bgHex}_{fgHex}.svg`
 * Returns a CSS hex color string (e.g. `#F7F7F7`) or undefined for non-SVG / unrecognised URLs.
 */
function parseSvgBackgroundColor(url: string): string | undefined {
  const match = url.match(/_([A-Fa-f0-9]{6})_[A-Fa-f0-9]{6}\.svg$/i);
  return match ? `#${match[1]}` : undefined;
}

/**
 * EtAvatar.Image - Image subcomponent for EtAvatar
 * Automatically sized based on parent avatar context.
 * When `src` is an eToro instrument SVG URL with encoded colors, the background
 * color is extracted and applied to the parent avatar container automatically.
 */
function AvatarImageBase({ src, onLoad, onError, style, ...rest }: AvatarImageProps) {
  const { size, shape, variant, setImageLoaded, setImageError, setSvgBackgroundColor } = useAvatarContext();

  const sizeValue = getSizeValue(size);
  const borderRadius = getBorderRadius(size, shape);

  const isInstrument = variant === 'instrument';
  const svgBgColor = useMemo(() => (isInstrument && src ? parseSvgBackgroundColor(src) : undefined), [src, isInstrument]);
  useEffect(() => {
    setSvgBackgroundColor(svgBgColor);
    return () => setSvgBackgroundColor(undefined);
  }, [svgBgColor, setSvgBackgroundColor]);

  // Recycling lists (FlashList) rebind this mounted instance to a different item. The root's
  // load state describes the OLD src, so reset it whenever src changes — otherwise a stale
  // `imageLoaded` suppresses the new item's fallback until (and unless) the new image loads.
  // Layout effect so the reset lands before the rebound item's first paint.
  const previousSrcRef = useRef(src);
  useLayoutEffect(() => {
    if (previousSrcRef.current === src) return;
    previousSrcRef.current = src;
    setImageLoaded(false);
    setImageError(false);
  }, [setImageError, setImageLoaded, src]);

  // Load state must not outlive this child: a consumer that conditionally drops the Image
  // (item recycled to an avatarless user) would otherwise leave `imageLoaded` set and hide
  // the sibling fallback indefinitely.
  useEffect(
    () => () => {
      setImageLoaded(false);
      setImageError(false);
    },
    [setImageError, setImageLoaded],
  );

  // Memoize source object to avoid inline object creation
  const source = useMemo(() => (src ? { uri: src } : undefined), [src]);

  // Memoize handlers with useCallback
  const handleLoad = useCallback(
    (event: ImageLoadEventData) => {
      setImageLoaded(true);
      setImageError(false);
      onLoad?.(event);
    },
    [setImageLoaded, setImageError, onLoad],
  );

  const handleError = useCallback(
    (event: ImageErrorEventData) => {
      setImageError(true);
      setImageLoaded(false);
      onError?.(event);
    },
    [setImageError, setImageLoaded, onError],
  );

  // Wrapper owns size + radius; image keeps its own explicit numeric size.
  const wrapperStyle = useMemo(() => ({ width: sizeValue, height: sizeValue, borderRadius }), [sizeValue, borderRadius]);
  const imageStyle = useMemo(() => ({ width: sizeValue, height: sizeValue, borderRadius }), [sizeValue, borderRadius]);

  // The wrapper owns borderRadius + overflow:hidden so the corners are clipped reliably:
  // expo-image on Android does not clip SVG content to its own borderRadius (works on iOS),
  // so an SVG instrument avatar renders square without this clipping parent.
  // The image MUST keep an explicit numeric width/height — expo-image needs a concrete
  // size to rasterize an SVG on Android; without it some SVGs silently render blank.
  return (
    <View style={[styles.clip, wrapperStyle, { borderRadius }]}>
      {/* recyclingKey clears the previously displayed bitmap when a recycled avatar switches src,
          instead of showing the old item's image until the new one decodes. */}
      <Image source={rest.source ?? source} recyclingKey={src} onLoad={handleLoad} onError={handleError} style={[imageStyle, style]} {...rest} />
    </View>
  );
}

AvatarImageBase.displayName = 'EtAvatar.Image';

export const AvatarImage: FC<AvatarImageProps> = memo(AvatarImageBase);

const styles = StyleSheet.create({
  clip: {
    position: 'absolute',
    top: 0,
    left: 0,
    overflow: 'hidden',
  },
});
