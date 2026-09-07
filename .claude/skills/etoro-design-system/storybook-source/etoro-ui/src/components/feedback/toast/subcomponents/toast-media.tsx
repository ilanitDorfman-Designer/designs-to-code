import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { useToastInternalContext } from '../api/toast-context';
import type { ToastAssetConfig, ToastAssetGroupConfig, ToastIconConfig, ToastImageConfig } from '../api/types';
import { AssetGroupMedia, AssetMedia, IconMedia, ImageMedia, StatusMedia } from '../media';
import { StatusBadge } from './status-badge';

interface ToastMediaProps {
  /** Asset configuration (required when type is 'asset') */
  asset?: ToastAssetConfig;
  /** Image configuration (required when type is 'image') */
  image?: ToastImageConfig;
  /** Asset group configuration (required when type is 'assetGroup') */
  assetGroup?: ToastAssetGroupConfig;
  /** Icon configuration (required when type is 'icon') */
  icon?: ToastIconConfig;
  /** Caller-supplied media node (required when type is 'custom') */
  customMedia?: ReactNode;
}

/**
 * ToastMedia - Orchestrates the rendering of toast media and status badge
 *
 * This component:
 * 1. Gets the toast type from context
 * 2. Renders the appropriate media component based on type
 * 3. Positions the StatusBadge appropriately
 *
 * The StatusBadge gets its status from ToastInternalContext,
 * so we don't need to pass it as a prop.
 *
 * For the `'custom'` type, the caller's `customMedia` is rendered as-is and
 * no `StatusBadge` is overlaid — the caller's media is expected to be
 * self-contained (e.g., a trader avatar that carries its own PI/verified badge).
 */
export function ToastMedia({ asset, image, assetGroup, icon, customMedia }: ToastMediaProps) {
  const { type } = useToastInternalContext();

  const renderMedia = () => {
    switch (type) {
      case 'asset':
        return asset ? <AssetMedia logoUrl={asset.logoUrl} /> : null;

      case 'image':
        return image ? <ImageMedia uri={image.uri} /> : null;

      case 'assetGroup':
        return assetGroup?.assets.length ? <AssetGroupMedia assets={assetGroup.assets} /> : null;

      case 'icon':
        return icon ? <IconMedia name={icon.name} /> : null;

      case 'badge':
        return <StatusMedia />;

      case 'custom':
        return customMedia ?? null;

      default:
        return null;
    }
  };

  const isAssetGroup = type === 'assetGroup';
  // `icon` and `badge` have intentionally no overlaid status badge.
  // `custom` opts out as well — the caller owns its media's badging.
  const showBadge = type !== 'icon' && type !== 'badge' && type !== 'custom';

  return (
    <View style={styles.container}>
      {renderMedia()}
      {showBadge && !isAssetGroup && <StatusBadge />}
      {showBadge && isAssetGroup && assetGroup && (
        <View style={styles.assetGroupBadgeWrapper}>
          <StatusBadge />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  assetGroupBadgeWrapper: {
    // This wrapper ensures the badge is positioned relative to the group end
    // The StatusBadge's absolute positioning will anchor to this wrapper
    position: 'absolute',
    top: 0,
    end: 0,
    bottom: 0,
  },
});
