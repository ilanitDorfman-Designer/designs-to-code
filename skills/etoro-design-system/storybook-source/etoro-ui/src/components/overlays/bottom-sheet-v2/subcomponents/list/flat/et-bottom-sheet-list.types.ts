import type { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import type { ComponentProps, ReactNode } from 'react';

/**
 * Extract props from BottomSheetFlatList component
 */
type BottomSheetFlatListProps<T> = ComponentProps<typeof BottomSheetFlatList<T>>;

/**
 * Props for EtBottomSheet.List
 *
 * Extends BottomSheetFlatList props with consistent styling defaults.
 * Use this for virtualized lists with 50+ items for optimal performance.
 *
 * Scroll observation must use `scrollEventsHandlersHook` — Gorhom omits `onScroll`
 * from BottomSheetFlatList's public API.
 *
 * @example Basic usage
 * ```tsx
 * <EtBottomSheet.List
 *   data={items}
 *   renderItem={({ item }) => <ItemRow item={item} />}
 *   keyExtractor={(item) => item.id}
 * />
 * ```
 *
 * @example With custom empty state
 * ```tsx
 * <EtBottomSheet.List
 *   data={filteredItems}
 *   renderItem={({ item }) => <ItemRow item={item} />}
 *   ListEmptyComponent={<EmptyState message="No results found" />}
 * />
 * ```
 */
export interface EtBottomSheetListProps<T> extends Omit<BottomSheetFlatListProps<T>, 'ref'> {
  /**
   * Custom loading placeholder shown when parent sheet is in loading state.
   * Falls back to ActivityIndicator if not provided.
   */
  loadingPlaceholder?: ReactNode;
  /**
   * Optional overlay pinned to the bottom edge of the list viewport (for scroll fades).
   * Rendered above the list; does not scroll with content.
   */
  bottomOverlay?: ReactNode;
}
