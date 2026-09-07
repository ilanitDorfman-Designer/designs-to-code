import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, renderHook } from '@testing-library/react-native';

import { usePagination, UsePaginationOptions } from './use-pagination';

// Note: react-native-reanimated is mocked globally in jest.setup.ts

describe('usePagination', () => {
  const defaultOptions: UsePaginationOptions = {
    totalPages: 5,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Return Shape', () => {
    it('should return all expected properties', () => {
      const { result } = renderHook(() => usePagination(defaultOptions));

      // Current page state
      expect(result.current).toHaveProperty('currentPage');
      expect(result.current).toHaveProperty('currentPageAnimated');

      // Navigation functions
      expect(result.current).toHaveProperty('goToNext');
      expect(result.current).toHaveProperty('goToPrevious');
      expect(result.current).toHaveProperty('goToPage');

      // Computed state
      expect(result.current).toHaveProperty('isFirstPage');
      expect(result.current).toHaveProperty('isLastPage');
      expect(result.current).toHaveProperty('canGoNext');
      expect(result.current).toHaveProperty('canGoPrevious');

      // Scroll features
      expect(result.current).toHaveProperty('scrollHandler');
      expect(result.current).toHaveProperty('getScrollOffsetForPage');
    });

    it('should return navigation functions as functions', () => {
      const { result } = renderHook(() => usePagination(defaultOptions));

      expect(typeof result.current.goToNext).toBe('function');
      expect(typeof result.current.goToPrevious).toBe('function');
      expect(typeof result.current.goToPage).toBe('function');
      expect(typeof result.current.getScrollOffsetForPage).toBe('function');
    });

    it('should return currentPage as a number', () => {
      const { result } = renderHook(() => usePagination(defaultOptions));

      expect(typeof result.current.currentPage).toBe('number');
    });

    it('should return currentPageAnimated as a SharedValue', () => {
      const { result } = renderHook(() => usePagination(defaultOptions));

      expect(result.current.currentPageAnimated).toHaveProperty('value');
    });
  });

  describe('Initial State', () => {
    it('should start at page 0 by default', () => {
      const { result } = renderHook(() => usePagination({ totalPages: 5 }));

      expect(result.current.currentPage).toBe(0);
    });

    it('should respect initialPage option', () => {
      const { result } = renderHook(() => usePagination({ totalPages: 5, initialPage: 2 }));

      expect(result.current.currentPage).toBe(2);
    });

    it('should clamp initialPage to valid bounds (too high)', () => {
      const { result } = renderHook(() => usePagination({ totalPages: 5, initialPage: 10 }));

      expect(result.current.currentPage).toBe(4); // Last valid page
    });

    it('should clamp initialPage to valid bounds (negative)', () => {
      const { result } = renderHook(() => usePagination({ totalPages: 5, initialPage: -5 }));

      expect(result.current.currentPage).toBe(0);
    });

    it('should sync currentPageAnimated with currentPage on init', () => {
      const { result } = renderHook(() => usePagination({ totalPages: 5, initialPage: 3 }));

      expect(result.current.currentPageAnimated.value).toBe(3);
    });
  });

  describe('Computed State - isFirstPage / isLastPage', () => {
    it('should set isFirstPage=true when on first page', () => {
      const { result } = renderHook(() => usePagination({ totalPages: 5, initialPage: 0 }));

      expect(result.current.isFirstPage).toBe(true);
      expect(result.current.isLastPage).toBe(false);
    });

    it('should set isLastPage=true when on last page', () => {
      const { result } = renderHook(() => usePagination({ totalPages: 5, initialPage: 4 }));

      expect(result.current.isFirstPage).toBe(false);
      expect(result.current.isLastPage).toBe(true);
    });

    it('should set both false when on middle page', () => {
      const { result } = renderHook(() => usePagination({ totalPages: 5, initialPage: 2 }));

      expect(result.current.isFirstPage).toBe(false);
      expect(result.current.isLastPage).toBe(false);
    });

    it('should set both true when totalPages is 1', () => {
      const { result } = renderHook(() => usePagination({ totalPages: 1, initialPage: 0 }));

      expect(result.current.isFirstPage).toBe(true);
      expect(result.current.isLastPage).toBe(true);
    });
  });

  describe('Computed State - canGoNext / canGoPrevious', () => {
    it('should set canGoPrevious=false on first page', () => {
      const { result } = renderHook(() => usePagination({ totalPages: 5, initialPage: 0 }));

      expect(result.current.canGoPrevious).toBe(false);
      expect(result.current.canGoNext).toBe(true);
    });

    it('should set canGoNext=false on last page', () => {
      const { result } = renderHook(() => usePagination({ totalPages: 5, initialPage: 4 }));

      expect(result.current.canGoPrevious).toBe(true);
      expect(result.current.canGoNext).toBe(false);
    });

    it('should set both true on middle page', () => {
      const { result } = renderHook(() => usePagination({ totalPages: 5, initialPage: 2 }));

      expect(result.current.canGoPrevious).toBe(true);
      expect(result.current.canGoNext).toBe(true);
    });

    it('should set both false when totalPages is 1', () => {
      const { result } = renderHook(() => usePagination({ totalPages: 1, initialPage: 0 }));

      expect(result.current.canGoPrevious).toBe(false);
      expect(result.current.canGoNext).toBe(false);
    });
  });

  describe('Navigation - goToNext', () => {
    it('should increment currentPage by 1', () => {
      const { result } = renderHook(() => usePagination({ totalPages: 5, initialPage: 0 }));

      act(() => {
        result.current.goToNext();
      });

      expect(result.current.currentPage).toBe(1);
    });

    it('should not exceed totalPages - 1', () => {
      const { result } = renderHook(() => usePagination({ totalPages: 5, initialPage: 4 }));

      act(() => {
        result.current.goToNext();
      });

      expect(result.current.currentPage).toBe(4); // Still on last page
    });

    it('should update computed state after navigation', () => {
      const { result } = renderHook(() => usePagination({ totalPages: 3, initialPage: 0 }));

      expect(result.current.isFirstPage).toBe(true);

      act(() => {
        result.current.goToNext();
      });

      expect(result.current.isFirstPage).toBe(false);
      expect(result.current.currentPage).toBe(1);
    });

    it('should sync SharedValue after navigation', () => {
      const { result } = renderHook(() => usePagination({ totalPages: 5, initialPage: 0 }));

      act(() => {
        result.current.goToNext();
      });

      expect(result.current.currentPageAnimated.value).toBe(1);
    });
  });

  describe('Navigation - goToPrevious', () => {
    it('should decrement currentPage by 1', () => {
      const { result } = renderHook(() => usePagination({ totalPages: 5, initialPage: 3 }));

      act(() => {
        result.current.goToPrevious();
      });

      expect(result.current.currentPage).toBe(2);
    });

    it('should not go below 0', () => {
      const { result } = renderHook(() => usePagination({ totalPages: 5, initialPage: 0 }));

      act(() => {
        result.current.goToPrevious();
      });

      expect(result.current.currentPage).toBe(0); // Still on first page
    });

    it('should update computed state after navigation', () => {
      const { result } = renderHook(() => usePagination({ totalPages: 3, initialPage: 2 }));

      expect(result.current.isLastPage).toBe(true);

      act(() => {
        result.current.goToPrevious();
      });

      expect(result.current.isLastPage).toBe(false);
      expect(result.current.currentPage).toBe(1);
    });

    it('should sync SharedValue after navigation', () => {
      const { result } = renderHook(() => usePagination({ totalPages: 5, initialPage: 3 }));

      act(() => {
        result.current.goToPrevious();
      });

      expect(result.current.currentPageAnimated.value).toBe(2);
    });
  });

  describe('Navigation - goToPage', () => {
    it('should navigate to specific page', () => {
      const { result } = renderHook(() => usePagination({ totalPages: 5, initialPage: 0 }));

      act(() => {
        result.current.goToPage(3);
      });

      expect(result.current.currentPage).toBe(3);
    });

    it('should clamp page to upper bound', () => {
      const { result } = renderHook(() => usePagination({ totalPages: 5, initialPage: 0 }));

      act(() => {
        result.current.goToPage(100);
      });

      expect(result.current.currentPage).toBe(4);
    });

    it('should clamp page to lower bound', () => {
      const { result } = renderHook(() => usePagination({ totalPages: 5, initialPage: 3 }));

      act(() => {
        result.current.goToPage(-5);
      });

      expect(result.current.currentPage).toBe(0);
    });

    it('should update computed state after navigation', () => {
      const { result } = renderHook(() => usePagination({ totalPages: 5, initialPage: 2 }));

      act(() => {
        result.current.goToPage(4);
      });

      expect(result.current.isLastPage).toBe(true);
      expect(result.current.canGoNext).toBe(false);
    });

    it('should sync SharedValue after navigation', () => {
      const { result } = renderHook(() => usePagination({ totalPages: 5, initialPage: 0 }));

      act(() => {
        result.current.goToPage(3);
      });

      expect(result.current.currentPageAnimated.value).toBe(3);
    });
  });

  describe('Scroll Features - getScrollOffsetForPage', () => {
    it('should return 0 when itemWidth is not provided', () => {
      const { result } = renderHook(() => usePagination({ totalPages: 5 }));

      expect(result.current.getScrollOffsetForPage(3)).toBe(0);
    });

    it('should calculate correct offset when itemWidth is provided', () => {
      const { result } = renderHook(() => usePagination({ totalPages: 5, itemWidth: 100 }));

      expect(result.current.getScrollOffsetForPage(0)).toBe(0);
      expect(result.current.getScrollOffsetForPage(1)).toBe(100);
      expect(result.current.getScrollOffsetForPage(2)).toBe(200);
      expect(result.current.getScrollOffsetForPage(3)).toBe(300);
    });

    it('should work with non-integer itemWidth', () => {
      const { result } = renderHook(() => usePagination({ totalPages: 5, itemWidth: 150.5 }));

      expect(result.current.getScrollOffsetForPage(2)).toBe(301);
    });
  });

  describe('Scroll Features - scrollHandler', () => {
    it('should return a scroll handler function/object', () => {
      const { result } = renderHook(() => usePagination({ totalPages: 5, itemWidth: 100 }));

      // The scroll handler is created by useAnimatedScrollHandler
      // In tests, it will be mocked but should still be defined
      expect(result.current.scrollHandler).toBeDefined();
    });
  });

  describe('Multiple Navigation Actions', () => {
    it('should handle sequential goToNext calls', () => {
      const { result } = renderHook(() => usePagination({ totalPages: 5, initialPage: 0 }));

      act(() => {
        result.current.goToNext();
        result.current.goToNext();
        result.current.goToNext();
      });

      expect(result.current.currentPage).toBe(3);
    });

    it('should handle mixed navigation calls', () => {
      const { result } = renderHook(() => usePagination({ totalPages: 5, initialPage: 2 }));

      act(() => {
        result.current.goToNext();
      });
      expect(result.current.currentPage).toBe(3);

      act(() => {
        result.current.goToPrevious();
      });
      expect(result.current.currentPage).toBe(2);

      act(() => {
        result.current.goToPage(0);
      });
      expect(result.current.currentPage).toBe(0);
    });

    it('should handle rapid successive calls', () => {
      const { result } = renderHook(() => usePagination({ totalPages: 10, initialPage: 5 }));

      act(() => {
        for (let i = 0; i < 20; i++) {
          result.current.goToNext();
        }
      });

      expect(result.current.currentPage).toBe(9); // Clamped to last page
    });
  });

  describe('Rerender Behavior', () => {
    it('should maintain state across rerenders', () => {
      const { result, rerender } = renderHook((options: UsePaginationOptions) => usePagination(options), {
        initialProps: { totalPages: 5, initialPage: 2 },
      });

      act(() => {
        result.current.goToNext();
      });

      expect(result.current.currentPage).toBe(3);

      // Rerender with same options
      rerender({ totalPages: 5, initialPage: 2 });

      // State should be preserved
      expect(result.current.currentPage).toBe(3);
    });

    it('should update navigation functions when totalPages changes', () => {
      const { result, rerender } = renderHook((options: UsePaginationOptions) => usePagination(options), {
        initialProps: { totalPages: 5, initialPage: 3 },
      });

      expect(result.current.isLastPage).toBe(false);

      // Reduce total pages so current page becomes last
      rerender({ totalPages: 4, initialPage: 3 });

      expect(result.current.isLastPage).toBe(true);
    });

    it('should clamp currentPage when totalPages shrinks below current position', () => {
      const { result, rerender } = renderHook((options: UsePaginationOptions) => usePagination(options), {
        initialProps: { totalPages: 10, initialPage: 8 },
      });

      expect(result.current.currentPage).toBe(8);

      // Shrink totalPages below current position
      rerender({ totalPages: 5, initialPage: 8 });

      // currentPage should be clamped to last valid page (4)
      expect(result.current.currentPage).toBe(4);
      expect(result.current.isLastPage).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle totalPages of 1', () => {
      const { result } = renderHook(() => usePagination({ totalPages: 1 }));

      expect(result.current.currentPage).toBe(0);
      expect(result.current.isFirstPage).toBe(true);
      expect(result.current.isLastPage).toBe(true);
      expect(result.current.canGoNext).toBe(false);
      expect(result.current.canGoPrevious).toBe(false);

      // Navigation should have no effect
      act(() => {
        result.current.goToNext();
      });
      expect(result.current.currentPage).toBe(0);

      act(() => {
        result.current.goToPrevious();
      });
      expect(result.current.currentPage).toBe(0);
    });

    it('should handle large number of pages', () => {
      const { result } = renderHook(() => usePagination({ totalPages: 1000, initialPage: 500 }));

      expect(result.current.currentPage).toBe(500);

      act(() => {
        result.current.goToPage(999);
      });

      expect(result.current.currentPage).toBe(999);
      expect(result.current.isLastPage).toBe(true);
    });

    it('should handle goToPage with same page', () => {
      const { result } = renderHook(() => usePagination({ totalPages: 5, initialPage: 2 }));

      act(() => {
        result.current.goToPage(2);
      });

      expect(result.current.currentPage).toBe(2);
    });

    it('should handle totalPages of 0', () => {
      const { result } = renderHook(() => usePagination({ totalPages: 0 }));

      expect(result.current.currentPage).toBe(0);
      expect(result.current.isFirstPage).toBe(true);
      expect(result.current.isLastPage).toBe(true);
      expect(result.current.canGoNext).toBe(false);
      expect(result.current.canGoPrevious).toBe(false);

      // Navigation should have no effect
      act(() => {
        result.current.goToNext();
      });
      expect(result.current.currentPage).toBe(0);
    });
  });

  describe('Function Stability', () => {
    it('should return stable function references', () => {
      const { result, rerender } = renderHook((options: UsePaginationOptions) => usePagination(options), { initialProps: { totalPages: 5 } });

      const firstGoToNext = result.current.goToNext;
      const firstGoToPrevious = result.current.goToPrevious;
      const firstGoToPage = result.current.goToPage;

      rerender({ totalPages: 5 });

      // Functions should be stable (same reference) when totalPages doesn't change
      expect(result.current.goToNext).toBe(firstGoToNext);
      expect(result.current.goToPrevious).toBe(firstGoToPrevious);
      expect(result.current.goToPage).toBe(firstGoToPage);
    });

    it('should update function references when totalPages changes', () => {
      const { result, rerender } = renderHook((options: UsePaginationOptions) => usePagination(options), { initialProps: { totalPages: 5 } });

      const firstGoToNext = result.current.goToNext;

      rerender({ totalPages: 10 });

      // Functions should be updated when dependencies change
      expect(result.current.goToNext).not.toBe(firstGoToNext);
    });
  });
});
