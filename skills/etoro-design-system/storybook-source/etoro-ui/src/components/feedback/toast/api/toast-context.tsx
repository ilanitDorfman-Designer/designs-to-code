import { createContext, useContext } from 'react';

import type { ToastStatus, ToastType, ToastVariant } from './types';

/**
 * Internal toast context value - shared state for toast subcomponents
 */
export interface ToastInternalContextValue {
  /** The type of toast being displayed */
  type: ToastType;
  /** The current status of the toast */
  status: ToastStatus;
  /** The current surface variant (drives text color etc.) */
  variant: ToastVariant;
}

/**
 * Context for sharing toast state with subcomponents
 * This allows subcomponents to access status without prop drilling
 */
export const ToastInternalContext = createContext<ToastInternalContextValue | null>(null);

/**
 * Hook to access toast internal context from subcomponents
 * @throws Error if used outside of EtToast
 */
export function useToastInternalContext(): ToastInternalContextValue {
  const context = useContext(ToastInternalContext);
  if (!context) {
    throw new Error('Toast subcomponents must be used within an EtToast component');
  }
  return context;
}
