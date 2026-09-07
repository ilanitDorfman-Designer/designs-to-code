import { useMemo } from 'react';
import { Platform } from 'react-native';

import { getGlassEffectModule } from './glass-effect-registry';

/**
 * Detects whether the Liquid Glass visual effect (iOS 26+) is available
 * on the current device.
 *
 * Requires `registerGlassEffect()` to have been called at app startup.
 * Returns `false` on Android, older iOS, or when the module is not registered.
 */
export function useLiquidGlass(): { supportsLiquidGlass: boolean } {
  const supportsLiquidGlass = useMemo(() => {
    if (Platform.OS !== 'ios') return false;

    const module = getGlassEffectModule();
    if (!module) return false;

    try {
      return module.isLiquidGlassAvailable() && module.isGlassEffectAPIAvailable();
    } catch {
      return false;
    }
  }, []);

  return { supportsLiquidGlass };
}
