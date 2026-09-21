import { createContext, useContext } from 'react';

import type { ListItemLayoutMode } from '../api';

/**
 * Context value shared between EtListItem and its slot subcomponents.
 * Slots use layoutMode to determine their flex behavior.
 */
export interface ListItemContextValue {
  /** Current layout mode based on which slots are present */
  layoutMode: ListItemLayoutMode;
}

/**
 * Context for sharing layout mode with slot subcomponents
 */
export const ListItemContext = createContext<ListItemContextValue | null>(null);

/**
 * Hook to access list item context from slot subcomponents.
 * @throws Error if used outside of EtListItem
 */
export function useListItemContext(): ListItemContextValue {
  const context = useContext(ListItemContext);
  if (!context) {
    throw new Error('EtListItem slot components (Start, Middle, End) must be used within an EtListItem component');
  }
  return context;
}
