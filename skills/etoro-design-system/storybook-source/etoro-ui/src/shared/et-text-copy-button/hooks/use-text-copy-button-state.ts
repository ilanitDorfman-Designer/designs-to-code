import { useEtInject } from '@etoro/common/di/react';
import { ClipboardService } from '@etoro/common/infra/clipboard/core';
import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useRef, useState } from 'react';

export interface TextCopyButtonState {
  /** Whether the copy was successful */
  isCopied: boolean;
  /** Handler for copy action (fire-and-forget) */
  handleCopy: () => void;
  /** Error message if copy failed */
  error?: string;
}

/**
 * Manages internal component state for copy functionality.
 * Uses ClipboardService (platform-agnostic adapter) to copy text.
 */
/**
 * Copy implementation: performs the actual copy (e.g. clipboard, logging).
 * Return true on success, false on failure. Throw to report error with message.
 * If not provided to the component, it will handle clipboard copy by itself.
 */
export type TextCopyButtonOnCopy = (text: string) => Promise<boolean>;

/**
 * Manages internal component state for copy functionality.
 * When onCopy is provided: uses it (no implicit clipboard logic).
 * When onCopy is not provided: uses ClipboardService to copy text.
 */
export function useTextCopyButtonState({
  textToCopy,
  onCopy,
  successDuration = 2000,
  haptics = true,
  onError,
  afterCopy,
}: {
  textToCopy: string;
  /**
   * Custom copy implementation. If not provided, the component will handle clipboard copy by itself.
   */
  onCopy?: TextCopyButtonOnCopy;
  successDuration?: number;
  haptics?: boolean;
  /** Callback when copy fails (e.g. for analytics) */
  onError?: (error: string) => void;
  /** Callback when copy succeeds */
  afterCopy?: () => void;
}): TextCopyButtonState {
  const clipboard = useEtInject(ClipboardService);
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const clearPendingTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
  }, []);

  const raw = Number(successDuration);
  const sanitizedSuccessDuration = Number.isFinite(raw) ? Math.min(Math.max(0, raw), 60000) : 2000;

  const copyToClipboard = useCallback(async () => {
    try {
      setError(undefined);

      if (!textToCopy || !textToCopy.trim()) {
        const errorMessage = 'Cannot copy empty text';
        setIsCopied(false);
        setError(errorMessage);
        onError?.(errorMessage);
        clearPendingTimeout();
        return;
      }

      const copied = onCopy ? await onCopy(textToCopy) : await clipboard.copy(textToCopy);
      if (!copied) {
        const errorMessage = 'Failed to copy text';
        clearPendingTimeout();
        setIsCopied(false);
        setError(errorMessage);
        onError?.(errorMessage);
        return;
      }

      if (haptics) {
        try {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } catch {
          // Ignore haptics errors; copy succeeded
        }
      }

      setIsCopied(true);
      try {
        afterCopy?.();
      } catch (callbackError) {
        const errorMessage = callbackError instanceof Error ? callbackError.message : 'afterCopy callback failed';
        onError?.(errorMessage);
      }

      clearPendingTimeout();
      timeoutRef.current = setTimeout(() => {
        setIsCopied(false);
      }, sanitizedSuccessDuration);
    } catch (err) {
      clearPendingTimeout();
      setIsCopied(false);

      const errorMessage = err instanceof Error ? err.message : 'Failed to copy text';
      setError(errorMessage);
      onError?.(errorMessage);
    }
  }, [clipboard, textToCopy, onCopy, haptics, onError, sanitizedSuccessDuration, afterCopy, clearPendingTimeout]);

  const handleCopy = useCallback(() => {
    void copyToClipboard();
  }, [copyToClipboard]);

  useEffect(() => {
    return () => {
      clearPendingTimeout();
    };
  }, [clearPendingTimeout]);

  return {
    isCopied,
    handleCopy,
    error,
  };
}
