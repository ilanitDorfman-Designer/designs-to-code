import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

/**
 * Supported donut glyph sizes.
 *
 * The DS defines two sizes; the numeric px diameters live inside
 * `usePieChartConfig` and are the only source of truth for that mapping.
 * - `'small'`: DS base size
 * - `'large'`: larger variant
 */
export type PieChartSize = 'small' | 'large';

/**
 * Segment color. Either a solid stroke color, or a `[from, to]` gradient tuple
 * (arcs render solid using the tuple's second/primary value — see `resolveSegmentColor`).
 */
export type PieChartColor = string | [string, string];

/**
 * A single donut segment.
 * `value` is a relative share — values are normalized by their sum, so they do
 * not need to add up to 100.
 */
export type PieChartData = {
  /** Stable identity + default legend label */
  key: string;
  /** Relative share (normalized by the sum of all values) */
  value: number;
  /** Optional stroke color; falls back to the DS accent palette when omitted */
  color?: PieChartColor;
};

/**
 * Props for {@link EtPieChart}.
 *
 * @example Basic usage
 * ```tsx
 * <EtPieChart data={[{ key: 'Stocks', value: 60 }, { key: 'Crypto', value: 40 }]} />
 * ```
 */
export type EtPieChartProps = {
  /** Segments to render (defaults to an empty donut track) */
  data?: PieChartData[];
  /** Overall glyph size — DS variant (default: `'small'`) */
  size?: PieChartSize;
  /** Donut hole radius in px. Derived from `size` when omitted. */
  innerRadius?: number;
  /** Max visible segments before the remainder is folded into "Other" (default: 7) */
  maxSegments?: number;
  /** Render the decorative dashed outer ring (Figma "Dashed line" variant; default: false) */
  showOuterRing?: boolean;
  /** Enable the entrance sweep animation (default: true) */
  enableAnimation?: boolean;
  /** Entrance animation duration in ms (default: 900) */
  animationDuration?: number;
  /** Container style */
  style?: StyleProp<ViewStyle>;
  /** Test ID for testing */
  testID?: string;
  /** Accessibility label override */
  accessibilityLabel?: string;
};

/** Layout for {@link SegmentLegend}. */
export type SegmentLegendLayout = 'grid' | 'list';

/**
 * Props for `EtPieChart.SegmentLegend` — a dumb container that arranges
 * {@link SegmentLegendItemProps | SegmentLegendItem} children.
 */
export type SegmentLegendProps = {
  /** `SegmentLegendItem` children */
  children: ReactNode;
  /**
   * `'grid'` (default) wraps items into centered rows that hug their content —
   * an incomplete last row centers its lone item. `'list'` stacks items full-width.
   */
  layout?: SegmentLegendLayout;
  /**
   * Grid only. Fixes how many items each row holds so wrap points don't depend
   * on label width. Cells still hug their content, and a short last row still
   * centers — this is not an equal-width column grid.
   *
   * Use it when several legends sit side by side and must wrap to the same
   * number of rows regardless of label length. Five items over `columns={2}`
   * lay out as two full rows plus a single centered cell.
   */
  columns?: number;
  /** Container style */
  style?: StyleProp<ViewStyle>;
  /** Test ID for testing */
  testID?: string;
};

/**
 * Typography scale for a legend row.
 *
 * `'medium'` is the body scale (14/20) used alongside the `large` donut, where
 * the legend is the page's main list. `'small'` is the caption scale (10/14) the
 * compact allocation card uses, so a two-column legend fits without truncating.
 */
export type SegmentLegendItemSize = 'medium' | 'small';

/**
 * Props for `EtPieChart.SegmentLegendItem` — a colored dot, label, optional
 * value and optional chevron. Becomes pressable only when `onPress` is provided.
 */
export type SegmentLegendItemProps = {
  /** Color of the leading dot (match the segment color) */
  dotColor: string;
  /** Segment label */
  label: string;
  /** Typography scale (default: `'medium'`) */
  size?: SegmentLegendItemSize;
  /** Optional trailing value string (e.g. `"42%"`) */
  value?: string;
  /** Show a trailing chevron affordance (default: false) */
  showChevron?: boolean;
  /** Optional press handler; when set the row renders as an accessible button */
  onPress?: () => void;
  /** Row style */
  style?: StyleProp<ViewStyle>;
  /** Test ID for testing */
  testID?: string;
  /** Accessibility label override (defaults to `"{label} {value}"`, or just `label` when no value) */
  accessibilityLabel?: string;
};
