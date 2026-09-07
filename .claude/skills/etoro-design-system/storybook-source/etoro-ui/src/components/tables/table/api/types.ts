import { FlashListProps, FlashListRef, ListRenderItem } from '@shopify/flash-list';
import { ReactNode, Ref } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, StyleProp, ViewStyle } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';

// `removeClippedSubviews` is omitted, not just discouraged: FlashList v2 recycles internally and
// ignores it, so RecyclerView spreads it onto the native Android ScrollView and turns on legacy
// subview clipping, whose nullable children crash in `ViewGroup.dispatchDraw`. Omitting it makes
// that a compile error; `EtTableBody` also strips it for callers that lose the type.
export type EtTableBodyFlashListProps<T> = Omit<FlashListProps<T>, 'ref' | 'data' | 'renderItem' | 'keyExtractor' | 'removeClippedSubviews'>;

export interface EtTableGlassEffect {
  disabled?: boolean;
  blurIntensity?: number;
  gradientColors?: [string, string, ...string[]];
  overlayStyle?: StyleProp<ViewStyle>;
}

export interface EtTableColumn {
  name: string;
  title: string;
  isFirstColumn?: boolean;
  /** Width of the column in percentage */
  width?: number;
  visible?: boolean;
  /** When false, header is not pressable and does not participate in sort. Defaults to true. */
  sortable?: boolean;
  /**
   * Horizontal alignment of a moving (non-pinned) column header title. Defaults to
   * `'center'` when unset; set `'right'` to align a header over right-aligned cell
   * values (e.g. numeric columns). Ignored for the pinned first column, which is
   * always left-aligned.
   */
  align?: 'left' | 'center' | 'right';
  columnConfigs?: EtTableColumnProps;
}

export type ColumnCellType =
  | 'changePct' // Percentage change with arrow icon and color coding (e.g., "+2.5%")
  | 'changeCurrency' // Currency change with arrow icon and color coding (e.g., "+$100")
  | 'currency' // Currency value (e.g., "$1,000")
  | 'percentage' // Percentage value (e.g., "2.5%")
  | 'background' // Background pill style
  | 'riskScore'; // Numeric risk score in a circular pill

export interface EtTableColumnProps {
  /**
   * Type of cell content. Determines formatting, icons, and styling.
   * Instead of multiple boolean flags, use a single type that describes the data.
   */
  type?: ColumnCellType;
}

// Main props interface
export interface EtTableProps<T> {
  children: ReactNode | ReactNode[];
  /** Unique identifier for the table used for testing */
  id: string;
  /** Columns for regular table mode (mutually exclusive with sections) */
  columns: EtTableColumn[];
  /** Whether to fix the first column while scrolling other columns */
  fixFirstColumn?: boolean;
  /** Whether table should take full height */
  fullHeight?: boolean;
  /** Custom key extractor for regular table mode */
  keyExtractor?: (item: T, index: number) => string;
  /** Custom style for the container */
  style?: StyleProp<ViewStyle>;
  /** Bounce effect when scrolling horizontally in regular mode */
  bounces?: boolean;
}

export interface EtTableHeadProps {
  style?: StyleProp<ViewStyle>;
  renderColumn?: (column: EtTableColumn) => ReactNode;
}

export type EtTableSortDirection = 'asc' | 'desc';

/**
 * Sort state shared between the table and its parent in controlled mode.
 * `column` matches `EtTableColumn.name` of the column being sorted.
 */
export interface EtTableSortState {
  column: string;
  direction: EtTableSortDirection;
}

export interface EtTableBodyProps<T> {
  items: T[];
  flashListProps?: EtTableBodyFlashListProps<T>;
  /** Render single row item */
  renderItem: ListRenderItem<T>;
  /** Render header cell for each column in fixed column mode */
  renderHeaderColumn?: (column: EtTableColumn) => ReactNode;
  /** Glass morphism effect configuration for fixed column */
  glassEffect?: EtTableGlassEffect;
  /**
   * When true, the active sorted column is indicated by a brighter title + the
   * sort arrow only — no pill background behind the header. Defaults to false
   * (the pill highlight). Only affects the default header in fixed-column mode.
   */
  minimalSortHeader?: boolean;
  /** Scroll event handler for the vertical scroll (works in both FlashList and fixed column modes) */
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  /**
   * Content rendered after the last row inside the scrollable area. In virtualized
   * fixed-column mode it is clamped to the viewport width and pinned against the
   * horizontal scroll, so it stays in place on screen while the columns move.
   */
  footer?: ReactNode;
  /**
   * When true the body renders rows inline without its own vertical ScrollView.
   * Use when multiple tables are stacked inside a shared parent scroll container.
   * Only affects fixed-column mode; ignored in the FlashList path.
   */
  shrinkToContent?: boolean;
  /**
   * Fixed-column mode only. When true the body vertically virtualizes its rows
   * with a `FlashList` (instead of rendering every row up front) while keeping a
   * single native horizontal scroller and a frozen first column. Use for large,
   * unbounded data sets (e.g. a full portfolio). Ignored when `shrinkToContent`
   * is set (the inline path renders all rows by design) and in the FlashList path.
   * Pass list tuning (e.g. `getItemType`) via `flashListProps`.
   */
  virtualizeRows?: boolean;
  /**
   * Snap horizontal scrolling to column boundaries (fixed-column paths only).
   * Pass `false` for free horizontal scrolling — flings decay and settle anywhere
   * instead of animating to the nearest column edge.
   * @default true
   */
  snapToColumns?: boolean;
  /**
   * Enables the sortable header interaction (fixed-column paths). Pass `false` to render the
   * header cells inert — distinct from omitting `onSortChange`, which switches the hook to
   * UNCONTROLLED local sorting rather than disabling it.
   * @default true
   */
  sortable?: boolean;
  /**
   * Fades the trailing edge of the moving header while it can still scroll (fixed-column,
   * non-shrink paths — forwarded to the body-rendered `EtTableFixedColumnHeader`).
   */
  showScrollHeaderFade?: boolean;
  /**
   * Controlled sort state. The table renders the header UI (chevron / active column highlight)
   * from this value instead of any internal state. Pair with `onSortChange` to take full ownership.
   */
  sort?: EtTableSortState | null;
  /**
   * Callback fired when a column header is pressed.
   * Providing this prop switches the table into **controlled sort mode**:
   * - The table no longer sorts `items` internally.
   * - The parent is responsible for mapping each press to a new sort state (e.g. server refetch).
   * Omit this prop to keep the existing client-side sorting behavior.
   */
  onSortChange?: (next: EtTableSortState | null) => void;
  /**
   * Shared animated value that tracks the horizontal scroll offset of the body.
   * When provided, the body uses this value instead of creating its own internal one.
   * Pair with `<EtTableFixedColumnHeader scrollOffsetX={...} />` to keep a lifted
   * header in sync with the body's horizontal scroll.
   */
  scrollOffsetX?: SharedValue<number>;
  /**
   * Ref to the underlying vertical `FlashList`. Lets a parent drive imperative
   * scrolling (e.g. `scrollToTop()` for a tab re-press). Wired in the FlashList
   * path and the virtualized fixed-column path; ignored by the inline
   * (`shrinkToContent`) fixed-column path, which has no list of its own.
   */
  flashListRef?: Ref<FlashListRef<T>>;
}

export interface EtTableRowProps<T> {
  item: T;
  index?: number;
  style?: StyleProp<ViewStyle>;
  onRowClick?: (item: T) => void;
  /**
   * Custom renderer for each cell in the row.
   * If not provided, the default text renderer will be used.
   */
  renderColumn: (item: T, column: EtTableColumn) => ReactNode;
  /**
   * Only these columns will be rendered for the row, ignoring the table's column configuration.
   * These columns would be moving during horizontal scroll when first column is fixed.
   */
  columnsOverride?: EtTableColumn[];
  testID?: string;
}
