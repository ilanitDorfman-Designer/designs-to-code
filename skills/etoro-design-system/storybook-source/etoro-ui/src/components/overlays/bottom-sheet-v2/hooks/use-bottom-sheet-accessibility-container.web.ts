import React, { type ComponentType, type PropsWithChildren, useMemo, useRef } from 'react';
import { Modal } from 'react-native';

import type { UseBottomSheetAccessibilityContainerParams } from './use-bottom-sheet-accessibility-container';

export function useBottomSheetAccessibilityContainer(
  params: UseBottomSheetAccessibilityContainerParams,
): ComponentType<PropsWithChildren> {
  const paramsRef = useRef(params);
  paramsRef.current = params;

  return useMemo(() => {
    function BottomSheetAccessibilityContainer({ children }: PropsWithChildren): React.JSX.Element {
      const handleRequestClose = () => {
        const { isDismissible, onBeforeClose, onDismiss } = paramsRef.current;
        if (!isDismissible || onBeforeClose?.() === false) {
          return;
        }
        onDismiss();
      };

      return React.createElement(Modal, {
        animationType: 'none',
        children,
        onRequestClose: handleRequestClose,
        transparent: true,
      });
    }

    BottomSheetAccessibilityContainer.displayName = 'BottomSheetAccessibilityContainer';
    return BottomSheetAccessibilityContainer;
  }, []);
}
