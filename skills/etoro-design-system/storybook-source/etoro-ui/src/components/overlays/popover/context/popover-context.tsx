import { createContext, useContext } from 'react';

import type { PopoverContextValue } from '../api/types';

/**
 * Context for sharing popover state with subcomponents
 */
export const PopoverContext = createContext<PopoverContextValue | null>(null);

/**
 * Hook to access popover context from subcomponents
 * @throws Error if used outside of EtPopover
 */
export function usePopoverContext(): PopoverContextValue {
  const context = useContext(PopoverContext);
  if (!context) {
    throw new Error('EtPopover compound components must be used within an EtPopover component');
  }
  return context;
}
