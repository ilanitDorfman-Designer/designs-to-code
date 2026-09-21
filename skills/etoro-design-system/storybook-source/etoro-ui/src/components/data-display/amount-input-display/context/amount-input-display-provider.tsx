import { type ReactNode } from 'react';

import { type AmountInputDisplayConfigContextValue, AmountInputDisplayConfigProvider } from './config-context';
import { type AmountInputDisplayStateContextValue, AmountInputDisplayStateProvider } from './state-context';
import { type AmountInputDisplayValueContextValue, AmountInputDisplayValueProvider } from './value-context';

interface AmountInputDisplayProviderProps {
  config: AmountInputDisplayConfigContextValue;
  state: AmountInputDisplayStateContextValue;
  value: AmountInputDisplayValueContextValue;
  children: ReactNode;
}

/**
 * Composed provider that wires the split contexts (config / state / value) so the value hot path is
 * isolated from the static config and interaction state, keeping affix subcomponents from re-rendering
 * on every keystroke.
 */
export function AmountInputDisplayProvider({ config, state, value, children }: AmountInputDisplayProviderProps) {
  return (
    <AmountInputDisplayConfigProvider value={config}>
      <AmountInputDisplayStateProvider value={state}>
        <AmountInputDisplayValueProvider value={value}>{children}</AmountInputDisplayValueProvider>
      </AmountInputDisplayStateProvider>
    </AmountInputDisplayConfigProvider>
  );
}
