import { createContext, useContext } from 'react';

import type { ToggleGroupContextValue } from '../api';

export const ToggleGroupContext = createContext<ToggleGroupContextValue | null>(null);

export function useToggleGroupContext(): ToggleGroupContextValue {
  const context = useContext(ToggleGroupContext);

  if (!context) {
    throw new Error('EtToggleGroup.Option must be used within an EtToggleGroup component.');
  }

  return context;
}
