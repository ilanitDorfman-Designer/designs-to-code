import { Image, ImageLoadEventData } from 'expo-image';
import React, { useCallback, useEffect, useState } from 'react';
import { LayoutChangeEvent, Pressable, StyleProp, StyleSheet, useWindowDimensions, View, ViewStyle } from 'react-native';

import { usePostContext } from '../../context';
import { triggerHaptic } from '../../utils';

// ============================================================================
// Types (internal - not exported from api/types)
// ============================================================================

export interface ImageRendererProps {
  /** Image source URL */
  source: string;
  /** Original image width (from API) — used to calculate natural aspect ratio */
  imageWidth?: number;
  /** Original image height (from API) — used to calculate natural aspect ratio */
  imageHeight?: number;
  /** Called when image is pressed */
  onPress?: () => void;
  /** Override default styles */
  style?: StyleProp<ViewStyle>;
  /** Test ID for testing */
  testID?: string;
  /** Accessibility label for the image */
  accessibilityLabel?: string;
  /** Accessibility hint describing what happens when the image is pressed */
  accessibilityHint?: string;
}

// ============================================================================
// Constants
// ============================================================================

const MIN_IMAGE_HEIGHT = 150;
const MAX_IMAGE_HEIGHT = 250;

// ============================================================================
// Component
// ============================================================================

/**
 * ImageRenderer - Sub-component of EtPost
 *
 * Renders a full-width image within the post.
 * Use as `<EtPost.Image source="..." onPress={handler} />`.
 *
 * ## Image sizing strategy
 *
 * The image always renders at full container width. The height is determined
 * by the natural aspect ratio (from API dimensions or `onLoad` measurement),
 * clamped between MIN_IMAGE_HEIGHT and MAX_IMAGE_HEIGHT:
 *
 * | Scenario               | Container height | Image behavior                        |
 * |------------------------|------------------|---------------------------------------|
 * | Dimensions unknown     | 250px (fallback) | cover — may crop until onLoad fires   |
 * | Short image (<150px)   | 150px            | cover — slight zoom to fill min space |
 * | Normal (150–250px)     | natural height   | no crop — exact fit                   |
 * | Tall image (>250px)    | 250px            | overflow hidden — bottom clipped      |
 *
 * API dimensions (`imageWidth`/`imageHeight`) are preferred over `onLoad` to
 * avoid layout shift while the image is still loading.
 *
 * Container width is measured via `onLayout` so the height calculation is
 * correct even when the image is nested inside a padded parent (e.g. shared
 * posts). Falls back to `screenWidth` on the first frame.
 */
function ImageRendererBase({
  source,
  imageWidth,
  imageHeight,
  onPress,
  style,
  testID,
  accessibilityLabel = 'Post image',
  accessibilityHint,
}: ImageRendererProps) {
  const { haptics } = usePostContext();
  const [imageError, setImageError] = useState(false);
  const [measuredRatio, setMeasuredRatio] = useState<number | null>(null);
  const { width: screenWidth } = useWindowDimensions();
  const [containerWidth, setContainerWidth] = useState(screenWidth);

  const handleLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const layoutWidth = e.nativeEvent.layout.width;
      if (layoutWidth > 0 && layoutWidth !== containerWidth) {
        setContainerWidth(layoutWidth);
      }
    },
    [containerWidth],
  );

  useEffect(() => {
    setImageError(false);
    setMeasuredRatio(null);
  }, [source]);

  const handlePress = useCallback(() => {
    triggerHaptic(haptics);
    onPress?.();
  }, [onPress, haptics]);

  const handleLoad = useCallback(
    (e: ImageLoadEventData) => {
      if (!imageWidth && e.source?.width && e.source?.height) {
        setMeasuredRatio(e.source.width / e.source.height);
      }
    },
    [imageWidth],
  );

  const aspectRatio = imageWidth && imageHeight ? imageWidth / imageHeight : measuredRatio;

  let containerHeight = MAX_IMAGE_HEIGHT;
  let imageStyle: { width: '100%'; height: number } | typeof styles.imageFallback = styles.imageFallback;

  if (aspectRatio) {
    const naturalHeight = containerWidth / aspectRatio;

    if (naturalHeight < MIN_IMAGE_HEIGHT) {
      containerHeight = MIN_IMAGE_HEIGHT;
    } else {
      containerHeight = Math.min(MAX_IMAGE_HEIGHT, naturalHeight);
      imageStyle = { width: '100%', height: naturalHeight };
    }
  }

  if (!source || source.trim() === '') {
    return null;
  }

  const imageSource = { uri: source };

  if (imageError) {
    return null;
  }

  const imageContent = (
    <Image
      source={imageSource}
      style={imageStyle}
      contentFit="cover"
      testID={testID ? `${testID}-image` : undefined}
      onError={() => setImageError(true)}
      onLoad={handleLoad}
    />
  );

  const containerStyle = [styles.container, { height: containerHeight }, style];

  if (onPress) {
    return (
      <Pressable
        onPress={handlePress}
        onLayout={handleLayout}
        style={containerStyle}
        testID={testID}
        accessibilityRole="imagebutton"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint ?? 'Opens image'}
      >
        {imageContent}
      </Pressable>
    );
  }

  return (
    <View onLayout={handleLayout} style={containerStyle} testID={testID} accessibilityRole="image" accessibilityLabel={accessibilityLabel}>
      {imageContent}
    </View>
  );
}

export const ImageRenderer = React.memo(ImageRendererBase);
ImageRenderer.displayName = 'EtPost.Image';

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 0,
    overflow: 'hidden',
  },
  imageFallback: {
    width: '100%',
    height: MAX_IMAGE_HEIGHT,
  },
});
