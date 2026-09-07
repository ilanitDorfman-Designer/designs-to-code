import { createContext, useContext } from 'react';

import { BottomSheetConfigContextValue } from '../api';

/**
 * Context for static configuration that rarely changes.
 * Components using only this context won't re-render on state changes.
 */
export const BottomSheetConfigContext = createContext<BottomSheetConfigContextValue | null>(null);

/**
 * Access static config props (showHandle, closeOnBackdrop, colors, etc.)
 * These rarely change, so components using only this hook won't re-render frequently.
 *
 * @returns Static configuration values
 * @throws Error if used outside of EtBottomSheet
 *
 * @example
 * ```tsx
 * function MySubcomponent() {
 *   const { colors, showHandle } = useBottomSheetConfig();
 *   return <View style={{ backgroundColor: colors.background }} />;
 * }
 * ```
 */
export function useBottomSheetConfig(): BottomSheetConfigContextValue {
  const context = useContext(BottomSheetConfigContext);
  if (!context) {
    throw new Error('EtBottomSheet compound components must be used within <EtBottomSheet>');
  }
  return context;
}
