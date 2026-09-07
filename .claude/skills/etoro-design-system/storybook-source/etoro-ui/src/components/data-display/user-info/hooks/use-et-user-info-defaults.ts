import { useInfoDefaults } from '../../_info-base/hooks';
import type { EtUserDefaults, EtUserDefaultsInput } from '../api';

const USER_DEFAULTS_CONFIG = {
  defaultAvatarShape: 'square' as const,
  defaultAvatarSize: 'medium' as const,
};

/**
 * Sets up the EtUserData defaults and returns the layout and context value.
 */
export function useDefaults(input: EtUserDefaultsInput): EtUserDefaults {
  return useInfoDefaults(input, USER_DEFAULTS_CONFIG) as EtUserDefaults;
}
