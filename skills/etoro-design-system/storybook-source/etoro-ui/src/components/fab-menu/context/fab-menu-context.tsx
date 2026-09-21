import { createContext, useContext } from 'react';

import type { FabMenuContextValue } from '../api';

/**
 * Context for sharing FAB menu state (open/close) with subcomponents
 */
export const FabMenuContext = createContext<FabMenuContextValue | null>(null);

/**
 * Hook to access FAB menu context from subcomponents
 * @throws Error if used outside of EtFabMenu
 */
export function useFabMenuContext(): FabMenuContextValue {
  const context = useContext(FabMenuContext);
  if (!context) {
    throw new Error('EtFabMenu compound components must be used within an EtFabMenu component');
  }
  return context;
}
