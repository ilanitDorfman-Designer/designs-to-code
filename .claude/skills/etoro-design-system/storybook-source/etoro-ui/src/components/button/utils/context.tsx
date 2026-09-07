import { createContext, useContext } from 'react';

import type { ButtonContextValue } from './types';

/**
 * Context for sharing button state with subcomponents
 */
export const ButtonContext = createContext<ButtonContextValue | null>(null);

/**
 * Hook to access button context from subcomponents
 * @throws Error if used outside of EtButton
 */
export function useButtonContext(): ButtonContextValue {
  const context = useContext(ButtonContext);
  if (!context) {
    throw new Error('EtButton compound components must be used within an EtButton component');
  }
  return context;
}
