import type { FlashListProps } from '@shopify/flash-list';
import type { ReactNode } from 'react';

/**
 * Props for EtBottomSheet.FlashList
 *
 * Uses @shopify/flash-list with bottom sheet gesture integration via
 * useBottomSheetScrollableCreator hook (recommended approach per gorhom docs).
 *
 * FlashList provides better performance than FlatList for large lists through
 * cell recycling and optimized rendering. Size estimation is automatic.
 *
 * @example Basic usage
 * ```tsx
 * <EtBottomSheet bottomSheetRef={sheetRef} snapPoints={['50%', '90%']}>
 *   <EtBottomSheet.Header>
 *     <EtBottomSheet.Header.Title>Select Item</EtBottomSheet.Header.Title>
 *   </EtBottomSheet.Header>
 *   <EtBottomSheet.FlashList
 *     data={items}
 *     renderItem={({ item }) => <ItemRow item={item} />}
 *     keyExtractor={(item) => item.id}
 *   />
 * </EtBottomSheet>
 * ```
 *
 * @example With loading placeholder
 * ```tsx
 * <EtBottomSheet.FlashList
 *   data={items}
 *   renderItem={({ item }) => <ItemRow item={item} />}
 *   keyExtractor={(item) => item.id}
 *   loadingPlaceholder={<CustomLoadingSkeleton />}
 *   ListEmptyComponent={<EmptyState message="No items found" />}
 * />
 * ```
 */
export interface EtBottomSheetFlashListProps<T> extends Omit<FlashListProps<T>, 'renderScrollComponent' | 'keyExtractor'> {
  /**
   * Returns a unique string key for each item. **Required in FlashList v2**
   * to prevent visual glitches during upward scrolling and item layout changes.
   *
   * FlashList v2 uses aggressive cell recycling - without stable keys, items
   * will visually "jump" or flicker when scrolling up or when content changes.
   *
   * @example
   * ```tsx
   * keyExtractor={(item) => item.id}
   * ```
   */
  keyExtractor: (item: T, index: number) => string;
  /**
   * Draw distance in pixels - how far ahead FlashList pre-renders items
   * outside the visible area (both above and below).
   *
   * **How it works:**
   * With 80px items and drawDistance=1200, FlashList renders ~15 extra items
   * in each direction (30 total off-screen). This buffer prevents blank cells
   * during scrolling.
   *
   * **When to adjust:**
   * - **Decrease (500-800px)**: Simple items (text only), memory-constrained,
   *   or when using pagination with small pages
   * - **Keep default**: Most use cases with moderate item complexity
   * - **Increase (1500+px)**: Complex items (images, multiple components),
   *   very fast scrolling requirements, or large item heights
   *
   * **Trade-offs:**
   * - Higher = fewer blank cells, more memory usage, slightly slower initial render
   * - Lower = less memory, faster initial render, more blank cells during fast scroll
   *
   * @default 1700 (Android) / 1200 (iOS)
   */
  drawDistance?: number;

  /**
   * Custom loading placeholder shown when parent sheet is in loading state.
   * Falls back to ActivityIndicator if not provided.
   *
   * @example
   * ```tsx
   * loadingPlaceholder={<MyCustomSkeleton />}
   * ```
   */
  loadingPlaceholder?: ReactNode;

  /**
   * When true, overlays soft gradient fades at the top and bottom edges of the
   * list so rows dissolve into the sheet background instead of hard-cutting.
   * @default false
   */
  showEdgeFades?: boolean;

  /**
   * Solid color for the edge fades. Should match the sheet surface.
   * Defaults to `EtFadeMask`'s themed background when omitted.
   */
  edgeFadeColor?: string;

  /**
   * Height of each edge fade band in px.
   * @default 16
   */
  edgeFadeHeight?: number;
}
