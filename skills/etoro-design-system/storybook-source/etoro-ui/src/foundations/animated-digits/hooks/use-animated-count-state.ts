// ==============================================
// EtAnimatedCount local state hook
// ==============================================

import { useEffect, useRef } from 'react';

import { getContainerLayout } from '../animations';

interface UseAnimatedCountStateParams {
  disableAnimation: boolean;
  enterFromBlank: boolean;
  charCount: number;
}

export interface AnimatedCountState {
  /** True once mounted (in leading mode) so slots fade in/out only for length changes AFTER first render. */
  animateLengthChanges: boolean;
  /** Container layout animation, only paid for when the character count changes or in leading mode. */
  containerLayout: ReturnType<typeof getContainerLayout>;
}

/**
 * Owns the timing state that gates the length-change animations: the mount latch (so the initial render
 * paints the full value instantly) and the character-count tracker (so the container layout animation is
 * only registered when a digit/separator is actually added or removed).
 */
export function useAnimatedCountState({ disableAnimation, enterFromBlank, charCount }: UseAnimatedCountStateParams): AnimatedCountState {
  // Only fade slots in/out for length changes that happen AFTER the first render, so the initial mount
  // renders the full value instantly (no digit-by-digit fade) in every consumer. Length-change fades (and
  // the roll-from-blank entrance) are scoped to leading/typed-input mode.
  const hasMounted = useRef(false);
  useEffect(() => {
    hasMounted.current = true;
  }, []);
  const animateLengthChanges = hasMounted.current && !disableAnimation && enterFromBlank;

  const prevCharCountRef = useRef(charCount);
  const charCountChanged = prevCharCountRef.current !== charCount;
  useEffect(() => {
    prevCharCountRef.current = charCount;
  }, [charCount]);

  const containerLayout = getContainerLayout(disableAnimation, enterFromBlank, charCountChanged);

  return { animateLengthChanges, containerLayout };
}
