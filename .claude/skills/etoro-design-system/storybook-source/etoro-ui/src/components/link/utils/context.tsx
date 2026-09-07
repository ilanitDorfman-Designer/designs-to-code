import { createContext, useContext } from 'react';

import type { LinkContextValue } from '../api/types';

/**
 * Context for sharing link state with subcomponents
 */
export const LinkContext = createContext<LinkContextValue | null>(null);

/**
 * Hook to access link context from subcomponents
 * @throws Error if used outside of EtLink
 */
export function useLinkContext(): LinkContextValue {
  const context = useContext(LinkContext);
  if (!context) {
    throw new Error('EtLink compound components must be used within an EtLink component');
  }
  return context;
}
