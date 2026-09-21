import { useMemo } from 'react';

import { useBreakpoint } from '../../../../core/hooks';
import { BREAKPOINT_DESKTOP } from '../../../../core/styles/breakpoints';
import { SplitLayoutAsidePosition } from '../api/types';

const DEFAULT_RATIO: [number, number] = [1, 1];

interface UseSplitLayoutConfigParams {
  ratio?: [number, number];
  asidePosition?: SplitLayoutAsidePosition;
}

interface SplitLayoutConfig {
  isSplit: boolean;
  ratio: [number, number];
  asidePosition: SplitLayoutAsidePosition;
}

/**
 * Resolves prop defaults and derives the layout mode from the viewport width.
 */
export function useSplitLayoutConfig({ ratio = DEFAULT_RATIO, asidePosition = 'end' }: UseSplitLayoutConfigParams): SplitLayoutConfig {
  const isSplit = useBreakpoint(BREAKPOINT_DESKTOP);
  const [mainWeight, asideWeight] = ratio;
  // Stabilize the array identity: consumers may pass ratio inline (e.g.
  // ratio={[2, 1]}), which would otherwise cascade a fresh reference into the
  // context value on every parent render and re-render all context consumers.
  const stableRatio = useMemo<[number, number]>(() => [mainWeight, asideWeight], [mainWeight, asideWeight]);

  return { isSplit, ratio: stableRatio, asidePosition };
}
