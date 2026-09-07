import { useInfoDefaults } from '../../_info-base/hooks';
import type { EtAssetDefaults, EtAssetDefaultsInput } from '../api';

const ASSET_DEFAULTS_CONFIG = {
  defaultAvatarShape: 'square' as const,
  defaultAvatarSize: 'medium' as const,
  defaultAvatarVariant: 'instrument' as const,
};

/**
 * Sets up the EtAssetData defaults and returns the layout and context value.
 */
export function useDefaults(input: EtAssetDefaultsInput): EtAssetDefaults {
  return useInfoDefaults(input, ASSET_DEFAULTS_CONFIG) as EtAssetDefaults;
}
