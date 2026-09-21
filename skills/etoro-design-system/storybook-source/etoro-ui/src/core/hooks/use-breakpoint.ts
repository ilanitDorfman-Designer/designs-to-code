import { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';

/**
 * True when the window width is at or above `minWidth`.
 *
 * EDGE-TRIGGERED: subscribes to `Dimensions` directly and stores only the
 * derived boolean, so the owning component re-renders when the threshold is
 * crossed — not on every resize pixel (React bails out of state updates that
 * don't change the value). Prefer this over `useWindowDimensions` for
 * breakpoint checks: on web a window drag emits a dimensions change per frame,
 * and re-rendering a layout root per frame is measurable jank.
 *
 * Deliberately platform-agnostic — no `Platform.OS` gate. Web-only behavior is
 * a consumer decision (e.g. adopt inside a `.web.tsx` layout shell), which
 * keeps the hook usable for future native tablet layouts.
 *
 * @example
 * const isSplit = useBreakpoint(BREAKPOINT_DESKTOP);
 */
export const useBreakpoint = (minWidth: number): boolean => {
  const [isAtLeast, setIsAtLeast] = useState(() => Dimensions.get('window').width >= minWidth);

  useEffect(() => {
    const update = () => setIsAtLeast(Dimensions.get('window').width >= minWidth);
    // Re-sync: the width may have changed between the initial render and this subscription.
    update();
    const subscription = Dimensions.addEventListener('change', update);
    return () => subscription.remove();
  }, [minWidth]);

  return isAtLeast;
};
