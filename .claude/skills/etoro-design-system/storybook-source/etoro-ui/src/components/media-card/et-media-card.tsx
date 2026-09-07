import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { memo, ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { useEtoroTheme } from '../../core/hooks';
import { HALF, X2, X4, X6, X8 } from '../../core/styles/spacing';
import { MediaCardProvider, useMediaCardContext } from './api/context';
import type { EtMediaCardProps } from './api/types';
import { useMediaCardChildren, useMediaCardConfig } from './hooks';
import {
  MediaCardBackgroundVideo,
  MediaCardBadge,
  MediaCardContent,
  MediaCardFooter,
  MediaCardHeader,
  MediaCardLogo,
  MediaCardSubtitle,
  MediaCardTitle,
} from './subcomponents';
import { resolveMediaCardOverlay } from './utils';

// ============================================================================
// Layouts
// ============================================================================

interface LayoutProps {
  headerChild: ReactNode | undefined;
  contentChild: ReactNode | undefined;
  footerChild: ReactNode | undefined;
  logoChild: ReactNode | undefined;
  titleChild: ReactNode | undefined;
  subtitleChild: ReactNode | undefined;
}

/**
 * Small layout — logo top, title/subtitle bottom (`space-between`).
 * Padding: 34 / X6 / 24 / X6 (Figma small card 128×164).
 */
function SmallLayout({ logoChild, contentChild, titleChild, subtitleChild }: LayoutProps) {
  return (
    <View style={styles.smallBody}>
      {logoChild}
      {contentChild ?? (
        <View style={styles.smallTextStack}>
          {titleChild}
          {subtitleChild ? <View style={styles.smallSubtitle}>{subtitleChild}</View> : null}
        </View>
      )}
    </View>
  );
}

type ExpandedLayoutProps = LayoutProps & { bodyTestID?: string };

/**
 * Medium / large layout — optional header, logo (watermark), content, footer.
 * Header uses card `padding` horizontally; Content owns its own insets (Figma).
 *
 * Content height:
 * - **min** `68` (Figma)
 * - **max** = card − header (if any) − footer (if any) — enforced by the flex
 *   spacer above; content grows with its children up to that remaining space
 * - **large**: same rules — height stretches with inner content (no forced fill)
 *
 * Content frost may extend above the content top (over the background logo).
 */
function ExpandedLayout({ headerChild, contentChild, footerChild, logoChild, bodyTestID }: ExpandedLayoutProps) {
  const { padding } = useMediaCardContext();

  return (
    <View style={styles.expandedRoot}>
      <View style={[styles.expandedBody, { paddingTop: padding }]} testID={bodyTestID}>
        {logoChild ? (
          <View style={styles.logoRegion} pointerEvents="none">
            {logoChild}
          </View>
        ) : null}
        {headerChild ? <View style={[styles.headerRegion, { paddingHorizontal: padding }]}>{headerChild}</View> : null}
        <View style={styles.bodySpacer} />
        {contentChild ? <View style={styles.contentRegion}>{contentChild}</View> : null}
      </View>
      {footerChild}
    </View>
  );
}

// ============================================================================
// Root
// ============================================================================

/**
 * EtMediaCard — DS media / asset card with size variants.
 *
 * Does **not** modify `EtCard`. Card fill is colour, image, or video
 * (precedence: `backgroundVideo` → `backgroundImage` → `backgroundColor`).
 *
 * @example Colour fill (e.g. asset logo brand colour)
 * ```tsx
 * <EtMediaCard size="small" variant="standard" backgroundColor="#CC2914">
 *   <EtMediaCard.Logo source={{ uri: logoUrl }} />
 *   <EtMediaCard.Title>186.79</EtMediaCard.Title>
 *   <EtMediaCard.Subtitle>▲ 4.35%</EtMediaCard.Subtitle>
 * </EtMediaCard>
 * ```
 *
 * @example Image or video fill
 * ```tsx
 * <EtMediaCard size="medium" backgroundImage={{ uri: heroUrl }} />
 * <EtMediaCard size="large" backgroundVideo="https://…/clip.mp4" />
 * ```
 *
 * @example Override the preset dimensions (e.g. fill a carousel slot)
 * ```tsx
 * <EtMediaCard size="medium" width="100%" height={260} … />
 * ```
 */
function MediaCardComponent({
  size,
  width,
  height,
  variant,
  backgroundColor,
  backgroundImage,
  backgroundVideo,
  backgroundVideoPaused = false,
  overlay = false,
  children,
  accessibilityLabel,
  style,
  testID,
}: EtMediaCardProps) {
  const { colors } = useEtoroTheme();
  const slots = useMediaCardChildren(children);
  const hasBackgroundMedia = Boolean(backgroundImage || backgroundVideo);
  const config = useMediaCardConfig({
    props: { size, variant, backgroundColor, width, height },
    colors,
    hasBackgroundMedia,
    hasBackgroundLogo: slots.hasBackgroundLogo,
  });

  const rootStyle = [
    styles.container,
    {
      width: config.dimensions.width,
      height: config.dimensions.height,
    },
    style,
  ];

  const surfaceStyle = [
    styles.surface,
    {
      backgroundColor: config.backgroundColor,
      borderColor: config.borderColor,
      borderWidth: config.borderColor ? StyleSheet.hairlineWidth : 0,
    },
  ];

  const body =
    config.size === 'small' ? <SmallLayout {...slots} /> : <ExpandedLayout {...slots} bodyTestID={testID ? `${testID}-body` : undefined} />;

  const cardOverlay = resolveMediaCardOverlay(config.contextValue.variant, config.contextValue.isBright);

  const content = (
    <MediaCardProvider value={config.contextValue}>
      <View style={surfaceStyle} testID={testID ? `${testID}-surface` : undefined}>
        {backgroundVideo ? (
          <View style={styles.backgroundMedia} pointerEvents="none">
            <MediaCardBackgroundVideo source={backgroundVideo} paused={backgroundVideoPaused} />
          </View>
        ) : backgroundImage ? (
          <View style={styles.backgroundMedia} pointerEvents="none">
            <Image source={backgroundImage} style={StyleSheet.absoluteFillObject} contentFit="cover" />
          </View>
        ) : null}
        {/*
          Figma Media card "Overlay" (`63232:318093`): full-surface top→bottom gloss
          with mix-blend overlay. Opt-in via `overlay` (EtAssetCard enables it).
        */}
        {overlay ? (
          <LinearGradient
            colors={[...cardOverlay.colors]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            pointerEvents="none"
            style={[styles.cardOverlay, cardOverlay.useMixBlendOverlay ? styles.cardOverlayBlend : null]}
            testID={testID ? `${testID}-overlay` : 'media-card-overlay'}
          />
        ) : null}
        {body}
      </View>
    </MediaCardProvider>
  );

  return (
    <View style={rootStyle} testID={testID} accessibilityLabel={accessibilityLabel}>
      {content}
    </View>
  );
}

// ============================================================================
// Compound Assembly
// ============================================================================

const MediaCardBase = memo(MediaCardComponent);
MediaCardBase.displayName = 'EtMediaCard';

/**
 * EtMediaCard compound component.
 *
 * Subcomponents:
 * - `Logo` / `Title` / `Subtitle` — small asset card stack
 * - `Header` / `Content` / `Footer` — medium / large optional regions
 * - `Badge` — translucent header pill (use inside `Header` start)
 */
export const EtMediaCard = Object.assign(MediaCardBase, {
  Header: MediaCardHeader,
  Content: MediaCardContent,
  Footer: MediaCardFooter,
  Logo: MediaCardLogo,
  Title: MediaCardTitle,
  Subtitle: MediaCardSubtitle,
  Badge: MediaCardBadge,
});

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    borderRadius: X4,
  },
  surface: {
    flex: 1,
    borderRadius: X4,
    overflow: 'hidden',
  },
  backgroundMedia: {
    ...StyleSheet.absoluteFillObject,
  },
  /** Figma "Overlay" — full card, behind body (zIndex 0). */
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  /**
   * Requires RN New Architecture (Fabric). Omitted on Android API ≤ 28 (Pie) —
   * BlendMode APIs start at API 29 — see {@link supportsMediaCardOverlayMixBlend}.
   */
  cardOverlayBlend: {
    mixBlendMode: 'overlay',
  },
  smallBody: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    // Figma small card: padding 34px X6 24px X6
    paddingTop: X8 + HALF,
    paddingHorizontal: X6,
    paddingBottom: X6,
  },
  smallTextStack: {
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  /** Figma: −2px between title (Num ML) and subtitle (Num XS). */
  smallSubtitle: {
    marginTop: -HALF,
  },
  expandedRoot: {
    flex: 1,
  },
  expandedBody: {
    flex: 1,
    zIndex: 1,
  },
  headerRegion: {
    marginBottom: X2,
    zIndex: 1,
  },
  /** Centred watermark drawn behind header / content (content covers its bottom). */
  logoRegion: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
  },
  /** Pushes the content strip to the bottom of the body, over the watermark. */
  bodySpacer: {
    flex: 1,
    minHeight: 0,
  },
  /**
   * Content slot — height hugs children (large stretches with content), clamped
   * between min 68 and the remaining body (card − header − footer) via flex.
   * `overflow: 'visible'` so content frost can extend up over the logo.
   */
  contentRegion: {
    zIndex: 1,
    minHeight: 68,
    flexShrink: 1,
    overflow: 'visible',
  },
});
