import { createContext, useContext } from 'react';

import { BottomSheetStateContextValue } from '../api';

/**
 * Context for dynamic state that changes on interaction.
 * Components using this context will re-render on state changes.
 */
export const BottomSheetStateContext = createContext<BottomSheetStateContextValue | null>(null);

/**
 * Access dynamic state (isPresented, isLoading, dismiss, handleClose)
 * Changes when sheet opens/closes or loading state changes.
 *
 * @returns Dynamic state values and handlers
 * @throws Error if used outside of EtBottomSheet
 *
 * @example
 * ```tsx
 * function CloseButton() {
 *   const { handleClose, isLoading } = useBottomSheetState();
 *   return (
 *     <Button onPress={handleClose} disabled={isLoading}>
 *       Close
 *     </Button>
 *   );
 * }
 * ```
 */
export function useBottomSheetState(): BottomSheetStateContextValue {
  const context = useContext(BottomSheetStateContext);
  if (!context) {
    throw new Error('EtBottomSheet compound components must be used within <EtBottomSheet>');
  }
  return context;
}
