import { createContext, useContext } from 'react';

import type { WizardContextValue } from '../api';

export const WizardContext = createContext<WizardContextValue | null>(null);

export function useWizardContext(): WizardContextValue {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error('EtWizard compound components must be used within an EtWizard component');
  }
  return context;
}
