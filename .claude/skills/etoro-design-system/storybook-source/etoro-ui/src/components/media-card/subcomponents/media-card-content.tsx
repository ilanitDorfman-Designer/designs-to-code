import MaskedView from '@react-native-masked-view/masked-view';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { memo } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { X1, X2, X4, X5 } from '../../../core/styles/spacing';
import { EtText } from '../../../foundations/text';
import type { MediaCardContentProps, MediaCardSlotType } from '../api';
import { useMediaCardContext } from '../api';
import { resolveMediaCardBlurLayerProps } from '../utils';

/**
 * Figma `BACKGROUND_BLUR` radius 8 ≈ CSS `backdrop-filter: blur(4px)`.
 * expo-blur is much heavier than CSS on light surfaces — keep bright low.
 */
const CONTENT_BLUR_INTENSITY = 20;

/**
 * Pull frost above the content top so it covers the lower half of the
 * background logo (Figma medium: logo 80×80 at y≈41, content at y≈74 → ~33px
 * overhang). Soft mask still starts transparent at this elevated top — no seam.
 */
const CONTENT_FROST_PULL_UP = {
  small: 0,
  medium: 40,
  large: 48,
} as const;

/**
 * Progressive mask for blur + tint (Figma progressive BG blur):
 * alpha **0 at the elevated frost top** (no hard seam) → full at bottom
 * (darker behind text / lower logo). Dense early stops avoid a visible line.
 *
 * DARK/STANDARD cards: White gradient (light at top, transparent at bottom)
 */
const PROGRESSIVE_MASK_COLORS_DARK_STANDARD = [
  'rgba(255,255,255,0)',
  'rgba(255,255,255,0.06)',
  'rgba(255,255,255,0.16)',
  'rgba(255,255,255,0.35)',
  'rgba(255,255,255,0.58)',
  'rgba(255,255,255,0.82)',
  'rgba(255,255,255,1)',
] as const;

/**
 * BRIGHT cards: Dark gradient (dark at top, transparent at bottom)
 */
const PROGRESSIVE_MASK_COLORS_BRIGHT = [
  'rgba(0,0,0,0)',
  'rgba(0,0,0,0.06)',
  'rgba(0,0,0,0.16)',
  'rgba(0,0,0,0.35)',
  'rgba(0,0,0,0.58)',
  'rgba(0,0,0,0.82)',
  'rgba(0,0,0,1)',
] as const;
const PROGRESSIVE_MASK_LOCATIONS = [0, 0.08, 0.2, 0.38, 0.58, 0.8, 1] as const;

/**
 * Figma tint colors per variant.
 * DARK/STANDARD: Carbon Neutral 050 (white) `#FFF` @ `0.08`
 * BRIGHT: Carbon Neutral 900 (dark) `#1B1E21` @ `0.08`
 * Progressive fill: clear at top → full tint at bottom (same direction as the mask).
 */
const FROST_TINT_COLORS_DARK_STANDARD = ['transparent', 'rgba(255, 255, 255, 0.08)'] as const;
const FROST_TINT_COLORS_BRIGHT = ['transparent', 'rgba(27, 30, 33, 0.08)'] as const;

/**
 * EtMediaCard.Content — main body region. Optional on medium / large.
 *
 * Layout (Figma "Content + overlay slot"):
 * - padding `20 20 16 20` — `X5` / `X5` / `X4` / `X5`
 * - column / `flex-end` / stretch
 *
 * Overlay (Figma progressive frost):
 * 1. BG blur (`blur(4px)`) inside progressive mask — soft at top, strong at bottom
 * 2. `#1B1E21` @ `0.08` — same direction (darker at bottom, no top seam)
 * 3. Frost extends **above** the content top (medium +40 / large +48) so the
 *    background logo sits in the blur, not only the text band
 *
 * Pass {@link MediaCardContentProps.blur} `={false}` to opt out.
 */
function MediaCardContentComponent({
  children,
  blur,
  eyebrow,
  title,
  description,
  onPress,
  accessibilityLabel,
  style,
  testID,
}: MediaCardContentProps) {
  const { size, foregroundColor, isBright } = useMediaCardContext();
  const showOverlay = blur !== false;
  const hasStructured = Boolean(eyebrow || title || description);
  const isWeb = Platform.OS === 'web';
  /** Android `dimezisBlurView` frosts milky white — iOS-only blur; Android uses scrim-only frost. */
  const includeNativeBlur = Platform.OS === 'ios';
  const blurTint = isBright ? 'light' : 'default';
  const blurProps = resolveMediaCardBlurLayerProps(CONTENT_BLUR_INTENSITY, blurTint);
  const frostPullUp = CONTENT_FROST_PULL_UP[size];

  // Use variant-specific mask and tint colors
  const progressiveMaskColors = isBright ? PROGRESSIVE_MASK_COLORS_BRIGHT : PROGRESSIVE_MASK_COLORS_DARK_STANDARD;
  const frostTintColors = isBright ? FROST_TINT_COLORS_BRIGHT : FROST_TINT_COLORS_DARK_STANDARD;

  const blurLayer = includeNativeBlur ? (
    <BlurView {...blurProps} style={StyleSheet.absoluteFillObject} testID={testID ? `${testID}-blur` : 'media-card-content-blur'} />
  ) : null;

  const scrimLayer = (
    <LinearGradient
      colors={[...frostTintColors]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={StyleSheet.absoluteFillObject}
      testID={testID ? `${testID}-scrim` : 'media-card-content-scrim'}
    />
  );

  // MaskedView has no web implementation — fall back to unmasked frost on web.
  const frostLayers = isWeb ? (
    <View pointerEvents="none" style={[styles.frost, { top: -frostPullUp }]}>
      {scrimLayer}
    </View>
  ) : (
    <MaskedView
      pointerEvents="none"
      style={[styles.frost, { top: -frostPullUp }]}
      maskElement={
        <LinearGradient
          colors={[...progressiveMaskColors]}
          locations={[...PROGRESSIVE_MASK_LOCATIONS]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFillObject}
          testID={testID ? `${testID}-mask` : 'media-card-content-mask'}
        />
      }
    >
      {blurLayer}
      {scrimLayer}
    </MaskedView>
  );

  const inner = (
    <View style={[styles.inner, size === 'small' && styles.smallInner]} testID={testID ? `${testID}-inner` : undefined}>
      {hasStructured ? (
        <MediaCardContentStack eyebrow={eyebrow} title={title} description={description} foregroundColor={foregroundColor} />
      ) : (
        children
      )}
    </View>
  );

  return (
    <View style={[styles.container, size === 'small' && styles.smallContainer, size === 'small' && styles.smallCentered, style]} testID={testID}>
      {showOverlay ? frostLayers : null}
      {onPress ? (
        <Pressable
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel}
          style={styles.pressableInner}
          testID={testID ? `${testID}-pressable` : undefined}
        >
          {inner}
        </Pressable>
      ) : (
        inner
      )}
    </View>
  );
}

function MediaCardContentStack({
  eyebrow,
  title,
  description,
  foregroundColor,
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
  foregroundColor: string;
}) {
  const hasHeadlineStack = Boolean(eyebrow || title);

  if (!hasHeadlineStack) {
    return description ? (
      <EtText variant="body-tiny-medium" style={{ color: foregroundColor }} numberOfLines={3}>
        {description}
      </EtText>
    ) : null;
  }

  return (
    <View style={styles.contentStack}>
      <View style={styles.headlineStack}>
        {eyebrow ? (
          <EtText variant="body-secondary-medium" style={{ color: foregroundColor }} numberOfLines={1}>
            {eyebrow}
          </EtText>
        ) : null}
        {title ? (
          <EtText variant="body-base-semibold" style={{ color: foregroundColor }} numberOfLines={3}>
            {title}
          </EtText>
        ) : null}
      </View>
      {description ? (
        <EtText variant="label-tertiary-regular" style={{ color: foregroundColor }} numberOfLines={3}>
          {description}
        </EtText>
      ) : null}
    </View>
  );
}

export const MediaCardContent = memo(MediaCardContentComponent);
MediaCardContent.displayName = 'EtMediaCard.Content';
(MediaCardContent as typeof MediaCardContent & { __SLOT_TYPE: MediaCardSlotType }).__SLOT_TYPE = 'content';

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    minHeight: 68,
    minWidth: 68,
    zIndex: 1,
    // Let frost paint above the content top over the background logo.
    overflow: 'visible',
  },
  /** Absolute frost layer — `top` is set to `-CONTENT_FROST_PULL_UP[size]`. */
  frost: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  inner: {
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    gap: X1,
    paddingTop: X5,
    paddingRight: X5,
    paddingBottom: X4,
    paddingLeft: X5,
    zIndex: 1,
  },
  pressableInner: {
    alignSelf: 'stretch',
    zIndex: 1,
  },
  smallInner: {
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentStack: {
    alignSelf: 'stretch',
    gap: X2,
  },
  headlineStack: {
    alignSelf: 'stretch',
    gap: X1,
  },
  smallCentered: {
    alignItems: 'center',
  },
  smallContainer: {
    minHeight: 0,
    minWidth: 0,
  },
});
