import { createContext, useContext } from 'react';

import { SelectionTileGroupContextValue } from '../api/types';

export const SelectionTileGroupContext = createContext<SelectionTileGroupContextValue | null>(null);

/**
 * @throws Error if used outside of EtSelectionTileGroup
 */
export function useSelectionTileGroupContext(): SelectionTileGroupContextValue {
  const context = useContext(SelectionTileGroupContext);
  if (!context) {
    throw new Error('EtSelectionTileGroup.Option must be used within an EtSelectionTileGroup component');
  }
  return context;
}
