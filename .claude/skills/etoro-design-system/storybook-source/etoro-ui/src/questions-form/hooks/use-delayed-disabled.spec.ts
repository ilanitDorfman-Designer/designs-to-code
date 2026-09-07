import { act, renderHook } from '@testing-library/react-native';

import { DEFAULT_DISABLED_DELAY_MS, useDelayedDisabled } from './use-delayed-disabled';

describe('useDelayedDisabled', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  describe('GIVEN the initial disabled value', () => {
    it('WHEN mounted disabled, THEN it returns disabled immediately', () => {
      const { result } = renderHook(() => useDelayedDisabled(true));

      expect(result.current).toBe(true);
    });

    it('WHEN mounted enabled, THEN it returns enabled immediately', () => {
      const { result } = renderHook(() => useDelayedDisabled(false));

      expect(result.current).toBe(false);
    });
  });

  describe('GIVEN an enabled button transitioning to disabled', () => {
    it('WHEN the delay has not elapsed, THEN it stays enabled', () => {
      const { result, rerender } = renderHook(({ disabled }) => useDelayedDisabled(disabled), {
        initialProps: { disabled: false },
      });

      rerender({ disabled: true });

      act(() => {
        jest.advanceTimersByTime(DEFAULT_DISABLED_DELAY_MS - 1);
      });

      expect(result.current).toBe(false);
    });

    it('WHEN the delay elapses, THEN it becomes disabled', () => {
      const { result, rerender } = renderHook(({ disabled }) => useDelayedDisabled(disabled), {
        initialProps: { disabled: false },
      });

      rerender({ disabled: true });

      act(() => {
        jest.advanceTimersByTime(DEFAULT_DISABLED_DELAY_MS);
      });

      expect(result.current).toBe(true);
    });

    it('WHEN it becomes valid again before the delay elapses, THEN it never flickers disabled', () => {
      const { result, rerender } = renderHook(({ disabled }) => useDelayedDisabled(disabled), {
        initialProps: { disabled: false },
      });

      rerender({ disabled: true });
      rerender({ disabled: false });

      act(() => {
        jest.advanceTimersByTime(DEFAULT_DISABLED_DELAY_MS);
      });

      expect(result.current).toBe(false);
    });
  });

  describe('GIVEN a disabled button transitioning to enabled', () => {
    it('WHEN it becomes enabled, THEN it reflects enabled without delay', () => {
      const { result, rerender } = renderHook(({ disabled }) => useDelayedDisabled(disabled), {
        initialProps: { disabled: true },
      });

      rerender({ disabled: false });

      expect(result.current).toBe(false);
    });
  });
});
