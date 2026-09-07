import { createContext, useContext } from 'react';

import { ButtonGroupContextValue } from '../api';

/**
 * Context for sharing button position state with subcomponents
 */
export const ButtonGroupContext = createContext<ButtonGroupContextValue | null>(null);

/**
 * Hook to access button group context from subcomponents
 * @throws Error if used outside of EtButtonGroup
 */
export function useButtonGroupContext(): ButtonGroupContextValue {
  const context = useContext(ButtonGroupContext);
  if (!context) {
    throw new Error('EtButtonGroup compound components must be used within an EtButtonGroup component');
  }
  return context;
}
