import { createContext, useContext } from 'react';

import type { EtPriceContextValue } from '../api/types';

export const EtPriceContext = createContext<EtPriceContextValue | null>(null);

/**
 * Hook to access EtPrice context from subcomponents.
 * @throws Error if used outside EtPrice
 */
export function useEtPriceContext(): EtPriceContextValue {
  const context = useContext(EtPriceContext);
  if (!context) {
    throw new Error('[useEtPriceContext]: must be used within an EtPrice component');
  }
  return context;
}
