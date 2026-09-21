import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

import { TOAST_DIMENSIONS } from '../api/types';

interface ImageMediaProps {
  /** URI of the image to display */
  uri: string;
  /** Optional accessibility label for the image */
  accessibilityLabel?: string;
}

/**
 * ImageMedia - Displays a custom image
 */
export function ImageMedia({ uri, accessibilityLabel }: ImageMediaProps) {
  return (
    <Image
      source={{ uri }}
      style={styles.image}
      contentFit="cover"
      cachePolicy="memory-disk"
      transition={200}
      accessibilityLabel={accessibilityLabel ?? 'Image'}
      accessible={true}
      accessibilityRole="image"
    />
  );
}

const styles = StyleSheet.create({
  image: {
    width: TOAST_DIMENSIONS.MEDIA_SIZE,
    height: TOAST_DIMENSIONS.MEDIA_SIZE,
    borderRadius: TOAST_DIMENSIONS.MEDIA_BORDER_RADIUS,
  },
});
