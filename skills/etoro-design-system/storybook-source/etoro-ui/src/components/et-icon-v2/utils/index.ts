export { getIconUrl, ZAPPICONS_CDN_BASE_URL } from './get-icon-url';
export type { IconMetadata, IconMetadataRegistry } from './icon-registry';
export {
  // Cache management
  clearIconMetadataCache,
  getAllIconNames,
  // Icon lookup
  getIconMetadata,
  // Query functions
  getIconsByCategory,
  // Core fetch
  getOrFetchIconMetadata,
  isMetadataCached,
  searchIcons,
} from './icon-registry';
export { resolveIconSize } from './resolve-size';
