import { useCallback, useEffect, useRef } from 'react';

interface UseAutoDismissTimerParams {
  /** Duration before auto-dismiss in ms */
  duration: number;
  /** Callback when timer expires */
  onExpire: () => void;
}

interface UseAutoDismissTimerResult {
  /** Pause the timer (stores remaining time) */
  pauseTimer: () => void;
  /** Resume the timer from remaining time. No-op unless currently paused. */
  resumeTimer: () => void;
  /** Replace the stored remaining time (e.g. short grace after a read). */
  setRemainingTime: (ms: number) => void;
}

/**
 * Manages the auto-dismiss timer for toasts
 *
 * Features:
 * - Starts automatically on mount
 * - Can be paused (e.g., when user holds the toast)
 * - Tracks remaining time when paused
 * - Cleans up on unmount
 */
export function useAutoDismissTimer({ duration, onExpire }: UseAutoDismissTimerParams): UseAutoDismissTimerResult {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const remainingTimeRef = useRef(duration);
  const startTimeRef = useRef<number | null>(null);
  const isPausedRef = useRef(false);

  const startTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (duration === 0) {
      startTimeRef.current = null;
      isPausedRef.current = false;
      return;
    }
    startTimeRef.current = Date.now();
    timerRef.current = setTimeout(onExpire, remainingTimeRef.current);
    isPausedRef.current = false;
  }, [duration, onExpire]);

  const pauseTimer = useCallback(() => {
    if (timerRef.current && startTimeRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
      const elapsed = Date.now() - startTimeRef.current;
      remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed);
      isPausedRef.current = true;
    }
  }, []);

  const resumeTimer = useCallback(() => {
    // Resuming an already-running timer would restart it from the full
    // remaining time, silently extending the toast's life. Callers now pause
    // for several independent reasons (hold, expanded stack), so they can and
    // do resume more than once per pause.
    if (!isPausedRef.current) return;

    // Zero duration is the manual-dismiss contract, not an exhausted timer.
    if (duration === 0) {
      isPausedRef.current = false;
      return;
    }

    if (remainingTimeRef.current > 0) {
      startTimer();
    } else {
      // Pause landed at/after expiry: nothing left to wait for. Clear the pause
      // latch and dismiss immediately so we never strand `isPausedRef` true.
      isPausedRef.current = false;
      onExpire();
    }
  }, [duration, onExpire, startTimer]);

  const setRemainingTime = useCallback((ms: number) => {
    remainingTimeRef.current = ms;
  }, []);

  // Start timer on mount, preserve pause state on duration changes
  useEffect(() => {
    // Only reset and start if not currently paused
    if (!isPausedRef.current) {
      remainingTimeRef.current = duration;
      startTimer();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [duration, startTimer]);

  return { pauseTimer, resumeTimer, setRemainingTime };
}
