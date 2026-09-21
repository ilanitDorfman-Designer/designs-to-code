import { IconName, IconVariant } from '../api/types';

// CDN base URL
const CDN_BASE_URL = 'https://etoro-cdn.etorostatic.com/web-client/et-plus';
export const ZAPPICONS_CDN_BASE_URL = `${CDN_BASE_URL}/zappicons`;

/**
 * Generates the CDN URL for a Zappicon
 * @param name Icon name
 * @param variant Icon variant
 * @returns Full CDN URL for the SVG icon
 */
export function getIconUrl(name: IconName, variant: IconVariant): string {
  return `${ZAPPICONS_CDN_BASE_URL}/${name}/${variant}/${name}-${variant}.svg`;
}
