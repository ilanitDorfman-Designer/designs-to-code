import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { useEtoroTheme } from '../../../../../core/hooks';
import { X1, X2, X6, X8, X10 } from '../../../../../core/styles/spacing';
import { EtText } from '../../../../../foundations/text';
import { usePostContext } from '../../context';
import { triggerHaptic } from '../../utils';

// ============================================================================
// Types (internal - not exported from api/types)
// ============================================================================

export interface VideoRendererProps {
  /** Video thumbnail image URL */
  thumbnailSource: string;
  /** Link preview title */
  title?: string;
  /** Host domain (e.g., "www.youtube.com") */
  host?: string;
  /** Link preview description */
  description?: string;
  /** Called when video attachment is pressed */
  onPress?: () => void;
  /** Override default styles */
  style?: StyleProp<ViewStyle>;
  /** Test ID for testing */
  testID?: string;
  /** Accessibility label */
  accessibilityLabel?: string;
  /** Accessibility hint describing what happens when the video is pressed */
  accessibilityHint?: string;
}

// ============================================================================
// Constants
// ============================================================================

const THUMBNAIL_HEIGHT = 250;
const PLAY_ICON_SIZE = 65;
const PLAY_ICON_BORDER_RADIUS = 33;
const PLAY_TRIANGLE_SIZE = 20;
const METADATA_BORDER_RADIUS = 24;
const DESCRIPTION_MAX_LINES = 3;
const BLUR_INTENSITY = 20;

// ============================================================================
// Component
// ============================================================================

/**
 * VideoRenderer - Sub-component of EtPost
 *
 * Renders a full-width thumbnail image with a centered play icon overlay.
 * Metadata (title, host, description) appears as a gradient overlay at the
 * bottom of the thumbnail with rounded top corners and backdrop blur,
 * matching the Figma design.
 *
 * Use as `<EtPost.Video thumbnailSource="..." onPress={handler} />`.
 */
function VideoRendererBase({
  thumbnailSource,
  title,
  host,
  description,
  onPress,
  style,
  testID,
  accessibilityLabel = 'Video attachment',
  accessibilityHint,
}: VideoRendererProps) {
  const { haptics } = usePostContext();
  const { colors } = useEtoroTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [imageError, setImageError] = useState(false);

  // Theme-derived gradient colors from surface tokens
  const gradientColors = useMemo(() => [colors.overlayTop, colors.overlayBottom] as const, [colors.overlayTop, colors.overlayBottom]);

  const handlePress = useCallback(() => {
    triggerHaptic(haptics);
    onPress?.();
  }, [onPress, haptics]);

  const handleImageError = useCallback(() => setImageError(true), []);

  // Don't render anything if thumbnail failed to load
  if (imageError) {
    return null;
  }

  const hasMetadata = title || host || description;

  const content = (
    <View style={[styles.container, style]}>
      {/* Thumbnail with play icon overlay */}
      <View style={styles.thumbnailContainer}>
        <Image
          source={{ uri: thumbnailSource }}
          style={styles.thumbnail}
          contentFit="cover"
          testID={testID ? `${testID}-thumbnail` : undefined}
          onError={handleImageError}
        />

        {/* Play icon overlay - centered on thumbnail */}
        <View style={styles.playIconOverlay}>
          <View style={styles.playIconCircle}>
            <View style={styles.playTriangle} />
          </View>
        </View>

        {/* Metadata overlay at bottom of thumbnail */}
        {hasMetadata && (
          <View style={styles.metadataOverlayContainer}>
            <View style={styles.metadataOverlay}>
              {/* Blur + gradient background */}
              <BlurView intensity={BLUR_INTENSITY} tint="dark" style={StyleSheet.absoluteFillObject} />
              <LinearGradient colors={gradientColors} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={StyleSheet.absoluteFillObject} />

              {/* Metadata content */}
              <View style={styles.metadataContent}>
                {title && (
                  <EtText variant="body-secondary-semibold" style={styles.textBright} numberOfLines={1}>
                    {title}
                  </EtText>
                )}
                {description && (
                  <EtText variant="body-tiny-regular" style={styles.textDark} numberOfLines={DESCRIPTION_MAX_LINES}>
                    {description}
                  </EtText>
                )}
                {host && (
                  <EtText variant="caption-regular" style={styles.textDark} numberOfLines={1}>
                    {host}
                  </EtText>
                )}
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={handlePress}
        testID={testID}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint ?? 'Opens video'}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View testID={testID} accessibilityRole="image" accessibilityLabel={accessibilityLabel}>
      {content}
    </View>
  );
}

export const VideoRenderer = React.memo(VideoRendererBase);
VideoRenderer.displayName = 'EtPost.Video';

// ============================================================================
// Styles
// ============================================================================

/* eslint-disable react-native/no-unused-styles -- createStyles returns dynamic styles; rule cannot trace usage */
const createStyles = (colors: ReturnType<typeof useEtoroTheme>['colors']) =>
  StyleSheet.create({
    container: {
      marginHorizontal: 0,
      marginBottom: X8,
    },
    thumbnailContainer: {
      position: 'relative',
    },
    thumbnail: {
      width: '100%',
      height: THUMBNAIL_HEIGHT,
    },
    playIconOverlay: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      alignItems: 'center',
    },
    playIconCircle: {
      width: PLAY_ICON_SIZE,
      height: PLAY_ICON_SIZE,
      borderRadius: PLAY_ICON_BORDER_RADIUS,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.overlayBottom,
    },
    playTriangle: {
      width: 0,
      height: 0,
      borderLeftWidth: PLAY_TRIANGLE_SIZE,
      borderTopWidth: PLAY_TRIANGLE_SIZE * 0.6,
      borderBottomWidth: PLAY_TRIANGLE_SIZE * 0.6,
      marginLeft: X1,
      borderLeftColor: colors.carbonStatic050,
      borderTopColor: colors.transparent,
      borderBottomColor: colors.transparent,
    },
    metadataOverlayContainer: {
      position: 'absolute',
      bottom: -X10,
      left: 0,
      right: 0,
    },
    metadataOverlay: {
      borderTopLeftRadius: METADATA_BORDER_RADIUS,
      borderTopRightRadius: METADATA_BORDER_RADIUS,
      overflow: 'hidden',
    },
    metadataContent: {
      paddingHorizontal: X6,
      paddingTop: X6,
      paddingBottom: X2,
      gap: X2,
    },
    textBright: {
      color: colors.carbonStatic050,
    },
    textDark: {
      color: colors.carbonStatic050,
    },
  });
