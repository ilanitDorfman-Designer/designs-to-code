import { useEffect, useMemo } from 'react';

import { extractImageBackgroundColor } from '../../utils/image-utils';
import { useGlobalScroll } from '../contexts/scroll/scroll.context';

interface UseAvatarHaloOptions {
  /** Avatar/logo URL whose embedded background color tints the neutral halo. */
  avatarUrl?: string;
  /** Explicit avatar background color, used when the URL does not encode colors. */
  avatarBackgroundColor?: string;
  /** Target opacity the neutral halo animates up to on mount (e.g. 0.4 open, 1 close). */
  subHaloOpacity: number;
}

/**
 * Tints the global neutral halo with an asset's avatar background color and
 * fades it in, hiding the green halo for the duration of the screen.
 *
 * Encapsulates the shared open/close-position halo pattern so screens don't
 * duplicate the effect. Cleanup restores the default halo on unmount.
 */
export function useAvatarHalo({ avatarUrl, avatarBackgroundColor, subHaloOpacity }: UseAvatarHaloOptions) {
  const { setHaloOpacity, setSubHaloOpacity, setHaloLayerVisibility, setHaloGlowColor, resetHaloOpacity } = useGlobalScroll();
  const avatarHaloColor = useMemo(() => avatarBackgroundColor ?? extractImageBackgroundColor(avatarUrl), [avatarBackgroundColor, avatarUrl]);

  useEffect(() => {
    setHaloLayerVisibility({ hideGreenHalo: true, hideNeutralHalo: false });
    setHaloGlowColor(avatarHaloColor ?? null);
    setHaloOpacity(0, 0);
    setSubHaloOpacity(0, 0);
    setSubHaloOpacity(subHaloOpacity, 450);
    return () => {
      setHaloGlowColor(null);
      setHaloLayerVisibility(null);
      resetHaloOpacity();
    };
  }, [avatarHaloColor, subHaloOpacity, setHaloGlowColor, setHaloLayerVisibility, setHaloOpacity, setSubHaloOpacity, resetHaloOpacity]);
}
