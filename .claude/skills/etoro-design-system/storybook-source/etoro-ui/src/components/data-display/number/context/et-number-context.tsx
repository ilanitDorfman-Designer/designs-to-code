import { createContext, useContext } from 'react';

import type { EtNumberContextValue } from '../api/types';

export const EtNumberContext = createContext<EtNumberContextValue | null>(null);

/**
 * Hook to access EtNumber context from subcomponents.
 * @throws Error if used outside EtNumber
 */
export function useEtNumberContext(): EtNumberContextValue {
  const context = useContext(EtNumberContext);
  if (!context) {
    throw new Error('[useEtNumberContext]: must be used within an EtNumber component');
  }
  return context;
}
