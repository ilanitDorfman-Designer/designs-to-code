import { createContext, useContext } from 'react';

import type { SymbolContextValue } from '../api/types';

export const SymbolContext = createContext<SymbolContextValue | null>(null);

/**
 * Hook to access symbol context from subcomponents
 * @throws Error if used outside of EtSymbol
 */
export function useSymbolContext(): SymbolContextValue {
  const context = useContext(SymbolContext);
  if (!context) {
    throw new Error('EtSymbol compound components must be used within an EtSymbol component');
  }
  return context;
}
