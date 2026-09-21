export type { EtIconProps, IconName, IconSize } from './api';
export { IconVariant } from './api';
export type {
  DsReactFillOnlyName,
  DsReactGalleryIconName,
  DsReactIconName,
  DsReactIconSection,
  DsReactIconSize,
  DsReactLocalIconProps,
} from './ds-react';
export {
  DS_REACT_ICON_ALL_KEYS,
  DS_REACT_ICON_GALLERY,
  DS_REACT_ICON_REGISTRY,
  DS_REACT_ICON_SIZE_PX,
  dsReactIconSizeToIconSize,
  DsReactPlaceholderIcon,
  getDsReactRegistryIcon,
  hasDsReactRegistrySvg,
  isDsReactIconName,
  resolveDsReactRegistryName,
} from './ds-react';
export { EtIconV2 } from './et-icon-v2';
export { ChevronLeftIcon } from './icons';
export { GearFillIcon } from './icons';
export type { IconMetadata, IconMetadataRegistry } from './utils';
export {
  // Cache management
  clearIconMetadataCache,
  getAllIconNames,
  // Icon lookup
  getIconMetadata,
  // Query functions
  getIconsByCategory,
  // URL generator
  getIconUrl,
  // Core fetch
  getOrFetchIconMetadata,
  isMetadataCached,
  searchIcons,
  // CDN URL
  ZAPPICONS_CDN_BASE_URL,
} from './utils';
