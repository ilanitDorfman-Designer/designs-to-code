import { createContext, useContext } from 'react';

/**
 * The hot-path value context: the formatted value string that changes on every keystroke. Only the
 * `Value` subcomponent consumes it, so currency/unit/caret don't re-render when the value updates.
 */
export interface AmountInputDisplayValueContextValue {
  value: string;
}

const AmountInputDisplayValueContext = createContext<AmountInputDisplayValueContextValue | null>(null);

export const AmountInputDisplayValueProvider = AmountInputDisplayValueContext.Provider;

/** Access the current value; throws when a subcomponent is used outside `EtAmountInputDisplay`. */
export function useAmountInputDisplayValueContext(): AmountInputDisplayValueContextValue {
  const context = useContext(AmountInputDisplayValueContext);
  if (!context) {
    throw new Error('EtAmountInputDisplay compound components must be used within an <EtAmountInputDisplay>');
  }
  return context;
}
