import type { FlashListProps } from '@shopify/flash-list';
import type { ReactElement, ReactNode } from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

// ========== Slot Identity ==========

/**
 * Slot type identifier used for runtime slot detection.
 * Stored as a static `__SLOT_TYPE` property on each subcomponent so it
 * survives minification (unlike `displayName`, which is a debug-only aid).
 */
export type SlotType = 'header' | 'column' | 'skeleton' | 'empty' | 'error' | 'footer';

// ========== Sort ==========

/**
 * Direction of an active sort on a `EtList.Column`.
 * `null` (or `undefined`) means the column is not the active sort.
 */
export type ListSortDirection = 'asc' | 'desc';

/**
 * Pure function describing the column's tap cycle.
 *
 * Receives the current `sortDirection` for this column and returns the next
 * one. Used as the override hook for `EtList.Column.getNextSortDirection`;
 * the default (`defaultSortCycle`) is `null → 'asc' → 'desc' → null`.
 *
 * Override when a column needs a different cycle — e.g. two-state
 * (`'asc' ↔ 'desc'`), `'desc'`-first, or any consumer-specific order.
 */
export type ListSortCycle = (current: ListSortDirection | null) => ListSortDirection | null;

/**
 * Horizontal alignment of a column's content.
 * Mirrors `flex-start | center | flex-end` semantics (LTR).
 */
export type ListColumnAlign = 'start' | 'center' | 'end';

// ========== Subcomponent Props ==========

/** Props for `EtList.Header`. Horizontal row of `EtList.Column` children. */
export interface ListHeaderProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/**
 * Props for `EtList.Column`.
 *
 * Renders a single header cell. When `sortable` is `true`, the cell is
 * pressable and renders a sort-direction indicator next to the label.
 *
 * Sort state is fully external — `sortDirection` indicates the current
 * direction (when this column is the active sort) and `onSortChange` is
 * invoked with the next direction on tap.
 */
export interface ListColumnProps {
  /** Stable identifier for this column (used for sort callbacks and a11y). */
  id: string;
  /** Label content. Strings are wrapped in an `EtText`; other nodes pass through. */
  children: ReactNode;
  /** Horizontal flex weight relative to siblings. Default `1`. */
  flex?: number;
  /** Content alignment within the cell. Default `'start'`. */
  align?: ListColumnAlign;
  /** When true, the cell is pressable and shows a sort indicator. Default `false`. */
  sortable?: boolean;
  /** Active sort direction for this column. Pass `null`/`undefined` when this column is inactive. */
  sortDirection?: ListSortDirection | null;
  /**
   * Called when a sortable column is tapped.
   *
   * By default cycles through `null → 'asc' → 'desc' → null`, so the third
   * tap resets the column to its inactive state — the consumer is expected
   * to interpret `null` as "fall back to whatever default sort the data
   * source defines" (e.g. the BFF's natural order).
   *
   * Override the cycle with `getNextSortDirection` if the column needs a
   * different state machine.
   */
  onSortChange?: (next: ListSortDirection | null) => void;
  /**
   * Override the default tap cycle (`null → 'asc' → 'desc' → null`).
   *
   * Receives this column's current `sortDirection` and must return the next
   * one. Most consumers should leave this unset — provide it only when the
   * column needs a non-standard cycle (e.g. two-state `'asc' ↔ 'desc'`,
   * desc-first, or any consumer-specific order).
   *
   * Compose with the exported `defaultSortCycle` helper when only a slice
   * of the default behavior needs to change.
   */
  getNextSortDirection?: ListSortCycle;
  /** Container style override */
  style?: StyleProp<ViewStyle>;
  /** Label text style override (only applied when `children` is a string). */
  textStyle?: StyleProp<TextStyle>;
  /** Test ID for testing */
  testID?: string;
}

/**
 * Props for `EtList.Skeleton`.
 *
 * Renders `rows` placeholder rows during the initial loading state. When
 * `children` is provided, that node is used as the row template and
 * cloned `rows` times. Otherwise a generic placeholder is rendered.
 */
export interface ListSkeletonProps {
  /** Number of placeholder rows to render. Default `6`. */
  rows?: number;
  /** Optional row template. When present, it is rendered `rows` times. */
  children?: ReactElement;
  /** Container style override */
  style?: StyleProp<ViewStyle>;
  /** Test ID for testing */
  testID?: string;
}

/** Props for `EtList.Empty`. Rendered when `data.length === 0` and not loading or errored. */
export interface ListEmptyProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/** Props for `EtList.Error`. Rendered when `error` is non-null and `data` is empty. */
export interface ListErrorProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/**
 * Props for `EtList.Footer`.
 *
 * Rendered as the FlashList's `ListFooterComponent` so it scrolls into view
 * at the bottom of the data. Use this to render inline batch loaders or
 * inline batch-error banners; the consumer owns the conditional render.
 */
export interface ListFooterProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

// ========== Children Type ==========

/** Acceptable children for `EtList`. */
export type EtListChildren = ReactElement | Array<ReactElement | null | false | undefined> | null | false | undefined;

// ========== Root Props ==========

/**
 * Information passed to `renderItem` for each row.
 *
 * Mirrors the relevant subset of `FlashList`'s `renderItem` signature; we
 * intentionally narrow it to keep the public API small and stable.
 */
export interface ListRenderItemInfo<T> {
  item: T;
  index: number;
}

/**
 * Props for `EtList`.
 *
 * `EtList` is a generic, virtualized list primitive backed by `@shopify/flash-list`.
 * It owns four render paths derived from `data`, `isLoading`, and `error`:
 *
 * 1. `isLoading && data.length === 0`  → render `Header` + `Skeleton` slot.
 * 2. `error && data.length === 0`      → render `Header` + `Error` slot.
 * 3. `data.length === 0`               → render `Header` + `Empty` slot.
 * 4. Otherwise                         → render `Header` + virtualized list.
 *
 * The `Header` is rendered as a sibling above the FlashList so it remains
 * pinned at the top of the list area regardless of scroll position.
 *
 * @example Basic
 * ```tsx
 * <EtList<Asset>
 *   data={items}
 *   keyExtractor={(item) => String(item.id)}
 *   renderItem={({ item }) => <AssetRow item={item} />}
 *   isLoading={isInitialLoading}
 *   error={error}
 *   onEndReached={loadNextBatch}
 * >
 *   <EtList.Header>
 *     <EtList.Column id="market" sortable sortDirection={sort} onSortChange={setSort}>
 *       Market
 *     </EtList.Column>
 *     <EtList.Column id="buy" align="end">Buy</EtList.Column>
 *     <EtList.Column id="sell" align="end">Sell</EtList.Column>
 *   </EtList.Header>
 *   <EtList.Skeleton rows={8} />
 *   <EtList.Empty>No items available</EtList.Empty>
 *   <EtList.Error>Something went wrong</EtList.Error>
 *   <EtList.Footer>{batchStatus === 'loading' ? <RowSkeleton /> : null}</EtList.Footer>
 * </EtList>
 * ```
 */
export interface EtListProps<T> {
  /** Compound subcomponents (`Header`, `Skeleton`, `Empty`, `Error`, `Footer`). */
  children?: EtListChildren;

  /** Items to render. The active render path is derived from this length. */
  data: ReadonlyArray<T>;
  /** Stable per-item key. Required for virtualization. */
  keyExtractor: (item: T, index: number) => string;
  /** Per-item renderer. Returned node must be a single React element. */
  renderItem: (info: ListRenderItemInfo<T>) => ReactElement | null;

  /** Initial-loading flag. Renders the `Skeleton` slot when `data` is empty. */
  isLoading?: boolean;
  /** Error from the initial load. Renders the `Error` slot when `data` is empty. */
  error?: Error | null;

  /** Called when the user scrolls within `onEndReachedThreshold` of the bottom. */
  onEndReached?: () => void;
  /** Distance from the bottom at which `onEndReached` fires. Forwarded to FlashList. Default `0.5`. */
  onEndReachedThreshold?: FlashListProps<T>['onEndReachedThreshold'];

  /** Container style override */
  style?: StyleProp<ViewStyle>;
  /**
   * Style applied to the FlashList's scroll content container. Use this to add
   * bottom padding so the last rows can scroll clear of a floating/translucent
   * bottom bar while earlier rows still pass behind it. Forwarded as-is to
   * `FlashList.contentContainerStyle` (which supports padding only).
   */
  contentContainerStyle?: FlashListProps<T>['contentContainerStyle'];
  /** Optional callback that receives the active FlashList scroll-to-top handler while data rows are mounted. */
  registerScrollToTop?: (scrollToTop: (() => void) | null) => void;
  /** Test ID for testing */
  testID?: string;
  /** Optional accessibility label for the list region. */
  accessibilityLabel?: string;
}
