import { Image } from 'expo-image';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { useEtoroTheme } from '../../../../../core/hooks';
import { X1, X2, X3, X6 } from '../../../../../core/styles/spacing';
import { EtText } from '../../../../../foundations/text';
import { PostContext } from '../../context';
import { triggerHaptic } from '../../utils';
import { useIsSharedAttachment } from '../shared-post';

// ============================================================================
// Types (internal - not exported from api/types)
// ============================================================================

export interface LinkPreviewRendererProps {
  /** Link URL */
  url: string;
  /** Link preview title */
  title?: string;
  /** Host domain (e.g., "www.etoro.com") */
  host?: string;
  /** Link preview description */
  description?: string;
  /** Optional thumbnail image URL */
  thumbnailSource?: string;
  /** Attachment type — when 'video', a play icon is overlaid on the thumbnail */
  type?: 'link' | 'video';
  /** Called when link preview is pressed */
  onPress?: () => void;
  /** Override default styles */
  style?: StyleProp<ViewStyle>;
  /** Test ID for testing */
  testID?: string;
  /** Accessibility label */
  accessibilityLabel?: string;
  /** Accessibility hint describing what happens when the link is pressed */
  accessibilityHint?: string;
}

// ============================================================================
// Constants
// ============================================================================

const THUMBNAIL_SIZE = 88;
const PLAY_CIRCLE_SIZE = 36;
const DESCRIPTION_MAX_LINES = 3;

// ============================================================================
// Component
// ============================================================================

/**
 * LinkPreviewRenderer - Sub-component of EtPost
 *
 * Renders a horizontal card with an optional square thumbnail on the left
 * and metadata (title, host, description) on the right.
 * Use as `<EtPost.Link url="..." title="..." onPress={handler} />`.
 */
function LinkPreviewRendererBase({
  url,
  title,
  host,
  description,
  thumbnailSource,
  type = 'link',
  onPress,
  style,
  testID,
  accessibilityLabel = 'Link preview',
  accessibilityHint,
}: LinkPreviewRendererProps) {
  const postContext = useContext(PostContext);
  const haptics = postContext?.haptics ?? false;
  const isShared = useIsSharedAttachment();
  const { colors } = useEtoroTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [imageError, setImageError] = useState(false);

  // Reset error state when thumbnailSource changes so a new image can be attempted
  useEffect(() => {
    setImageError(false);
  }, [thumbnailSource]);

  const handlePress = useCallback(() => {
    triggerHaptic(haptics);
    onPress?.();
  }, [onPress, haptics]);

  // Derive host from URL as fallback when no metadata is provided
  // Wrapped in try/catch to handle invalid/missing-protocol URLs safely
  const derivedHost = useMemo(() => {
    if (host) return host;
    if (!url) return undefined;
    try {
      return new URL(url).hostname;
    } catch {
      try {
        return new URL(`http://${url}`).hostname;
      } catch {
        return undefined;
      }
    }
  }, [host, url]);
  const hasMetadata = title || derivedHost || description;

  // Don't render if there's nothing to show
  if (!hasMetadata && !thumbnailSource) {
    return null;
  }

  const showThumbnail = thumbnailSource && !imageError;

  const cardContent = (
    <View style={styles.card}>
      <View style={styles.cardInner}>
        {/* Thumbnail (left) */}
        {showThumbnail && (
          <>
            <Image
              source={{ uri: thumbnailSource }}
              style={styles.thumbnail}
              contentFit="cover"
              testID={testID ? `${testID}-thumbnail` : undefined}
              accessibilityLabel={`${title || testID || 'link-preview'} thumbnail`}
              onError={() => setImageError(true)}
            />
            {type === 'video' && (
              <View style={styles.playOverlay}>
                <View style={styles.playCircle}>
                  <View style={styles.playTriangle} />
                </View>
              </View>
            )}
          </>
        )}

        {/* Metadata (right) */}
        {hasMetadata && (
          <View style={styles.metadataContainer}>
            {title && (
              <EtText variant="body-secondary-semibold" style={styles.textPrimary} numberOfLines={1}>
                {title}
              </EtText>
            )}
            {derivedHost && (
              <EtText variant="caption-regular" style={styles.textSecondary} numberOfLines={1}>
                {derivedHost}
              </EtText>
            )}
            {description && (
              <EtText variant="caption-regular" style={styles.textSecondary} numberOfLines={DESCRIPTION_MAX_LINES}>
                {description}
              </EtText>
            )}
          </View>
        )}
      </View>
    </View>
  );

  const containerStyle = isShared ? [styles.container, sharedOverrides.container, style] : [styles.container, style];

  if (onPress) {
    return (
      <Pressable
        onPress={handlePress}
        style={containerStyle}
        testID={testID}
        accessibilityRole="link"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint ?? 'Opens link'}
      >
        {cardContent}
      </Pressable>
    );
  }

  return (
    <View style={containerStyle} testID={testID} accessibilityLabel={accessibilityLabel} accessibilityHint={accessibilityHint}>
      {cardContent}
    </View>
  );
}

export const LinkPreviewRenderer = React.memo(LinkPreviewRendererBase);
LinkPreviewRenderer.displayName = 'EtPost.Link';

// ============================================================================
// Styles
// ============================================================================

const sharedOverrides = StyleSheet.create({
  container: { marginHorizontal: 0 },
});

/* eslint-disable react-native/no-unused-styles -- createStyles returns dynamic styles; rule cannot trace usage */
const createStyles = (colors: ReturnType<typeof useEtoroTheme>['colors']) =>
  StyleSheet.create({
    container: {
      marginHorizontal: X6,
    },
    card: {
      borderRadius: X2,
      borderWidth: 0,
      backgroundColor: colors.cardDefault,
    },
    cardInner: {
      flexDirection: 'row',
      borderRadius: X2,
      overflow: 'hidden',
    },
    thumbnail: {
      width: THUMBNAIL_SIZE,
      minHeight: THUMBNAIL_SIZE,
    },
    playOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      width: THUMBNAIL_SIZE,
      justifyContent: 'center',
      alignItems: 'center',
    },
    playCircle: {
      width: PLAY_CIRCLE_SIZE,
      height: PLAY_CIRCLE_SIZE,
      borderRadius: PLAY_CIRCLE_SIZE / 2,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    playTriangle: {
      width: 0,
      height: 0,
      marginLeft: 2,
      borderLeftWidth: 10,
      borderTopWidth: 6,
      borderBottomWidth: 6,
      borderLeftColor: colors.textBright,
      borderTopColor: colors.transparent,
      borderBottomColor: colors.transparent,
    },
    metadataContainer: {
      flex: 1,
      padding: X3,
      gap: X1,
      justifyContent: 'center',
    },
    textPrimary: {
      color: colors.carbon900,
    },
    textSecondary: {
      color: colors.carbon500,
    },
  });
