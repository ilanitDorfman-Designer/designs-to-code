import { useCallback, useEffect, useRef, useState } from 'react';
import { NativeSyntheticEvent, TextLayoutEventData, TextLayoutLine } from 'react-native';

import { ELLIPSIS_SUFFIX, TRIM_CHARS } from '../constants';

export interface ReadMoreTextState {
  /** Whether text content is expanded */
  isExpanded: boolean;
  /** Toggle text expansion */
  toggleExpanded: () => void;
  /** Whether text exceeds maxLines and needs truncation */
  needsTruncation: boolean;
  /** The truncated text to display when collapsed (null until measured) */
  truncatedText: string | null;
  /** Whether text has been measured */
  hasMeasured: boolean;
  /** Callback for hidden text layout measurement */
  onHiddenTextLayout: (event: NativeSyntheticEvent<TextLayoutEventData>) => void;
}

/**
 * State management hook for EtReadMoreText.
 *
 * Measures text layout to determine truncation needs,
 * calculates the inline-truncated text, and manages expand/collapse state.
 */
export function useReadMoreTextState({
  text,
  maxLines,
  showMoreText,
  initialExpanded = false,
  onExpandedChange,
  onTruncationChange,
}: {
  text: string;
  maxLines: number;
  showMoreText: string;
  initialExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  onTruncationChange?: (needsTruncation: boolean) => void;
}): ReadMoreTextState {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const [needsTruncation, setNeedsTruncation] = useState(false);
  const [truncatedText, setTruncatedText] = useState<string | null>(null);
  const [hasMeasured, setHasMeasured] = useState(false);
  const hasMeasuredRef = useRef(false);
  const isInitialMountRef = useRef(true);
  const isExpandedRef = useRef(initialExpanded);

  // Re-measure when content or measurement-affecting props change.
  // Intentionally does NOT reset `isExpanded`: when the same logical item
  // updates its text in place (e.g. translation toggle), we want to recompute
  // truncation against the new string while preserving the user's
  // expand/collapse choice. Fresh mounts (e.g. list virtualization with stable
  // keys) start from `initialExpanded` via useState's initializer, so we don't
  // need this effect to handle recycling.
  useEffect(() => {
    // Skip reset on initial mount if already measured — avoids a flicker/scroll jump.
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      if (hasMeasuredRef.current) return;
    }
    hasMeasuredRef.current = false;
    setHasMeasured(false);
    setNeedsTruncation(false);
    setTruncatedText(null);
    onTruncationChange?.(false);
  }, [maxLines, onTruncationChange, showMoreText, text]);

  // Apply explicit parent intent: when `initialExpanded` changes, mirror it.
  useEffect(() => {
    isExpandedRef.current = initialExpanded;
    setIsExpanded(initialExpanded);
  }, [initialExpanded]);

  const toggleExpanded = useCallback(() => {
    const next = !isExpandedRef.current;
    isExpandedRef.current = next;
    // Fire before setState so list consumers can snapshot layout on the press
    // stack, before React commits the collapsed height (PE-1150).
    onExpandedChange?.(next);
    setIsExpanded(next);
  }, [onExpandedChange]);

  const onHiddenTextLayout = useCallback(
    (event: NativeSyntheticEvent<TextLayoutEventData>) => {
      if (hasMeasuredRef.current) return;
      hasMeasuredRef.current = true;

      const lines: TextLayoutLine[] = event.nativeEvent.lines;

      if (!lines || lines.length === 0) {
        setNeedsTruncation(false);
        setTruncatedText(null);
        setHasMeasured(true);
        onTruncationChange?.(false);
        return;
      }

      // Guard against non-positive / invalid maxLines
      const safeMaxLines = Number.isFinite(maxLines) && maxLines > 0 ? maxLines : 0;

      if (safeMaxLines === 0) {
        setNeedsTruncation(false);
        setTruncatedText(null);
        setHasMeasured(true);
        onTruncationChange?.(false);
        return;
      }

      const totalLines = lines.length;

      if (totalLines <= safeMaxLines) {
        setNeedsTruncation(false);
        setTruncatedText(null);
        setHasMeasured(true);
        onTruncationChange?.(false);
        return;
      }

      // Text needs truncation - build inline truncated string
      const visibleLines = lines.slice(0, safeMaxLines);
      const lastLine = visibleLines[visibleLines.length - 1];

      if (!lastLine) {
        setNeedsTruncation(false);
        setTruncatedText(null);
        setHasMeasured(true);
        onTruncationChange?.(false);
        return;
      }

      const suffixLength = ELLIPSIS_SUFFIX.length + showMoreText.length;

      // Build text from all visible lines except the last
      let result = '';
      for (let i = 0; i < visibleLines.length - 1; i++) {
        result += visibleLines[i].text;
      }

      // Trim the last line to make room for "... Show More"
      const lastLineText = lastLine.text;
      const trimAmount = suffixLength + TRIM_CHARS;
      const trimmedLastLine = lastLineText.substring(0, Math.max(0, lastLineText.length - trimAmount));

      result += trimmedLastLine.trimEnd();

      setTruncatedText(result.trimEnd());
      setNeedsTruncation(true);
      setHasMeasured(true);
      onTruncationChange?.(true);
    },
    [maxLines, onTruncationChange, showMoreText],
  );

  return {
    isExpanded,
    toggleExpanded,
    needsTruncation,
    truncatedText,
    hasMeasured,
    onHiddenTextLayout,
  };
}
