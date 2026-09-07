import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { X1 } from '../../../core/styles/spacing';
import { EtPaginationProps } from './api';
import { usePaginationConfig } from './hooks';
import { PaginationDot } from './subcomponents';

/**
 * EtPagination - A pagination indicator component
 *
 * Displays a row of dots to indicate the current page within a set of pages.
 * Supports different sizes and color variants with smooth animations.
 * Accepts either a number or SharedValue for currentPage.
 *
 * @example Basic usage with number
 * ```tsx
 * <EtPagination
 *   totalPages={5}
 *   currentPage={2}
 * />
 * ```
 *
 * @example Scroll-driven animations with SharedValue
 * ```tsx
 * const currentPage = useSharedValue(0);
 * <EtPagination
 *   totalPages={5}
 *   currentPage={currentPage}
 * />
 * ```
 *
 * @example With size and color variants
 * ```tsx
 * <EtPagination
 *   totalPages={4}
 *   currentPage={1}
 *   size="large"
 *   color="primary"
 * />
 * ```
 */
function EtPaginationBase(props: EtPaginationProps) {
  const config = usePaginationConfig(props);

  // Generate array of page indices
  const pages = useMemo(() => Array.from({ length: config.totalPages }, (_, i) => i), [config.totalPages]);

  return (
    <View style={[styles.container, props.style]} testID={props.testID} accessibilityLabel={props.accessibilityLabel ?? 'Pagination'}>
      {pages.map((pageIndex) => (
        <PaginationDot
          key={pageIndex}
          index={pageIndex}
          totalPages={config.totalPages}
          currentPage={config.currentPage}
          size={config.size}
          selectedColor={config.selectedColor}
          defaultColor={config.defaultColor}
        />
      ))}
    </View>
  );
}

EtPaginationBase.displayName = 'EtPagination';

/**
 * Export with compound components attached
 */
export const EtPagination = Object.assign(React.memo(EtPaginationBase), {
  Dot: PaginationDot,
});

export { EtPaginationBase };

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: X1,
  },
});
