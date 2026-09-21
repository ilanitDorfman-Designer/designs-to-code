import { useToastContext } from '../api/context';

/**
 * Hook to access toast functionality from any component
 *
 * @example
 * ```tsx
 * const { showToast, dismissToast, dismissAll } = useToast();
 *
 * // Show a success toast
 * const toastId = showToast({
 *   type: 'asset',
 *   status: 'success',
 *   asset: { logoUrl: 'https://...' },
 *   message: 'Order executed successfully',
 * });
 *
 * // Dismiss a specific toast
 * dismissToast(toastId);
 *
 * // Dismiss all toasts
 * dismissAll();
 * ```
 */
export function useToast() {
  const { showToast, dismissToast, dismissAll, toasts } = useToastContext();

  return {
    /** Show a new toast and get its ID */
    showToast,
    /** Dismiss a specific toast by ID */
    dismissToast,
    /** Dismiss all active toasts */
    dismissAll,
    /** Current number of active toasts */
    toastCount: toasts.length,
  };
}
