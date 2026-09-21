import { createContext, useContext } from 'react';

import { SideMenuStateContextValue } from '../api/types';

/**
 * Context for dynamic state that changes on toggle interaction.
 */
export const SideMenuStateContext = createContext<SideMenuStateContextValue | null>(null);

/**
 * Access dynamic state (expanded, progress, crossfade, isExpanding, toggle, requestClose).
 */
export function useSideMenuState(): SideMenuStateContextValue {
  const context = useContext(SideMenuStateContext);
  if (!context) {
    throw new Error('EtSideMenu compound components must be used within <EtSideMenu>');
  }
  return context;
}
