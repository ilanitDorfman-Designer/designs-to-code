import { createContext, useContext } from 'react';

/**
 * Context value shared between `EtList` and its compound subcomponents.
 *
 * Only structural metadata that subcomponents may need at render time is
 * passed via context — sort/data/error live on the root component props.
 */
export interface ListContextValue {
  /** Whether the list is in the empty state (used to avoid double-rendering hairlines). */
  isEmpty: boolean;
}

/** Context provider for `EtList` subcomponents. */
export const ListContext = createContext<ListContextValue | null>(null);

/**
 * Hook for subcomponents to read the parent `EtList` context.
 *
 * @throws if used outside of `EtList`.
 */
export function useListContext(): ListContextValue {
  const context = useContext(ListContext);
  if (!context) {
    throw new Error('EtList subcomponents must be used within an <EtList> component');
  }
  return context;
}
