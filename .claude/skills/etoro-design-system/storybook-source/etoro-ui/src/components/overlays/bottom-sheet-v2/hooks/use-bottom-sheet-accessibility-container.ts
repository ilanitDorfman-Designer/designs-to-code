import type { ComponentType, PropsWithChildren } from 'react';

export interface UseBottomSheetAccessibilityContainerParams {
  isDismissible: boolean;
  onBeforeClose?: () => boolean | void;
  onDismiss: () => void;
}

export function useBottomSheetAccessibilityContainer(
  _params: UseBottomSheetAccessibilityContainerParams,
): ComponentType<PropsWithChildren> | undefined {
  return undefined;
}
