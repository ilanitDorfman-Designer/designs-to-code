import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

export interface ReducedMotionState {
  isReducedMotionEnabled: boolean;
  hasResolved: boolean;
}

/**
 * Hook to detect if the user has enabled reduced motion in system settings.
 * Used to disable or simplify animations for accessibility.
 *
 * @example
 * ```tsx
 * const reducedMotion = useReducedMotion();
 *
 * // Use simpler animation when reduced motion is enabled
 * const animationConfig = reducedMotion
 *   ? { duration: 0 }
 *   : { type: 'spring', damping: 20 };
 * ```
 *
 * @returns Whether reduced motion is enabled
 */
export function useReducedMotion(): boolean {
  return useReducedMotionState().isReducedMotionEnabled;
}

export function useReducedMotionState(): ReducedMotionState {
  const [state, setState] = useState<ReducedMotionState>({
    isReducedMotionEnabled: false,
    hasResolved: false,
  });

  useEffect(() => {
    let isMounted = true;

    // Check initial state
    AccessibilityInfo.isReduceMotionEnabled()
      .then((enabled) => {
        if (isMounted) {
          setState({ isReducedMotionEnabled: enabled, hasResolved: true });
        }
      })
      .catch(() => {
        if (isMounted) {
          setState({ isReducedMotionEnabled: true, hasResolved: true });
        }
      });

    // Subscribe to changes
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', (enabled) => {
      setState({ isReducedMotionEnabled: enabled, hasResolved: true });
    });

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, []);

  return state;
}
