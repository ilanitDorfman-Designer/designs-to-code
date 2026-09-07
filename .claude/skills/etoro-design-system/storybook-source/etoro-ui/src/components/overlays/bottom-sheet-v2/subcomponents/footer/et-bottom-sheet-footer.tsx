import { ReactNode } from 'react';

import { EtBottomSheetFooterProps } from './et-bottom-sheet-footer.types';

/**
 * EtBottomSheet.Footer - Footer section for action buttons
 *
 * Features:
 * - Sticky at bottom (stays visible when content scrolls)
 * - Keyboard-aware positioning (moves up when keyboard appears)
 * - Safe area handling for devices with notch
 * - Stacked button layout with consistent spacing
 *
 * Note: The actual sticky positioning and styling is handled by the parent
 * EtBottomSheet component using @gorhom/bottom-sheet's BottomSheetFooter.
 * This component is a marker/wrapper for the footer content.
 *
 * @example Single button
 * ```tsx
 * <EtBottomSheet.Footer>
 *   <EtButton variant="primary-filled" stretch onPress={handleConfirm}>
 *     <EtButton.Label>Confirm</EtButton.Label>
 *   </EtButton>
 * </EtBottomSheet.Footer>
 * ```
 *
 * @example Stacked buttons
 * ```tsx
 * <EtBottomSheet.Footer>
 *   <EtButton variant="primary-filled" stretch onPress={handleConfirm}>
 *     <EtButton.Label>Confirm</EtButton.Label>
 *   </EtButton>
 *   <EtButton variant="primary-subtle" stretch onPress={handleCancel}>
 *     <EtButton.Label>Cancel</EtButton.Label>
 *   </EtButton>
 * </EtBottomSheet.Footer>
 * ```
 */
export function EtBottomSheetFooter({ children }: EtBottomSheetFooterProps): ReactNode {
  // Footer content is rendered by the parent EtBottomSheet component
  // using BottomSheetFooter for proper sticky positioning
  return children;
}

EtBottomSheetFooter.displayName = 'EtBottomSheet.Footer';
