import { createContext, useContext } from 'react';

export interface LiquidGlassContextValue {
  isLiquidGlass: boolean;
}

/**
 * Context for sharing Liquid Glass availability with subcomponents.
 * Provided at a root level (e.g. EtTopbar) so children can adapt
 * their rendering without calling `useLiquidGlass()` individually.
 */
export const LiquidGlassContext = createContext<LiquidGlassContextValue>({
  isLiquidGlass: false,
});

/**
 * Hook to read whether Liquid Glass is active in the current subtree.
 * Safe to call outside a provider -- defaults to `false`.
 */
export function useLiquidGlassContext(): LiquidGlassContextValue {
  return useContext(LiquidGlassContext);
}
