import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { PropsWithChildren, RefObject } from 'react';

import { useEtoroTheme } from '../../../../core/hooks/use-etoro-theme';
import { BottomSheetConfigContext } from './et-bottom-sheet-config.context';
import { BottomSheetStateContext } from './et-bottom-sheet-state.context';

export interface BottomSheetProviderProps extends PropsWithChildren {
  /** Reference to the bottom sheet modal */
  bottomSheetRef: RefObject<BottomSheetModal | null>;
  /** Show drag handle indicator */
  showHandle: boolean;
  /** Close on backdrop tap */
  closeOnBackdrop: boolean;
  /** Enable pan down to close */
  enablePanDownToClose: boolean;
  /** Whether sheet is in loading state */
  isLoading: boolean;
  /** Whether sheet is currently presented */
  isPresented: boolean;
  /** Callback to intercept close action, return false to prevent */
  onBeforeClose?: () => boolean | void;
}

/**
 * Provider component that wraps the bottom sheet content and provides
 * both config and state contexts to subcomponents.
 *
 * Note: No manual memoization - React Compiler handles optimization.
 */
export function BottomSheetProvider({
  children,
  bottomSheetRef,
  showHandle,
  closeOnBackdrop,
  enablePanDownToClose,
  isLoading,
  isPresented,
  onBeforeClose,
}: BottomSheetProviderProps) {
  const { colors } = useEtoroTheme();

  // Raw imperative dismiss - directly calls the library's dismiss method
  const dismiss = () => {
    bottomSheetRef.current?.dismiss();
  };

  // Semantic close handler for subcomponents (e.g., close action in Header)
  // Supports onBeforeClose interception for confirmation dialogs
  const handleClose = () => {
    // Allow consumer to intercept and prevent close
    if (onBeforeClose) {
      const shouldClose = onBeforeClose();
      if (shouldClose === false) {
        return; // Abort close
      }
    }
    bottomSheetRef.current?.dismiss();
  };

  // Static config context value
  const configValue = {
    showHandle,
    closeOnBackdrop,
    enablePanDownToClose,
    colors: {
      background: colors.backgroundMenu,
      handle: colors.carbon300,
      text: colors.carbon900,
      textSecondary: colors.carbon600,
      divider: colors.carbonPrimaryDivider,
    },
  };

  // Dynamic state context value
  const stateValue = {
    isPresented,
    isLoading,
    dismiss,
    handleClose,
  };

  return (
    <BottomSheetConfigContext.Provider value={configValue}>
      <BottomSheetStateContext.Provider value={stateValue}>{children}</BottomSheetStateContext.Provider>
    </BottomSheetConfigContext.Provider>
  );
}
