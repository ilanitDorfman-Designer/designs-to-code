import { createContext, useContext } from 'react';

import { RadioGroupContextValue } from '../api/types';

/**
 * Context for sharing RadioGroup state with Option subcomponents
 */
export const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

/**
 * Hook to access RadioGroup context from subcomponents
 * @throws Error if used outside of EtRadioGroup
 */
export function useRadioGroupContext(): RadioGroupContextValue {
  const context = useContext(RadioGroupContext);
  if (!context) {
    throw new Error('EtRadioGroup.Option must be used within an EtRadioGroup component');
  }
  return context;
}
