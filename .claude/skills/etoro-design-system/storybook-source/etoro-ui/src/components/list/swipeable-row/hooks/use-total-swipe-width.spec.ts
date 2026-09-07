import { renderHook } from '@testing-library/react-native';

import { useTotalSwipeWidth } from './use-total-swipe-width';

const DEFAULT_BUTTON_WIDTH = 70;

describe('useTotalSwipeWidth', () => {
  describe('totalSwipeWidth', () => {
    it('returns 0 for an empty array', () => {
      const { result } = renderHook(() => useTotalSwipeWidth([]));
      expect(result.current.totalSwipeWidth).toBe(0);
    });

    it('sums all explicit valid widths', () => {
      const { result } = renderHook(() => useTotalSwipeWidth([{ width: 80 }, { width: 60 }]));
      expect(result.current.totalSwipeWidth).toBe(140);
    });

    it('falls back to DEFAULT_BUTTON_WIDTH when width is undefined', () => {
      const { result } = renderHook(() => useTotalSwipeWidth([{}, {}]));
      expect(result.current.totalSwipeWidth).toBe(DEFAULT_BUTTON_WIDTH * 2);
    });

    it('falls back to DEFAULT_BUTTON_WIDTH when width is 0', () => {
      const { result } = renderHook(() => useTotalSwipeWidth([{ width: 0 }]));
      expect(result.current.totalSwipeWidth).toBe(DEFAULT_BUTTON_WIDTH);
    });

    it('falls back to DEFAULT_BUTTON_WIDTH when width is negative', () => {
      const { result } = renderHook(() => useTotalSwipeWidth([{ width: -10 }]));
      expect(result.current.totalSwipeWidth).toBe(DEFAULT_BUTTON_WIDTH);
    });

    it('falls back to DEFAULT_BUTTON_WIDTH when width is Infinity', () => {
      const { result } = renderHook(() => useTotalSwipeWidth([{ width: Infinity }]));
      expect(result.current.totalSwipeWidth).toBe(DEFAULT_BUTTON_WIDTH);
    });

    it('falls back to DEFAULT_BUTTON_WIDTH when width is NaN', () => {
      const { result } = renderHook(() => useTotalSwipeWidth([{ width: NaN }]));
      expect(result.current.totalSwipeWidth).toBe(DEFAULT_BUTTON_WIDTH);
    });

    it('handles mixed valid and invalid widths correctly', () => {
      const { result } = renderHook(() => useTotalSwipeWidth([{ width: 100 }, {}, { width: -5 }]));
      // 100 (valid) + 70 (undefined fallback) + 70 (negative fallback) = 240
      expect(result.current.totalSwipeWidth).toBe(240);
    });
  });
});
