import { OverlayPriority, useRegisterOverlaySurface } from '@etoro/common/infra/app-float-overlay';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Platform } from 'react-native';

import { ToastContainer } from '../subcomponents/toast-container';
import type { ShowToastConfig, ToastConfig, ToastContextValue, ToastProviderProps } from './types';
import { DEFAULT_MAX_TOASTS, DEFAULT_TOAST_DURATION } from './types';

/**
 * Generate a unique ID for each toast
 */
function generateToastId(): string {
  return `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Toast context for accessing toast functions throughout the app
 */
export const ToastContext = createContext<ToastContextValue | null>(null);

/**
 * Provider-config context for the container-slot. Exposes the render-time
 * config (`visibleToasts`, `expandByDefault`) so the container registered into
 * `AppFloatOverlayHost` can pick them up without threading props through the
 * host tree.
 */
interface ToastContainerConfig {
  visibleToasts: number | undefined;
  expandByDefault: boolean | undefined;
}
const ToastContainerConfigContext = createContext<ToastContainerConfig>({
  visibleToasts: undefined,
  expandByDefault: undefined,
});

/**
 * Hook to access the toast context
 * @throws Error if used outside of ToastProvider
 */
export function useToastContext(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider. ' + 'Wrap your app with <ToastProvider> to use toast functionality.');
  }
  return context;
}

/**
 * Slot component registered with `AppFloatOverlayHost` on iOS.
 *
 * The consolidated overlay host renders this component inside its shared,
 * non-modal `FullWindowOverlay` — so it reads the toast state via
 * `useToastContext()` (available because `ToastProvider` wraps the host in
 * the root layout) and renders the same `ToastContainer` that Android
 * renders inline.
 *
 * Module-level (not defined inside `ToastProvider`) so its reference is
 * stable across `ToastProvider` renders — otherwise `useRegisterOverlaySurface`
 * would re-register on every render and force the host to remount its
 * subtree.
 */
function ToastOverlaySlot(): React.ReactElement | null {
  const { toasts, dismissToast } = useToastContext();
  const { visibleToasts, expandByDefault } = useContext(ToastContainerConfigContext);
  return <ToastContainer toasts={toasts} onDismiss={dismissToast} visibleToasts={visibleToasts} expandByDefault={expandByDefault} />;
}

/**
 * Registers the toast slot with the app-controlled overlay layer on iOS.
 * No-op on Android — the container renders inline instead.
 *
 * Kept as a leaf component (rather than a top-level `useEffect` inside
 * `ToastProvider`) so its `useRegisterOverlaySurface` call only runs on iOS
 * — Android skips the effect entirely.
 */
function ToastOverlayRegistrar(): null {
  useRegisterOverlaySurface('toast', OverlayPriority.Toast, ToastOverlaySlot);
  return null;
}

/**
 * ToastProvider - Provides toast functionality to the entire app
 *
 * Wrap your app with this provider to enable toast notifications.
 *
 * On iOS the toast stack renders inside the consolidated `AppFloatOverlayHost`
 * so it stays above every bottom-sheet overlay via the shared re-assert-front
 * mechanism. On Android it renders inline as before.
 *
 * @example
 * ```tsx
 * <ToastProvider>
 *   <App />
 * </ToastProvider>
 * ```
 */
export function ToastProvider({
  children,
  maxToasts = DEFAULT_MAX_TOASTS,
  defaultDuration = DEFAULT_TOAST_DURATION,
  visibleToasts,
  expandByDefault,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastConfig[]>([]);

  /**
   * Show a new toast notification
   * Returns the toast ID for programmatic dismissal
   */
  const showToast = useCallback(
    (config: ShowToastConfig): string => {
      const id = generateToastId();
      const toastConfig: ToastConfig = {
        ...config,
        id,
        duration: config.duration ?? defaultDuration,
      };

      setToasts((current) => {
        // If at max capacity, remove the oldest toast
        const newToasts = current.length >= maxToasts ? current.slice(1) : current;
        return [...newToasts, toastConfig];
      });

      return id;
    },
    [maxToasts, defaultDuration],
  );

  /**
   * Dismiss a specific toast by ID
   */
  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  /**
   * Dismiss all active toasts
   */
  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  const contextValue = useMemo<ToastContextValue>(
    () => ({
      toasts,
      showToast,
      dismissToast,
      dismissAll,
    }),
    [toasts, showToast, dismissToast, dismissAll],
  );

  const containerConfig = useMemo<ToastContainerConfig>(() => ({ visibleToasts, expandByDefault }), [visibleToasts, expandByDefault]);

  const isIos = Platform.OS === 'ios';

  return (
    <ToastContext.Provider value={contextValue}>
      <ToastContainerConfigContext.Provider value={containerConfig}>
        {children}
        {isIos ? (
          // iOS: the container is rendered by `AppFloatOverlayHost` instead,
          // so it can be re-asserted above bottom sheets.
          <ToastOverlayRegistrar />
        ) : (
          <ToastContainer toasts={toasts} onDismiss={dismissToast} visibleToasts={visibleToasts} expandByDefault={expandByDefault} />
        )}
      </ToastContainerConfigContext.Provider>
    </ToastContext.Provider>
  );
}
