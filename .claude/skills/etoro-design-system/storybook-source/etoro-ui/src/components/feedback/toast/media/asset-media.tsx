import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

import { TOAST_DIMENSIONS } from '../api/types';
import { getOverlayColors } from '../utils';
import { extractBackgroundColor } from '../utils/color-extraction';

interface AssetMediaProps {
  /** URL to the asset logo */
  logoUrl: string;
}

/**
 * AssetMedia - Displays a single asset logo with gradient overlay
 */
export function AssetMedia({ logoUrl }: AssetMediaProps) {
  if (!logoUrl || typeof logoUrl !== 'string') return null;

  const backgroundColor = extractBackgroundColor(logoUrl, true);

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Image source={{ uri: logoUrl }} style={[styles.image, { backgroundColor }]} contentFit="cover" cachePolicy="memory-disk" transition={200} />
      <LinearGradient colors={getOverlayColors()} style={styles.gradientOverlay} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: TOAST_DIMENSIONS.MEDIA_SIZE,
    height: TOAST_DIMENSIONS.MEDIA_SIZE,
    borderRadius: TOAST_DIMENSIONS.MEDIA_BORDER_RADIUS,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: TOAST_DIMENSIONS.MEDIA_BORDER_RADIUS,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: TOAST_DIMENSIONS.MEDIA_BORDER_RADIUS,
  },
});
