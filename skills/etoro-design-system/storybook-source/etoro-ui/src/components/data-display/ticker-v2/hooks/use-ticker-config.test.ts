import { renderHook } from '@testing-library/react-native';

import type { TickerItem } from '../api';
import { useTickerConfig } from './use-ticker-config';

// Mock useEtoroTheme (used by useTickerConfig)
jest.mock('../../../../core/hooks', () => ({
  useEtoroTheme: () => ({
    colors: {
      textSecondaryNeutral: '#666666',
      statusPositive: '#00CC44',
      statusNegative: '#FF3366',
    },
  }),
}));

const mockItems: TickerItem[] = [
  {
    instrumentId: 1,
    name: 'AAPL',
    currentPrice: 150.25,
    dailyChange: 2.5,
    navigationUrl: '/instruments/1',
  },
  {
    instrumentId: 2,
    name: 'TSLA',
    currentPrice: 800.5,
    dailyChange: -1.2,
    navigationUrl: '/instruments/2',
  },
];

describe('useTickerConfig', () => {
  describe('Default values', () => {
    it('should return default speed of 0.25', () => {
      const { result } = renderHook(() => useTickerConfig({ items: mockItems }));

      expect(result.current.speed).toBe(0.25);
    });

    it('should return default gradient value of true', () => {
      const { result } = renderHook(() => useTickerConfig({ items: mockItems }));

      expect(result.current.gradient).toBe(true);
    });

    it('should have undefined onItemPress by default', () => {
      const { result } = renderHook(() => useTickerConfig({ items: mockItems }));

      expect(result.current.contextValue.onItemPress).toBeUndefined();
    });
  });

  describe('Custom values', () => {
    it('should accept custom speed', () => {
      const { result } = renderHook(() => useTickerConfig({ items: mockItems, speed: 1.5 }));

      expect(result.current.speed).toBe(1.5);
    });

    it('should accept custom gradient value', () => {
      const { result } = renderHook(() => useTickerConfig({ items: mockItems, gradient: false }));

      expect(result.current.gradient).toBe(false);
    });

    it('should accept custom onItemPress callback', () => {
      const onItemPress = jest.fn();
      const { result } = renderHook(() => useTickerConfig({ items: mockItems, onItemPress }));

      expect(result.current.contextValue.onItemPress).toBe(onItemPress);
    });
  });

  describe('Context value', () => {
    it('should provide textColor from theme', () => {
      const { result } = renderHook(() => useTickerConfig({ items: mockItems }));

      expect(result.current.contextValue.textColor).toBe('#666666');
    });

    it('should provide positiveColor from theme', () => {
      const { result } = renderHook(() => useTickerConfig({ items: mockItems }));

      expect(result.current.contextValue.positiveColor).toBe('#00CC44');
    });

    it('should provide negativeColor from theme', () => {
      const { result } = renderHook(() => useTickerConfig({ items: mockItems }));

      expect(result.current.contextValue.negativeColor).toBe('#FF3366');
    });

    it('should include speed in context value', () => {
      const { result } = renderHook(() => useTickerConfig({ items: mockItems, speed: 0.75 }));

      expect(result.current.contextValue.speed).toBe(0.75);
    });

    it('should include default speed in context value', () => {
      const { result } = renderHook(() => useTickerConfig({ items: mockItems }));

      expect(result.current.contextValue.speed).toBe(0.25);
    });

    it('should include onItemPress in context value', () => {
      const onItemPress = jest.fn();
      const { result } = renderHook(() => useTickerConfig({ items: mockItems, onItemPress }));

      expect(result.current.contextValue.onItemPress).toBe(onItemPress);
    });
  });

  describe('Accessibility label generation', () => {
    it('should generate label for multiple items', () => {
      const { result } = renderHook(() => useTickerConfig({ items: mockItems }));

      expect(result.current.defaultAccessibilityLabel).toBe('Financial ticker displaying 2 stocks with prices and changes');
    });

    it('should generate singular label for single item', () => {
      const { result } = renderHook(() => useTickerConfig({ items: [mockItems[0]] }));

      expect(result.current.defaultAccessibilityLabel).toBe('Financial ticker displaying 1 stock with prices and changes');
    });

    it('should generate fallback label when no items', () => {
      const { result } = renderHook(() => useTickerConfig({ items: [] }));

      expect(result.current.defaultAccessibilityLabel).toBe('Financial ticker displaying stock prices and changes');
    });

    it('should generate fallback label when items is undefined', () => {
      const { result } = renderHook(() => useTickerConfig({}));

      expect(result.current.defaultAccessibilityLabel).toBe('Financial ticker displaying stock prices and changes');
    });
  });

  describe('Return shape', () => {
    it('should return all required properties', () => {
      const { result } = renderHook(() => useTickerConfig({ items: mockItems }));

      expect(result.current).toHaveProperty('contextValue');
      expect(result.current).toHaveProperty('speed');
      expect(result.current).toHaveProperty('gradient');
      expect(result.current).toHaveProperty('defaultAccessibilityLabel');
    });

    it('should return consistent context values across rerenders', () => {
      const { result, rerender } = renderHook((props) => useTickerConfig(props), { initialProps: { items: mockItems } });

      const firstContextValue = result.current.contextValue;
      rerender({ items: mockItems });

      expect(result.current.contextValue).toEqual(firstContextValue);
    });
  });

  describe('Edge cases', () => {
    it('should handle zero items', () => {
      const { result } = renderHook(() => useTickerConfig({ items: [] }));

      expect(result.current.defaultAccessibilityLabel).toBe('Financial ticker displaying stock prices and changes');
    });

    it('should handle speed of 0', () => {
      const { result } = renderHook(() => useTickerConfig({ items: mockItems, speed: 0 }));

      expect(result.current.speed).toBe(0);
    });

    it('should handle very high speed', () => {
      const { result } = renderHook(() => useTickerConfig({ items: mockItems, speed: 10 }));

      expect(result.current.speed).toBe(10);
    });

    it('should sanitize NaN speed to default', () => {
      const { result } = renderHook(() => useTickerConfig({ items: mockItems, speed: NaN }));

      expect(result.current.speed).toBe(0.25);
      expect(Number.isFinite(result.current.speed)).toBe(true);
    });

    it('should sanitize Infinity speed to default', () => {
      const { result } = renderHook(() => useTickerConfig({ items: mockItems, speed: Infinity }));

      expect(result.current.speed).toBe(0.25);
      expect(Number.isFinite(result.current.speed)).toBe(true);
    });

    it('should sanitize negative speed to default', () => {
      const { result } = renderHook(() => useTickerConfig({ items: mockItems, speed: -1 }));

      expect(result.current.speed).toBe(0.25);
      expect(result.current.speed).toBeGreaterThanOrEqual(0);
    });
  });
});
