import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { act, renderHook } from '@testing-library/react-native';
import { Dimensions } from 'react-native';

import { useBreakpointTier } from './use-breakpoint-tier';

const TIERS = [1024, 1366, 1720] as const;

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
  jest.restoreAllMocks();
  act(() => {
    Dimensions.set(ORIGINAL_DIMENSIONS);
  });
});

describe('useBreakpointTier', () => {
  it('GIVEN a width below the first threshold, WHEN rendered, THEN returns -1', () => {
    setWindowWidth(800);

    const { result } = renderHook(() => useBreakpointTier(TIERS));

    expect(result.current).toBe(-1);
  });

  it.each([
    [1024, 0],
    [1366, 1],
    [1720, 2],
  ])('GIVEN width exactly at boundary %i, WHEN rendered, THEN returns tier %i', (width, tier) => {
    setWindowWidth(width);

    const { result } = renderHook(() => useBreakpointTier(TIERS));

    expect(result.current).toBe(tier);
  });

  it.each([
    [1023, -1],
    [1200, 0],
    [1500, 1],
    [2400, 2],
  ])('GIVEN mid-tier width %i, WHEN rendered, THEN returns tier %i', (width, tier) => {
    setWindowWidth(width);

    const { result } = renderHook(() => useBreakpointTier(TIERS));

    expect(result.current).toBe(tier);
  });

  it('GIVEN a mounted hook, WHEN the window resizes across tier boundaries, THEN the tier updates reactively', () => {
    setWindowWidth(800);
    const { result } = renderHook(() => useBreakpointTier(TIERS));
    expect(result.current).toBe(-1);

    setWindowWidth(1100);
    expect(result.current).toBe(0);

    setWindowWidth(1800);
    expect(result.current).toBe(2);

    setWindowWidth(1400);
    expect(result.current).toBe(1);

    setWindowWidth(900);
    expect(result.current).toBe(-1);
  });

  it('GIVEN a mounted hook, WHEN the window resizes within the same tier, THEN the component does not re-render', () => {
    setWindowWidth(1100);
    let renders = 0;
    renderHook(() => {
      renders += 1;
      return useBreakpointTier(TIERS);
    });
    const rendersAfterMount = renders;

    setWindowWidth(1200);
    setWindowWidth(1300);

    expect(renders).toBe(rendersAfterMount);
  });

  it('GIVEN a mounted hook, WHEN unmounted, THEN the dimensions listener is removed', () => {
    const remove = jest.fn();
    jest.spyOn(Dimensions, 'addEventListener').mockReturnValue({ remove } as never);

    const { unmount } = renderHook(() => useBreakpointTier(TIERS));
    expect(remove).not.toHaveBeenCalled();

    unmount();

    expect(remove).toHaveBeenCalledTimes(1);
  });
});
