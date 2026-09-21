import { createContext, useContext } from 'react';

import { ModalStateContextValue } from '../api';

/**
 * Context for dynamic state that changes on interaction.
 */
export const ModalStateContext = createContext<ModalStateContextValue | null>(null);

/**
 * Access dynamic state (isPresented, isLoading, dismiss, handleClose)
 */
export function useModalState(): ModalStateContextValue {
  const context = useContext(ModalStateContext);
  if (!context) {
    throw new Error('EtModal compound components must be used within <EtModal>');
  }
  return context;
}
