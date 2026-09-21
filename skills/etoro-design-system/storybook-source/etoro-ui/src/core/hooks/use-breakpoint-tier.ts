import { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';

const resolveTier = (thresholds: readonly number[], width: number): number => {
  for (let index = thresholds.length - 1; index >= 0; index -= 1) {
    if (thresholds[index] <= width) {
      return index;
    }
  }
  return -1;
};

/**
 * Multi-threshold sibling of `useBreakpoint`: returns the highest index `i`
 * with `thresholds[i] <= window width`, or `-1` when the width is below the
 * first threshold. `thresholds` MUST be ascending (e.g. `SHELL_TIERS`).
 *
 * EDGE-TRIGGERED, same mechanism as `useBreakpoint`: subscribes to
 * `Dimensions` directly and stores only the derived tier index, so the owning
 * component re-renders when a tier boundary is crossed — not on every resize
 * pixel (React bails out of state updates that don't change the value).
 *
 * Pass a stable array (a module constant like `SHELL_TIERS`) — a new array
 * identity per render would re-subscribe on every render.
 *
 * @example
 * const tier = useBreakpointTier(SHELL_TIERS); // -1 | 0 | 1 | 2
 */
export const useBreakpointTier = (thresholds: readonly number[]): number => {
  const [tier, setTier] = useState(() => resolveTier(thresholds, Dimensions.get('window').width));

  useEffect(() => {
    const update = () => setTier(resolveTier(thresholds, Dimensions.get('window').width));
    // Re-sync: the width may have changed between the initial render and this subscription.
    update();
    const subscription = Dimensions.addEventListener('change', update);
    return () => subscription.remove();
  }, [thresholds]);

  return tier;
};
