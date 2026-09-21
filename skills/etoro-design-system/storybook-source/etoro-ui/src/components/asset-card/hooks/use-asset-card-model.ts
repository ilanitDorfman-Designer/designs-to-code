import { useMemo } from 'react';

import { extractImageBackgroundColor } from '../../../utils/image-utils';
import type { EtAssetCardAsset, EtAssetCardProps } from '../api';

export interface AssetCardResolved {
  asset: EtAssetCardAsset;
  size: NonNullable<EtAssetCardProps['size']>;
  variant: NonNullable<EtAssetCardProps['variant']>;
  backgroundColor?: string;
  logoSource: { uri: string };
  label?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
}

/**
 * Resolves size/variant defaults.
 *
 * For `variant="standard"`, card background comes from the asset brand colour
 * (`asset.backgroundColor`, else hex embedded in `logoUrl`). Other variants
 * leave `backgroundColor` undefined so `EtMediaCard` uses theme surfaces.
 */
export function useAssetCardModel({
  asset,
  size = 'small',
  variant = 'standard',
  label,
  eyebrow,
  title,
  description,
}: Pick<EtAssetCardProps, 'asset' | 'size' | 'variant' | 'label' | 'eyebrow' | 'title' | 'description'>): AssetCardResolved {
  return useMemo(() => {
    const brandColor = asset.backgroundColor ?? extractImageBackgroundColor(asset.logoUrl);
    const backgroundColor = variant === 'standard' ? brandColor : undefined;

    return {
      asset,
      size,
      variant,
      backgroundColor,
      logoSource: { uri: asset.logoUrl },
      label,
      eyebrow,
      title,
      description,
    };
  }, [asset, size, variant, label, eyebrow, title, description]);
}
