import { useCallback, useMemo, useState } from 'react';

import { triggerHaptic } from '../utils';

// ============================================================================
// Types
// ============================================================================

export interface UsePostStateProps {
  /** Maximum lines before showing "Show More" */
  maxLines: number;
  /** Whether haptic feedback is enabled */
  haptics: boolean;
}

export interface PostStateResult {
  /** Whether text content is expanded */
  isExpanded: boolean;
  /** Toggle text expansion */
  toggleExpanded: () => void;
  /** Whether text exceeds maxLines and should show "Show More" */
  shouldShowMore: boolean;
  /** Callback for measuring text layout */
  onTextLayout: (lineCount: number) => void;
}

// ============================================================================
// Hook
// ============================================================================

/**
 * State management hook for EtPost
 *
 * Manages internal component state like text expansion.
 * Uses useCallback for stable handler references.
 *
 * @param props - Configuration for state management
 * @returns State values and handlers
 */
export function usePostState({ maxLines, haptics }: UsePostStateProps): PostStateResult {
  // Text expansion state
  const [isExpanded, setIsExpanded] = useState(false);
  const [textLineCount, setTextLineCount] = useState(0);

  // Calculate if text should show "Show More" button
  const shouldShowMore = useMemo(() => textLineCount > maxLines, [textLineCount, maxLines]);

  // Handle text layout measurement
  const onTextLayout = useCallback((lineCount: number) => {
    setTextLineCount(lineCount);
  }, []);

  // Toggle expansion with haptic feedback
  const toggleExpanded = useCallback(() => {
    triggerHaptic(haptics);
    setIsExpanded((prev) => !prev);
  }, [haptics]);

  return {
    isExpanded,
    toggleExpanded,
    shouldShowMore,
    onTextLayout,
  };
}
