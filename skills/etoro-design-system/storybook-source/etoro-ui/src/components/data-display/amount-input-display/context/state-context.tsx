import { createContext, useContext } from 'react';
import type { SharedValue } from 'react-native-reanimated';

/**
 * Interaction/measurement state shared with subcomponents: the caret's shared opacity and the
 * affix-width registry callbacks the measured subcomponents (currency/unit/caret) use to report their
 * widths back to the root's scale math. Stable references, so it does not churn on value changes.
 */
export interface AmountInputDisplayStateContextValue {
  caretOpacity: SharedValue<number>;
  registerAffixWidth: (id: string, width: number) => void;
  clearAffixWidth: (id: string) => void;
}

const AmountInputDisplayStateContext = createContext<AmountInputDisplayStateContextValue | null>(null);

export const AmountInputDisplayStateProvider = AmountInputDisplayStateContext.Provider;

/** Access the interaction state; throws when a subcomponent is used outside `EtAmountInputDisplay`. */
export function useAmountInputDisplayStateContext(): AmountInputDisplayStateContextValue {
  const context = useContext(AmountInputDisplayStateContext);
  if (!context) {
    throw new Error('EtAmountInputDisplay compound components must be used within an <EtAmountInputDisplay>');
  }
  return context;
}
