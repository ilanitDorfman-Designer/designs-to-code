import { createContext, useContext } from 'react';

import type { DigitAnchor } from '../../../../foundations/animated-digits';
import type { FontWeightKey } from '../../../../foundations/text/utils';

/**
 * Static geometry + color config for the amount row. Rarely changes (only when props change), so the
 * affix subcomponents that read it (currency/unit/caret) don't re-render on every keystroke.
 */
export interface AmountInputDisplayConfigContextValue {
  fontSize: number;
  digitWidth: number;
  digitHeight: number;
  affixFontSize: number;
  currencyFontSize: number;
  weight: FontWeightKey;
  digitAnchor: DigitAnchor;
  numberColor: string;
  affixColor: string;
  currencyColor: string;
  caretColor: string;
}

const AmountInputDisplayConfigContext = createContext<AmountInputDisplayConfigContextValue | null>(null);

export const AmountInputDisplayConfigProvider = AmountInputDisplayConfigContext.Provider;

/** Access the static config; throws when a subcomponent is used outside `EtAmountInputDisplay`. */
export function useAmountInputDisplayConfigContext(): AmountInputDisplayConfigContextValue {
  const context = useContext(AmountInputDisplayConfigContext);
  if (!context) {
    throw new Error('EtAmountInputDisplay compound components must be used within an <EtAmountInputDisplay>');
  }
  return context;
}
