import { useEffect, useMemo, useRef } from 'react';
import { SharedValue, useSharedValue } from 'react-native-reanimated';

import { useEtoroTheme } from '../../../../core/hooks/use-etoro-theme';
import { EtPaginationProps, PaginationColor, PaginationSize } from '../api';
import { getDotColors } from '../utils/get-dot-colors';

export interface PaginationConfig {
  // Resolved props
  totalPages: number;
  currentPage: SharedValue<number>;
  size: PaginationSize;
  color: PaginationColor;

  // Colors
  selectedColor: string;
  defaultColor: string;
}

/**
 * Type guard to check if a value is a SharedValue.
 * Uses the public API (get/set methods) instead of internal properties.
 */
function isSharedValue(value: number | SharedValue<number>): value is SharedValue<number> {
  return typeof value === 'object' && value !== null && 'value' in value && typeof value.get === 'function' && typeof value.set === 'function';
}

/**
 * Normalizes currentPage to a SharedValue.
 * If a number is passed, creates a stable SharedValue that syncs with the number.
 * If a SharedValue is passed, returns it directly.
 */
function usePaginationState(currentPage: number | SharedValue<number>): SharedValue<number> {
  // Check if the input is a SharedValue
  const isSharedValueInput = isSharedValue(currentPage);
  const inputTypeRef = useRef<'number' | 'shared' | null>(null);

  if (inputTypeRef.current === null) {
    inputTypeRef.current = isSharedValueInput ? 'shared' : 'number';
  } else if (__DEV__ && (inputTypeRef.current === 'shared') !== isSharedValueInput) {
    console.warn('EtPagination: currentPage should not switch between number and SharedValue.');
  }

  // Track the initial numeric value to create a stable SharedValue
  const initialValueRef = useRef<number | null>(null);

  // Capture the initial value on first render when it's a number
  if (!isSharedValueInput && initialValueRef.current === null) {
    initialValueRef.current = currentPage;
  }

  // Always call useSharedValue unconditionally (hooks rule)
  // Use the initial captured value to ensure stability across renders
  const internalSharedValue = useSharedValue(initialValueRef.current ?? 0);

  // Sync number changes to the internal SharedValue
  useEffect(() => {
    if (!isSharedValueInput && internalSharedValue.value !== currentPage) {
      internalSharedValue.value = currentPage;
    }
    // internalSharedValue is stable (from useSharedValue) and intentionally omitted
  }, [currentPage, isSharedValueInput]); // Rerun when currentPage or its type changes

  // Return the appropriate SharedValue
  if (isSharedValueInput) {
    return currentPage;
  }

  return internalSharedValue;
}

/**
 * Processes pagination props into resolved configuration.
 *
 * This hook is a pure prop-to-config transformer. It normalizes currentPage
 * (number or SharedValue) into a stable SharedValue internally.
 */
export function usePaginationConfig({
  totalPages,
  currentPage: currentPageProp,
  size: paginationSize,
  color: paginationColor,
}: EtPaginationProps): PaginationConfig {
  const { colors } = useEtoroTheme();

  // Normalize currentPage to always be a SharedValue
  const currentPage = usePaginationState(currentPageProp);

  return useMemo(() => {
    // Apply defaults
    const size = paginationSize ?? 'large';
    const color = paginationColor ?? 'neutral';

    // Get colors based on variant
    const dotColors = getDotColors(color, colors);

    return {
      totalPages,
      currentPage,
      size,
      color,
      selectedColor: dotColors.selectedColor,
      defaultColor: dotColors.defaultColor,
    };
  }, [totalPages, currentPage, paginationSize, paginationColor, colors]);
}
