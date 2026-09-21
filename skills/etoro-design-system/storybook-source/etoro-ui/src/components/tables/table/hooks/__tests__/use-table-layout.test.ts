import { renderHook } from '@testing-library/react-native';
import { Dimensions, LayoutChangeEvent } from 'react-native';

import { useTableLayout } from '../use-table-layout';

// Mock Dimensions
jest.mock('react-native', () => ({
  Dimensions: {
    get: jest.fn(),
  },
}));

const mockDimensions = Dimensions as jest.Mocked<typeof Dimensions>;

describe('useTableLayout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDimensions.get.mockReturnValue({
      width: 400,
      height: 800,
      scale: 1,
      fontScale: 1,
    });
  });

  describe('handleLayout', () => {
    it('should call onLayoutChange when width difference exceeds threshold', () => {
      const onLayoutChange = jest.fn();
      const threshold = 10;

      const { result } = renderHook(() => useTableLayout({ onLayoutChange, threshold }));

      const layoutEvent = {
        nativeEvent: {
          layout: {
            width: 450, // 50px difference > 10px threshold
            height: 600,
            x: 0,
            y: 0,
          },
        },
      } as LayoutChangeEvent;

      result.current.handleLayout(layoutEvent);

      expect(onLayoutChange).toHaveBeenCalledWith(450);
    });

    it('should not call onLayoutChange when width difference is within threshold', () => {
      const onLayoutChange = jest.fn();
      const threshold = 10;

      const { result } = renderHook(() => useTableLayout({ onLayoutChange, threshold }));

      const layoutEvent = {
        nativeEvent: {
          layout: {
            width: 405, // 5px difference < 10px threshold
            height: 600,
            x: 0,
            y: 0,
          },
        },
      } as LayoutChangeEvent;

      result.current.handleLayout(layoutEvent);

      expect(onLayoutChange).not.toHaveBeenCalled();
    });

    it('should not call onLayoutChange when onLayoutChange is not provided', () => {
      const { result } = renderHook(() => useTableLayout({}));

      const layoutEvent = {
        nativeEvent: {
          layout: {
            width: 450,
            height: 600,
            x: 0,
            y: 0,
          },
        },
      } as LayoutChangeEvent;

      expect(() => {
        result.current.handleLayout(layoutEvent);
      }).not.toThrow();
    });

    it('should use default threshold of 10 when not provided', () => {
      const onLayoutChange = jest.fn();

      const { result } = renderHook(() => useTableLayout({ onLayoutChange }));

      // Test with difference above threshold
      const layoutEvent = {
        nativeEvent: {
          layout: {
            width: 411, // 11px difference > threshold
            height: 600,
            x: 0,
            y: 0,
          },
        },
      } as LayoutChangeEvent;

      result.current.handleLayout(layoutEvent);
      expect(onLayoutChange).toHaveBeenCalledWith(411);
    });

    it('should handle negative width differences', () => {
      const onLayoutChange = jest.fn();
      const threshold = 10;

      const { result } = renderHook(() => useTableLayout({ onLayoutChange, threshold }));

      const layoutEvent = {
        nativeEvent: {
          layout: {
            width: 350, // -50px difference, abs(50) > 10px threshold
            height: 600,
            x: 0,
            y: 0,
          },
        },
      } as LayoutChangeEvent;

      result.current.handleLayout(layoutEvent);

      expect(onLayoutChange).toHaveBeenCalledWith(350);
    });
  });
});
