import { createContext, useContext } from 'react';

import type { TickerContextValue } from '../api/types';

/**
 * Context for sharing ticker theme colors with subcomponents.
 * Eliminates prop drilling of colors through every layer.
 */
export const TickerContext = createContext<TickerContextValue | null>(null);

/**
 * Hook to access ticker context from subcomponents.
 * @throws Error if used outside of EtTicker
 */
export function useTickerContext(): TickerContextValue {
  const context = useContext(TickerContext);
  if (!context) {
    throw new Error('EtTicker compound components must be used within an EtTicker component');
  }
  return context;
}
