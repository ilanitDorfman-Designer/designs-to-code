import { ReactNode, useCallback, useMemo } from 'react';

import { useEtoroTheme } from '../../../../core/hooks/use-etoro-theme';
import { ModalConfigContextValue, ModalStateContextValue } from '../api';
import { ModalConfigContext } from './modal-config.context';
import { ModalStateContext } from './modal-state.context';

interface ModalProviderProps {
  children: ReactNode;
  showHandle: boolean;
  closeOnBackdrop: boolean;
  enableSwipeToClose: boolean;
  isLoading: boolean;
  isPresented: boolean;
  dismiss: () => void;
  /** Sheet surface color resolved from EtModal's `surface` prop. Handle, Header & Footer paint with
   *  this so the whole modal reads as a single uniform surface; defaults to bgNeutralTertiary for back-compat. */
  backgroundColor?: string;
}

export function ModalProvider({
  children,
  showHandle,
  closeOnBackdrop,
  enableSwipeToClose,
  isLoading,
  isPresented,
  dismiss,
  backgroundColor,
}: ModalProviderProps) {
  const { colors } = useEtoroTheme();

  const configValue: ModalConfigContextValue = useMemo(
    () => ({
      showHandle,
      closeOnBackdrop,
      enableSwipeToClose,
      colors: {
        background: backgroundColor ?? colors.bgNeutralTertiary,
        handle: colors.dividerSecondary,
        text: colors.textPrimaryNeutral,
        textSecondary: colors.textSecondaryNeutral,
        divider: colors.dividerPrimary,
      },
    }),
    [showHandle, closeOnBackdrop, enableSwipeToClose, colors, backgroundColor],
  );

  // handleClose delegates to dismiss which handles onBeforeClose guard
  const handleClose = useCallback(() => {
    dismiss();
  }, [dismiss]);

  const stateValue: ModalStateContextValue = useMemo(
    () => ({
      isPresented,
      isLoading,
      dismiss,
      handleClose,
    }),
    [isPresented, isLoading, dismiss, handleClose],
  );

  return (
    <ModalConfigContext.Provider value={configValue}>
      <ModalStateContext.Provider value={stateValue}>{children}</ModalStateContext.Provider>
    </ModalConfigContext.Provider>
  );
}
