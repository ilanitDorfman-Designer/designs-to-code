import { createContext, useContext } from 'react';

import { ModalConfigContextValue } from '../api';

/**
 * Context for static configuration that rarely changes.
 */
export const ModalConfigContext = createContext<ModalConfigContextValue | null>(null);

/**
 * Access static config props (showHandle, closeOnBackdrop, colors, etc.)
 */
export function useModalConfig(): ModalConfigContextValue {
  const context = useContext(ModalConfigContext);
  if (!context) {
    throw new Error('EtModal compound components must be used within <EtModal>');
  }
  return context;
}
