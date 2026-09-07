import { renderHook } from '@testing-library/react-native';
import { ReactNode } from 'react';
import { SharedValue } from 'react-native-reanimated';

import { ChartDataApiEquity, ChartSharedValues, LineChartProvider, useLineChartContext } from '../api';
import { useAnimateGraph } from './use-animate-graph';

/**
 * Mock SharedValue type for testing.
 * Mimics Reanimated's SharedValue interface with a jest mock for `set`.
 */
interface MockSharedValue<T> {
  value: T;
  set: jest.Mock<void, [T]>;
}

/**
 * Creates a mock SharedValue for testing purposes.
 * The mock captures calls to `set` and updates `.value` accordingly.
 */
function createMockSharedValue<T>(initial: T): MockSharedValue<T> {
  const mock: MockSharedValue<T> = {
    value: initial,
    set: jest.fn(function (this: MockSharedValue<T>, v: T) {
      this.value = v;
    }),
  };
  // Bind set to maintain correct `this` context
  mock.set = mock.set.bind(mock);
  return mock;
}

describe('useAnimateGraph', () => {
  const mockSelectedValue = createMockSharedValue<number>(0);
  const defaultData: ChartDataApiEquity[] = [
    { timestamp: '2023-01-01T10:00:00Z', equity: 100 },
    { timestamp: '2023-01-01T11:00:00Z', equity: 105 },
    { timestamp: '2023-01-01T12:00:00Z', equity: 98 },
  ];
  const getAnimationKey = (data: ChartDataApiEquity[]) => `${data.length}:${data[0]?.timestamp ?? ''}:${data[data.length - 1]?.timestamp ?? ''}`;

  // Wrapper that provides the LineChartContext
  const createWrapper = () => {
    return ({ children }: { children: ReactNode }) => {
      return (
        <LineChartProvider width={300} height={200} marginVertical={10} isInteractive={true}>
          {children}
        </LineChartProvider>
      );
    };
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockSelectedValue.value = 0;
  });

  describe('Basic Functionality', () => {
    it('should not throw when called with valid parameters', () => {
      expect(() => {
        renderHook(
          () =>
            useAnimateGraph({
              data: defaultData,
              animationKey: getAnimationKey(defaultData),
              // Cast to SharedValue - mock implements the required interface
              selectedValue: mockSelectedValue as unknown as SharedValue<number>,
            }),
          { wrapper: createWrapper() },
        );
      }).not.toThrow();
    });

    it('should handle empty data array', () => {
      expect(() => {
        renderHook(
          () =>
            useAnimateGraph({
              data: [],
              animationKey: getAnimationKey([]),
              selectedValue: mockSelectedValue as unknown as SharedValue<number>,
            }),
          { wrapper: createWrapper() },
        );
      }).not.toThrow();
    });

    it('should handle single data point', () => {
      const singleData: ChartDataApiEquity[] = [{ timestamp: '2023-01-01T10:00:00Z', equity: 150 }];

      expect(() => {
        renderHook(
          () =>
            useAnimateGraph({
              data: singleData,
              animationKey: getAnimationKey(singleData),
              selectedValue: mockSelectedValue as unknown as SharedValue<number>,
            }),
          { wrapper: createWrapper() },
        );
      }).not.toThrow();
    });
  });

  describe('Animation Values', () => {
    it('should set selected value to latest equity', () => {
      renderHook(
        () =>
          useAnimateGraph({
            data: defaultData,
            animationKey: getAnimationKey(defaultData),
            selectedValue: mockSelectedValue as unknown as SharedValue<number>,
          }),
        { wrapper: createWrapper() },
      );

      // Now returns latest equity (last item), not sum
      const expectedLatest = defaultData[defaultData.length - 1].equity;
      expect(mockSelectedValue.value).toEqual(expect.objectContaining({ toValue: expectedLatest, type: 'timing' }));
    });
  });

  describe('Data Variations', () => {
    it('should handle data with zero equity values', () => {
      const zeroData: ChartDataApiEquity[] = [
        { timestamp: '2023-01-01T10:00:00Z', equity: 0 },
        { timestamp: '2023-01-01T11:00:00Z', equity: 0 },
      ];

      renderHook(
        () =>
          useAnimateGraph({
            data: zeroData,
            animationKey: getAnimationKey(zeroData),
            selectedValue: mockSelectedValue as unknown as SharedValue<number>,
          }),
        { wrapper: createWrapper() },
      );

      expect(mockSelectedValue.value).toEqual(expect.objectContaining({ toValue: 0, type: 'timing' }));
    });

    it('should handle data with negative equity values', () => {
      const negativeData: ChartDataApiEquity[] = [
        { timestamp: '2023-01-01T10:00:00Z', equity: -50 },
        { timestamp: '2023-01-01T11:00:00Z', equity: -30 },
      ];

      renderHook(
        () =>
          useAnimateGraph({
            data: negativeData,
            animationKey: getAnimationKey(negativeData),
            selectedValue: mockSelectedValue as unknown as SharedValue<number>,
          }),
        { wrapper: createWrapper() },
      );

      // Now returns latest equity (last item), not sum
      expect(mockSelectedValue.value).toEqual(expect.objectContaining({ toValue: -30, type: 'timing' }));
    });
  });

  describe('Line & Gradient Replay', () => {
    // Combine the hook with context access so we can assert on the shared
    // values the hook drives (animationLine / animationGradient).
    function useTestAnimateGraph(chartData: ChartDataApiEquity[]): ChartSharedValues {
      const { sharedValues } = useLineChartContext();
      useAnimateGraph({
        data: chartData,
        animationKey: getAnimationKey(chartData),
        selectedValue: mockSelectedValue as unknown as SharedValue<number>,
      });
      return sharedValues;
    }

    it('should drive the line to its drawn state and fade the gradient', () => {
      // The reanimated mock resolves `withTiming` to its target synchronously,
      // so the observable end state is line = 1 and gradient faded to height.
      const { result } = renderHook(() => useTestAnimateGraph(defaultData), { wrapper: createWrapper() });

      expect(result.current.animationLine.value).toBe(1);
      expect(result.current.animationGradient.value).toEqual(expect.objectContaining({ current: { x: 0, y: 200 } }));
    });

    it('should re-run the draw-on animation when the chart shape changes', () => {
      const { result, rerender } = renderHook(({ data }) => useTestAnimateGraph(data), {
        wrapper: createWrapper(),
        initialProps: { data: defaultData },
      });

      const newData: ChartDataApiEquity[] = [
        { timestamp: '2023-02-01T10:00:00Z', equity: 200 },
        { timestamp: '2023-02-01T11:00:00Z', equity: 300 },
      ];
      rerender({ data: newData });

      // Effect re-fires on the new animationKey without crashing and lands the
      // line at its drawn state — the reset happens in the same layout effect.
      expect(result.current.animationLine.value).toBe(1);
      expect(result.current.animationGradient.value).toEqual(expect.objectContaining({ current: { x: 0, y: 200 } }));
    });
  });

  describe('Hook Behavior', () => {
    it('should react to data changes', () => {
      const { rerender } = renderHook(
        ({ data }) =>
          useAnimateGraph({
            data: data,
            animationKey: getAnimationKey(data),
            selectedValue: mockSelectedValue as unknown as SharedValue<number>,
          }),
        { wrapper: createWrapper(), initialProps: { data: defaultData } },
      );

      // Now returns latest equity (last item), not sum
      const initialLatest = defaultData[defaultData.length - 1].equity;
      expect(mockSelectedValue.value).toEqual(expect.objectContaining({ toValue: initialLatest, type: 'timing' }));

      // Change data
      const newData: ChartDataApiEquity[] = [
        { timestamp: '2023-01-01T10:00:00Z', equity: 200 },
        { timestamp: '2023-01-01T11:00:00Z', equity: 300 },
      ];

      rerender({ data: newData });

      const newLatest = newData[newData.length - 1].equity;
      expect(mockSelectedValue.value).toEqual(expect.objectContaining({ toValue: newLatest, type: 'timing' }));
    });
  });
});
