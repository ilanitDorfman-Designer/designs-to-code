import { createContext, useContext } from 'react';

import { InstrumentIslandContextValue } from './types';

/**
 * Internal context for the {@link EtInstrumentIsland} compound component.
 */
export const InstrumentIslandContext = createContext<InstrumentIslandContextValue | null>(null);

/**
 * Access the island context from a subcomponent.
 *
 * @throws when used outside of `EtInstrumentIsland`.
 */
export function useInstrumentIslandContext(): InstrumentIslandContextValue {
  const context = useContext(InstrumentIslandContext);
  if (!context) {
    throw new Error('EtInstrumentIsland subcomponents must be rendered within an EtInstrumentIsland component.');
  }
  return context;
}
