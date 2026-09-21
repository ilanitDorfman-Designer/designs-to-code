/**
 * LineChart Context
 *
 * Provides stable references (SharedValues, handlers) to all chart hooks.
 * Reactive data (geometry, filteredData) is passed directly to hooks.
 */

import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { useSharedValue } from 'react-native-reanimated';

import { ChartConfig, ChartHandlers, ChartSharedValues, CursorData, LineChartContextValue, LineChartProviderProps } from './types';

// ============================================================================
// Context
// ============================================================================

const LineChartContext = createContext<LineChartContextValue | null>(null);
LineChartContext.displayName = 'LineChartContext';

/**
 * Hook to access LineChart context.
 * Must be used within a LineChartProvider.
 */
export function useLineChartContext(): LineChartContextValue {
  const context = useContext(LineChartContext);
  if (!context) {
    throw new Error('useLineChartContext must be used within a LineChartProvider.');
  }
  return context;
}

// ============================================================================
// Provider
// ============================================================================

/**
 * Provides chart context with stable SharedValue references.
 */
export function LineChartProvider({
  width,
  height,
  marginVertical,
  isInteractive,
  onFocusModeChange,
  onCursorDataChange,
  children,
}: LineChartProviderProps) {
  // ---------------------------------------------------------------------------
  // React State (only for showCursor - changes on focus mode)
  // ---------------------------------------------------------------------------

  const [showCursor, setShowCursor] = useState(false);

  // ---------------------------------------------------------------------------
  // Refs for Callbacks (avoid stale closures in worklets)
  // ---------------------------------------------------------------------------

  const onCursorDataChangeRef = useRef(onCursorDataChange);
  onCursorDataChangeRef.current = onCursorDataChange;

  const onFocusModeChangeRef = useRef(onFocusModeChange);
  onFocusModeChangeRef.current = onFocusModeChange;

  // ---------------------------------------------------------------------------
  // Shared Values (stable references - never cause re-renders)
  // Each useSharedValue returns a stable reference that never changes.
  // ---------------------------------------------------------------------------

  const cx = useSharedValue(0);
  const cy = useSharedValue(0);
  const overlayWidth = useSharedValue(0);
  const overlayOpacity = useSharedValue(0);
  const cursorOpacity = useSharedValue(0);
  const lastIndex = useSharedValue(-1);
  const animationLine = useSharedValue(0);
  const animationGradient = useSharedValue({ x: 0, y: 0 });
  const currentEquityRef = useSharedValue(0);
  const pnLRef = useSharedValue(0);
  const timestampRef = useSharedValue('');
  const firstEquityRef = useSharedValue(0);

  // Memoize the sharedValues object to maintain referential stability.
  // Empty dependency array is intentional: useSharedValue returns stable
  // references that never change, so this memo only runs once.
  const sharedValues: ChartSharedValues = useMemo(
    () => ({
      cx,
      cy,
      overlayWidth,
      overlayOpacity,
      cursorOpacity,
      lastIndex,
      animationLine,
      animationGradient,
      currentEquityRef,
      pnLRef,
      timestampRef,
      firstEquityRef,
    }),
    [],
  );

  // ---------------------------------------------------------------------------
  // Handlers (memoized - stable references)
  // ---------------------------------------------------------------------------

  const onFocusModeStart = useCallback(() => {
    setShowCursor(true);
    onFocusModeChangeRef.current?.(true);
  }, []);

  const onFocusModeEnd = useCallback(() => {
    setShowCursor(false);
    onFocusModeChangeRef.current?.(false);
    // Delay clearing cursor data by one frame for animation timing
    requestAnimationFrame(() => {
      onCursorDataChangeRef.current?.(null);
    });
  }, []);

  // Empty dependency array is intentional: refs are stable and we read
  // .value at call time, not at memo time.
  const emitCursorData = useCallback(() => {
    const cursorData: CursorData = {
      amount: currentEquityRef.get(),
      pnL: pnLRef.get(),
      timestamp: timestampRef.get(),
      firstPrice: firstEquityRef.get(),
    };
    onCursorDataChangeRef.current?.(cursorData);
  }, []);

  const handlers: ChartHandlers = useMemo(
    () => ({
      onFocusModeStart,
      onFocusModeEnd,
      emitCursorData,
    }),
    [onFocusModeStart, onFocusModeEnd, emitCursorData],
  );

  // ---------------------------------------------------------------------------
  // Config (memoized)
  // ---------------------------------------------------------------------------

  const config: ChartConfig = useMemo(
    () => ({
      width,
      height,
      marginVertical,
      isInteractive,
    }),
    [width, height, marginVertical, isInteractive],
  );

  // ---------------------------------------------------------------------------
  // Context Value
  // ---------------------------------------------------------------------------

  const contextValue: LineChartContextValue = useMemo(
    () => ({
      sharedValues,
      config,
      handlers,
      showCursor,
    }),
    [sharedValues, config, handlers, showCursor],
  );

  return <LineChartContext.Provider value={contextValue}>{children}</LineChartContext.Provider>;
}

LineChartProvider.displayName = 'LineChartProvider';
