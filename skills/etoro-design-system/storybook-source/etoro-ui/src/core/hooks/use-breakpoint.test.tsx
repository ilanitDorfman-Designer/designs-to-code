import { afterEach, describe, expect, it } from '@jest/globals';
import { act, renderHook } from '@testing-library/react-native';
import { Dimensions } from 'react-native';

import { useBreakpoint } from './use-breakpoint';

const THRESHOLD = 1024;
const ABOVE = 1280;
const BELOW = 375;

const ORIGINAL_DIMENSIONS = {
  window: Dimensions.get('window'),
  screen: Dimensions.get('screen'),
};

function setWindowWidth(width: number) {
  act(() => {
    Dimensions.set({ window: { width, height: 800, scale: 2, fontScale: 1 } });
  });
}

afterEach(() => {
  act(() => {
    Dimensions.set(ORIGINAL_DIMENSIONS);
  });
});

describe('useBreakpoint', () => {
  it('GIVEN width above the threshold, WHEN rendered, THEN returns true', () => {
    setWindowWidth(ABOVE);

    const { result } = renderHook(() => useBreakpoint(THRESHOLD));

    expect(result.current).toBe(true);
  });

  it('GIVEN width exactly at the threshold, WHEN rendered, THEN returns true', () => {
    setWindowWidth(THRESHOLD);

    const { result } = renderHook(() => useBreakpoint(THRESHOLD));

    expect(result.current).toBe(true);
  });

  it('GIVEN width one pixel below the threshold, WHEN rendered, THEN returns false', () => {
    setWindowWidth(THRESHOLD - 1);

    const { result } = renderHook(() => useBreakpoint(THRESHOLD));

    expect(result.current).toBe(false);
  });

  it('GIVEN a mounted hook, WHEN the window resizes across the threshold, THEN the value updates reactively', () => {
    setWindowWidth(BELOW);
    const { result } = renderHook(() => useBreakpoint(THRESHOLD));
    expect(result.current).toBe(false);

    setWindowWidth(ABOVE);
    expect(result.current).toBe(true);

    setWindowWidth(BELOW);
    expect(result.current).toBe(false);
  });

  it('GIVEN a mounted hook, WHEN the window resizes without crossing the threshold, THEN the component does not re-render', () => {
    setWindowWidth(ABOVE);
    let renders = 0;
    renderHook(() => {
      renders += 1;
      return useBreakpoint(THRESHOLD);
    });
    const rendersAfterMount = renders;

    setWindowWidth(ABOVE + 100);
    setWindowWidth(ABOVE + 200);

    expect(renders).toBe(rendersAfterMount);
  });

  it('GIVEN a mounted hook, WHEN the threshold prop changes, THEN the value reflects the new threshold', () => {
    setWindowWidth(900);
    const { result, rerender } = renderHook(({ minWidth }) => useBreakpoint(minWidth), {
      initialProps: { minWidth: THRESHOLD },
    });
    expect(result.current).toBe(false);

    rerender({ minWidth: 768 });

    expect(result.current).toBe(true);
  });

  it('GIVEN an unmounted hook, WHEN the window resizes, THEN no update is attempted', () => {
    setWindowWidth(BELOW);
    const { result, unmount } = renderHook(() => useBreakpoint(THRESHOLD));
    unmount();

    setWindowWidth(ABOVE);

    expect(result.current).toBe(false);
  });
});
