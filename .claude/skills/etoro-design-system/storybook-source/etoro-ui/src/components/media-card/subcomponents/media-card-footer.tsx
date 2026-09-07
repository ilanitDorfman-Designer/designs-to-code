import { BlurView } from 'expo-blur';
import { memo } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { useEtoroTheme } from '../../../core/hooks';
import { X4, X5 } from '../../../core/styles/spacing';
import type { MediaCardFooterProps, MediaCardSlotType } from '../api';
import { useMediaCardContext } from '../api';
import {
  ANDROID_BRIGHT_FOOTER_FILL,
  resolveMediaCardBlurLayerProps,
  resolveMediaCardFooterOverlay,
  resolveMediaCardFooterOverlayPreset,
  resolveMediaCardFooterScrimOpacity,
} from '../utils';

/**
 * Footer glass blur — a light backdrop blur that works *with* the coloured scrim
 * to read as a solid glass strip. Deliberately lighter than the content frost
 * (see `media-card-content.tsx`): the footer's look comes mostly from its scrim,
 * whereas the content relies on the blur alone to frost the logo behind it.
 */
const FOOTER_BLUR_INTENSITY = 30;
/** Android dimezis blur is heavier — keep radius lower so brand colour still reads through. */
const FOOTER_BLUR_INTENSITY_ANDROID = 20;
/** Android bright footer — same intensity as {@link useGlassSurface} light blur. */
const FOOTER_BLUR_INTENSITY_ANDROID_BRIGHT = 58;

/**
 * EtMediaCard.Footer — bottom glass strip (medium / large).
 *
 * Layers (Figma "Glass card footer"):
 * 1. {@link BlurView} — light glass blur (works with the scrim below)
 * 2. Scrim preset (keyed by card variant when `overlay` is omitted):
 *    - `media` — `standard`: Carbon Neutral 900 static `#1B1E21` @ `0.15`
 *    - `muted` — `dark` / `bright`: Carbon Neutral 500 static `#999` @ `0.1`
 * 3. Slot children (ticker / price / etc.)
 *
 * Padding (Figma "Blur card footer"): always `X5` (20px) horizontal, `X4` (16px)
 * vertical — fixed regardless of the card `padding`.
 *
 * Blur tint follows the parent card `variant` from MediaCard context
 * (`bright` → light, otherwise dark).
 */
function MediaCardFooterComponent({
  children,
  overlay: overlayProp,
  overlayColor,
  overlayOpacity,
  onPress,
  accessibilityLabel,
  style,
  testID,
}: MediaCardFooterProps) {
  const { colors } = useEtoroTheme();
  const { variant, isBright } = useMediaCardContext();
  const overlay = overlayProp ?? resolveMediaCardFooterOverlayPreset(variant, isBright);

  const isAndroidBright = Platform.OS === 'android' && isBright;
  const preset = resolveMediaCardFooterOverlay(overlay, colors.carbonStatic900, isBright, colors.carbonStatic050);
  const scrimColor = overlayColor ?? preset.color;
  const scrimOpacity = resolveMediaCardFooterScrimOpacity(overlay, preset.opacity, overlayOpacity, isBright);
  const blurTint = isBright ? 'light' : 'dark';
  const androidBlurIntensity = isAndroidBright ? FOOTER_BLUR_INTENSITY_ANDROID_BRIGHT : FOOTER_BLUR_INTENSITY_ANDROID;
  const blurProps = resolveMediaCardBlurLayerProps(FOOTER_BLUR_INTENSITY, blurTint, androidBlurIntensity);

  const footerBody = (
    <View style={styles.content} testID={testID ? `${testID}-content` : undefined}>
      {children}
    </View>
  );

  return (
    <View style={[styles.glassRoot, style]} testID={testID}>
      {isAndroidBright ? (
        <View pointerEvents="none" style={[StyleSheet.absoluteFillObject, { backgroundColor: ANDROID_BRIGHT_FOOTER_FILL }]} />
      ) : null}
      {/* No blur on Android (iOS keeps native blur, web keeps its cheap CSS backdrop-filter):
          the Android dimezis blur re-captured the card on every draw of a recycling carousel
          cell for a frost the scrim below already approximates — mirrors `MediaCardContent`,
          whose Android path is scrim-only for the same reason (PAH-835). */}
      {Platform.OS !== 'android' && <BlurView {...blurProps} pointerEvents="none" style={StyleSheet.absoluteFillObject} />}
      <View
        pointerEvents="none"
        style={[styles.scrim, { backgroundColor: scrimColor, opacity: scrimOpacity }]}
        testID={testID ? `${testID}-overlay` : undefined}
      />
      {onPress ? (
        <Pressable
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel}
          style={styles.content}
          testID={testID ? `${testID}-pressable` : undefined}
        >
          {children}
        </Pressable>
      ) : (
        footerBody
      )}
    </View>
  );
}

export const MediaCardFooter = memo(MediaCardFooterComponent);
MediaCardFooter.displayName = 'EtMediaCard.Footer';
(MediaCardFooter as typeof MediaCardFooter & { __SLOT_TYPE: MediaCardSlotType }).__SLOT_TYPE = 'footer';

const styles = StyleSheet.create({
  glassRoot: {
    overflow: 'hidden',
    zIndex: 2,
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
  },
  // Figma "Blur card footer": X5 (20) horizontal, X4 (16) vertical — always.
  content: {
    paddingVertical: X4,
    paddingHorizontal: X5,
  },
});
