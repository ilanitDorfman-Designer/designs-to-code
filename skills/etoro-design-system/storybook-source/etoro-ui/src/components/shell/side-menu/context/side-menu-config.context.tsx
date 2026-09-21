import { createContext, useContext } from 'react';

import { SideMenuConfigContextValue } from '../api/types';

/**
 * Context for static per-mount configuration that rarely changes.
 */
export const SideMenuConfigContext = createContext<SideMenuConfigContextValue | null>(null);

/**
 * Access static config (tier, railWidth, activeItemId, onItemPress, reducedMotion, setInitialFocus).
 */
export function useSideMenuConfig(): SideMenuConfigContextValue {
  const context = useContext(SideMenuConfigContext);
  if (!context) {
    throw new Error('EtSideMenu compound components must be used within <EtSideMenu>');
  }
  return context;
}
