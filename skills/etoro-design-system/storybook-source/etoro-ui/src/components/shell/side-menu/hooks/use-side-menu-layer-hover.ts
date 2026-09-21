import { useCallback, useEffect, useMemo, useState } from 'react';

import type { UseHoverResult } from '../../../../core/hooks/use-hover';

/**
 * `useHover` for dual-layer subcomponents. When a layer deactivates it flips
 * `pointerEvents: 'none'` mid-hover and the browser never delivers the leave
 * event to the old chain (the root's `railHovered` reset exists for the same
 * reason) — plain `useHover` would keep `isHovered` true and the control would
 * come back showing its hover treatment with the pointer long gone. This
 * variant clears the state whenever the caller's layer goes inactive.
 */
export function useSideMenuLayerHover(isActiveLayer: boolean): UseHoverResult {
  const [isHovered, setIsHovered] = useState(false);

  const onHoverIn = useCallback(() => setIsHovered(true), []);
  const onHoverOut = useCallback(() => setIsHovered(false), []);

  useEffect(() => {
    if (!isActiveLayer) {
      setIsHovered(false);
    }
  }, [isActiveLayer]);

  const hoverProps = useMemo(() => ({ onHoverIn, onHoverOut }), [onHoverIn, onHoverOut]);

  return { isHovered, hoverProps };
}
