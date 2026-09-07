import { useMemo } from 'react';

import { extractColorFromUrl, getDefaultColor } from '../utils';

/**
 * Hook that extracts the primary color from a CDN URL.
 *
 * @param logoUrl - The CDN URL containing color information
 * @returns Object with color and whether extraction was successful
 */
export function useColorExtraction(logoUrl: string) {
  return useMemo(() => {
    const extracted = extractColorFromUrl(logoUrl);

    if (extracted) {
      return {
        color: extracted,
        isExtracted: true,
      };
    }

    return {
      color: getDefaultColor(),
      isExtracted: false,
    };
  }, [logoUrl]);
}
