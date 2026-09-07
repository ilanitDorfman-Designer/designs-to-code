import { createContext, useContext } from 'react';

import { SideMenuLayer } from '../api/types';

/**
 * Which mounted layer a subtree renders in — the root renders slot children twice
 * (rail layer + panel layer) and every subcomponent picks its per-layer form from this.
 * Default 'panel' is harmless, so the hook does not throw.
 */
export const SideMenuLayerContext = createContext<SideMenuLayer>('panel');

export function useSideMenuLayer(): SideMenuLayer {
  return useContext(SideMenuLayerContext);
}
