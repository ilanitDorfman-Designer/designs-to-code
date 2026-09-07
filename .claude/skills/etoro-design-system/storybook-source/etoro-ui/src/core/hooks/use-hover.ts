import { useCallback, useMemo, useState } from 'react';

export interface UseHoverResult {
  isHovered: boolean;
  /** Spread onto a `Pressable` (or any component accepting hover props). */
  hoverProps: {
    onHoverIn: () => void;
    onHoverOut: () => void;
  };
}

/**
 * Tracks pointer hover over a `Pressable` via its `onHoverIn`/`onHoverOut`
 * props. On web, react-native-web dispatches these from pointer events and
 * already filters out touch pointers upstream, so there is no sticky-hover on
 * touch. On native the events simply never fire (`Pressable` no-ops) — no
 * `Platform` branching needed.
 *
 * Handler and `hoverProps` identities are stable across renders (safe to pass
 * to memoized children).
 *
 * @example
 * const { isHovered, hoverProps } = useHover();
 * return <Pressable {...hoverProps}>{isHovered ? … : …}</Pressable>;
 */
export const useHover = (): UseHoverResult => {
  const [isHovered, setIsHovered] = useState(false);

  const onHoverIn = useCallback(() => setIsHovered(true), []);
  const onHoverOut = useCallback(() => setIsHovered(false), []);

  const hoverProps = useMemo(() => ({ onHoverIn, onHoverOut }), [onHoverIn, onHoverOut]);

  return { isHovered, hoverProps };
};
