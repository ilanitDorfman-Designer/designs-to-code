import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import type { ToastAssetConfig } from '../api/types';
import { TOAST_DIMENSIONS } from '../api/types';
import { extractBackgroundColor } from '../utils/color-extraction';

interface AssetGroupMediaProps {
  /** Array of assets to display (max 3 will be shown) */
  assets: ToastAssetConfig[];
}

/** Maximum number of assets to display in a group */
const MAX_VISIBLE_ASSETS = 3;

/**
 * AssetGroupMedia - Displays up to 3 assets in an overlapping stack
 */
export function AssetGroupMedia({ assets }: AssetGroupMediaProps) {
  const visibleAssets = assets.slice(0, MAX_VISIBLE_ASSETS);
  return (
    <View style={styles.container}>
      {visibleAssets.map((asset, index) => {
        const backgroundColor = extractBackgroundColor(asset.logoUrl, false);
        const isFirst = index === 0;
        return (
          <View
            key={`${asset.logoUrl}-${index}`}
            style={[styles.assetItem, isFirst ? styles.assetItemFirst : styles.assetItemOverlap, { zIndex: index + 1 }]}
          >
            <Image
              source={{ uri: asset.logoUrl }}
              style={[styles.image, backgroundColor && { backgroundColor }]}
              contentFit="cover"
              cachePolicy="memory-disk"
            />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assetItem: {
    position: 'relative',
  },
  assetItemFirst: {
    marginStart: 0,
  },
  assetItemOverlap: {
    marginStart: TOAST_DIMENSIONS.ASSET_GROUP_OVERLAP,
  },
  image: {
    width: TOAST_DIMENSIONS.MEDIA_SIZE,
    height: TOAST_DIMENSIONS.MEDIA_SIZE,
    borderRadius: TOAST_DIMENSIONS.MEDIA_BORDER_RADIUS,
  },
});
