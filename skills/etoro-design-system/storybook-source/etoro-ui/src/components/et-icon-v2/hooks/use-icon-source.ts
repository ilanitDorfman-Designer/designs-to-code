import { useMemo } from 'react';

import { IconName, IconVariant } from '../api/types';
import { getIconUrl } from '../utils/get-icon-url';

interface UseIconSourceResult {
  iconUrl: string;
}

export interface UseIconSourceOptions {
  /** When true, skips building a CDN URL (e.g. bundled SVG via `renderIcon` on EtIconV2). */
  skipCdn?: boolean;
}

/**
 * Hook to generate icon URL from Zappicons CDN.
 */
export function useIconSource(name: IconName, variant: IconVariant, options?: UseIconSourceOptions): UseIconSourceResult {
  const iconUrl = useMemo(() => {
    if (options?.skipCdn) {
      return '';
    }
    return getIconUrl(name, variant);
  }, [name, variant, options?.skipCdn]);
  return { iconUrl };
}
