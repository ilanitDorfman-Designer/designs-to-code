import { createContext, useContext } from 'react';

import type { SwipeableRowContextValue } from '../api/types';

/**
 * Context for sharing swipeable row state with child components.
 */
export const SwipeableRowContext = createContext<SwipeableRowContextValue | null>(null);

/**
 * Hook to access swipeable row context from child components.
 * Used by Action subcomponents and other children that need to interact with the swipe state.
 * @throws Error if used outside of EtSwipeableRow
 */
export function useSwipeableRowContext(): SwipeableRowContextValue {
  const context = useContext(SwipeableRowContext);
  if (!context) {
    throw new Error('useSwipeableRowContext must be used within an EtSwipeableRow component');
  }
  return context;
}
