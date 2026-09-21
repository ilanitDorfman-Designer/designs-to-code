import { createContext, useContext } from 'react';

import { type ReducedMotionState } from '../../../../core/hooks/accessibility';

/**
 * Shared state for a skeleton group.
 *
 * - `animated`: whether the group's atoms shimmer at all. `EtSkeleton.Group`
 *   sets this to `false` when `animation="none"`, so every atom inside renders a
 *   static placeholder. Standalone atoms (no group) default to `true`.
 *
 * The group no longer owns the shimmer (each atom clips its own sheen), so there
 * is nothing here about masking — only the on/off switch.
 */
export interface SkeletonGroupContextValue {
  animated: boolean;
  reducedMotion?: ReducedMotionState;
}

export const DEFAULT_REDUCED_MOTION_STATE: ReducedMotionState = {
  isReducedMotionEnabled: true,
  hasResolved: false,
};

export const SkeletonGroupContext = createContext<SkeletonGroupContextValue>({
  animated: true,
});

export function useSkeletonGroup() {
  return useContext(SkeletonGroupContext);
}
