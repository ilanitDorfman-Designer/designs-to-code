import { useMemo } from 'react';

import { EtIconProps, IconVariant } from '../api/types';
import { resolveIconSize } from '../utils/resolve-size';
import { useIconSource } from './use-icon-source';
import { useIconTheme } from './use-icon-theme';

export interface IconConfig {
  resolvedVariant: IconVariant;
  resolvedSize: number;
  resolvedColor: string;
  iconUrl: string;
}

/**
 * Resolves all icon configuration: variant, size, color, and CDN URL.
 */
export function useIconConfig(props: Pick<EtIconProps, 'name' | 'variant' | 'size' | 'color'> & { skipCdn?: boolean }): IconConfig {
  const { name, variant, size, color, skipCdn } = props;
  const { resolvedColor } = useIconTheme({ color });
  const resolvedVariant = variant ?? IconVariant.Regular;

  const { iconUrl } = useIconSource(name, resolvedVariant, { skipCdn });

  return useMemo(() => {
    const resolvedSize = resolveIconSize(size);

    return {
      resolvedVariant,
      resolvedSize,
      resolvedColor,
      iconUrl,
    };
  }, [resolvedVariant, size, resolvedColor, iconUrl]);
}
