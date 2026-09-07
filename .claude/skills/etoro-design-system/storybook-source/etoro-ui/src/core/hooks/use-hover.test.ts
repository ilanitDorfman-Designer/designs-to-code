import { describe, expect, it } from '@jest/globals';
import { act, renderHook } from '@testing-library/react-native';

import { useHover } from './use-hover';

describe('useHover', () => {
  it('GIVEN a fresh hook, WHEN rendered, THEN isHovered is false', () => {
    const { result } = renderHook(() => useHover());

    expect(result.current.isHovered).toBe(false);
  });

  it('GIVEN a mounted hook, WHEN hover enters and leaves, THEN isHovered tracks the pointer', () => {
    const { result } = renderHook(() => useHover());

    act(() => {
      result.current.hoverProps.onHoverIn();
    });
    expect(result.current.isHovered).toBe(true);

    act(() => {
      result.current.hoverProps.onHoverOut();
    });
    expect(result.current.isHovered).toBe(false);
  });

  it('GIVEN re-renders, WHEN compared across renders, THEN handler and hoverProps identities are stable', () => {
    const { result, rerender } = renderHook(() => useHover());
    const firstHoverProps = result.current.hoverProps;

    rerender(undefined);
    act(() => {
      result.current.hoverProps.onHoverIn();
    });

    expect(result.current.hoverProps).toBe(firstHoverProps);
    expect(result.current.hoverProps.onHoverIn).toBe(firstHoverProps.onHoverIn);
    expect(result.current.hoverProps.onHoverOut).toBe(firstHoverProps.onHoverOut);
  });
});
