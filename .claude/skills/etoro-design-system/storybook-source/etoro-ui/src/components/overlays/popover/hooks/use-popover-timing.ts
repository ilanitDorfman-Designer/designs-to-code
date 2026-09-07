import { useCallback, useEffect, useRef, useState } from 'react';

interface UsePopoverTimingParams {
  /** Whether the popover should be visible (from props) */
  visible: boolean;
  /** Delay before showing the popover */
  showDelay: number;
  /** Delay before auto-hiding (0 = no auto-hide) */
  autoHideDelay: number;
  /** Callback when visibility changes */
  onVisibilityChange?: (visible: boolean) => void;
  /** Callback when auto-hide triggers */
  onClose?: () => void;
}

interface UsePopoverTimingResult {
  /** Whether the popover should actually be rendered */
  isVisible: boolean;
  /** Manually trigger hide */
  hide: () => void;
}

/**
 * Hook to manage popover show/hide timing
 * Handles show delay and auto-hide functionality
 */
export function usePopoverTiming({ visible, showDelay, autoHideDelay, onVisibilityChange, onClose }: UsePopoverTimingParams): UsePopoverTimingResult {
  const [isVisible, setIsVisible] = useState(false);
  const showTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Store callbacks in refs to avoid re-running the effect when inline callbacks change
  const onVisibilityChangeRef = useRef(onVisibilityChange);
  const onCloseRef = useRef(onClose);

  // Keep refs up to date
  useEffect(() => {
    onVisibilityChangeRef.current = onVisibilityChange;
    onCloseRef.current = onClose;
  }, [onVisibilityChange, onClose]);

  // Clear all timeouts
  const clearTimeouts = useCallback(() => {
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = null;
    }
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  }, []);

  /**
   * Helper to set up auto-hide timeout
   * Clears any existing hide timeout before setting a new one
   */
  const setupAutoHide = useCallback((delay: number) => {
    if (delay > 0) {
      // Clear existing hide timeout before setting new one
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
      hideTimeoutRef.current = setTimeout(() => {
        setIsVisible(false);
        onVisibilityChangeRef.current?.(false);
        onCloseRef.current?.();
      }, delay);
    }
  }, []);

  // Handle visibility changes
  useEffect(() => {
    clearTimeouts();

    if (visible) {
      // Show with delay
      if (showDelay > 0) {
        showTimeoutRef.current = setTimeout(() => {
          setIsVisible(true);
          onVisibilityChangeRef.current?.(true);
          setupAutoHide(autoHideDelay);
        }, showDelay);
      } else {
        setIsVisible(true);
        onVisibilityChangeRef.current?.(true);
        setupAutoHide(autoHideDelay);
      }
    } else {
      setIsVisible(false);
      onVisibilityChangeRef.current?.(false);
    }

    return () => {
      clearTimeouts();
    };
  }, [visible, showDelay, autoHideDelay, clearTimeouts, setupAutoHide]);

  // Manual hide function
  const hide = useCallback(() => {
    clearTimeouts();
    setIsVisible(false);
    onVisibilityChangeRef.current?.(false);
    onCloseRef.current?.();
  }, [clearTimeouts]);

  return {
    isVisible,
    hide,
  };
}
