import { StyleProp, ViewStyle } from 'react-native';

export type EtPerformanceBarsLayout = 'centered' | 'bottom-up';

export type PerformanceBarsDataItem = {
  /** Numeric value; sign determines bar color (positive/negative gain) */
  value: number;
  /**
   * When `true`, the bar renders with the neutral `mutedBar` gradient instead of the sign-based
   * positive/negative colors — used to visually de-emphasise a data point (e.g. back-tested /
   * simulated results). Requires `colorScheme.mutedBar`; falls back to the sign color otherwise.
   */
  muted?: boolean;
};

/**
 * Two-stop gradient colours for the bar chart. Each entry is `[centerLineEnd, tipEnd]` — the first
 * stop sits at the zero line, the second at the bar's tip / the slot's outer edge. Override via the
 * `colorScheme` prop; defaults to the design-system theme tokens.
 */
export type PerformanceBarsColors = {
  /** Positive (gain) bar gradient. */
  positiveBar: [string, string];
  /** Negative (loss) bar gradient. */
  negativeBar: [string, string];
  /** Background gradient behind every non-selected slot. */
  slot: [string, string];
  /** Background gradient behind a selected positive bar. */
  selectedPositive: [string, string];
  /** Background gradient behind a selected negative bar. */
  selectedNegative: [string, string];
  /**
   * Neutral gradient for bars flagged `muted` on their data item (e.g. back-tested / simulated
   * results). Optional — when omitted, muted bars fall back to their sign-based color.
   */
  mutedBar?: [string, string];
};

export type EtPerformanceBarsProps = {
  /** Chart data: array of { value } */
  data: PerformanceBarsDataItem[];
  /** Total number of bar slots to show. When greater than data.length, empty slots show only the background gradient. */
  numberOfBars?: number;
  /** Index of the currently selected bar, or null for none. Parent controls this via onBarClick. */
  selectedIndex?: number | null;
  /** Height of the chart area in pixels */
  height?: number;
  /** Gap between bars in pixels */
  barGap?: number;
  /** Border radius of each bar */
  barBorderRadius?: number;
  /** Whether to show the scale labels on the side (default: true for centered, false for bottom-up) */
  showScale?: boolean;
  /** Chart layout: centered (signed performance) or bottom-up (non-negative distribution) */
  layout?: EtPerformanceBarsLayout;
  /** Colour-scheme override. Defaults to the design-system theme tokens. */
  colorScheme?: PerformanceBarsColors;
  /** Animate bars growing out from the center line on mount / data change (default: false). Honors reduce-motion. */
  animated?: boolean;
  /** Per-bar grow duration in ms when `animated` (default: 320) */
  animationDuration?: number;
  /** Delay between consecutive bars, left→right, in ms when `animated` (default: 60) */
  animationStagger?: number;
  /** Container style */
  style?: StyleProp<ViewStyle>;
  /** Called when a bar is pressed. Parent should update selectedIndex (e.g. toggle or set). */
  onBarClick?: (index: number) => void;
  /** Accessibility label */
  accessibilityLabel?: string;
  /** Test ID */
  testID?: string;
};
