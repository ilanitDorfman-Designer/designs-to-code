import { ChartDataApiEquity } from '@etoro/common/types';
import type { Color, GradientProps } from '@shopify/react-native-skia';
import { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { SharedValue } from 'react-native-reanimated';

import { eToroTheme } from '../../../../core/styles';

/** Y-axis labels — any number of pre-formatted strings rendered top-to-bottom. */
export type YAxisLabels = string[];

/**
 * Approximate number of auto-computed y-axis ticks (passed to `d3-scale.ticks`).
 * d3 may return slightly more or fewer ticks based on the domain — that's fine.
 */
export type YAxisTickCount = number;

/** Formatter for auto-computed y-axis tick values. Receives the raw numeric tick. */
export type YAxisTickFormat = (value: number) => string;

export interface CursorProps {
  cx: SharedValue<number>;
  cy: SharedValue<number>;
  chartHeight: number;
  colors: eToroTheme['colors'];
  isDarkMode: boolean;
  style?: StyleProp<ViewStyle>;
  showCursor: boolean;
  opacity?: SharedValue<number>;
  /** Extra vertical length for the needle above and below the chart area */
  needleExtension?: number;
  /** Override the cursor stroke + dot color (defaults to actionBrandText) */
  color?: string;
  /** Override just the vertical needle's color, leaving the dot on `color` */
  needleColor?: string;
}

export interface GraphGradientProps extends Partial<Omit<GradientProps, 'colors'>> {
  chartHeight: number;
  chartWidth: number;
  chartMarginVertical: number;
  curvedLine: string;
  animationGradient: SharedValue<{ x: number; y: number }>;
  colors: eToroTheme['colors'];
  balance?: 'positive' | 'negative';
  /** Skia Path opacity for the gradient fill (default: 0.3) */
  opacity?: number;
  /** Override Skia LinearGradient colors — bypasses the built-in balance/scheme logic */
  gradientColors?: Color[];
}

/** A marker rendered as a dot on the chart line (e.g. deposit/withdrawal) */
export interface ChartMarker {
  /** Timestamp that maps to a position on the chart's x-axis */
  timestamp: string;
}

/** Cursor data emitted during pan gestures */
export interface CursorData {
  /** Current equity value at cursor position */
  amount: number;
  /** Profit/Loss value at cursor position */
  pnL: number;
  /** Timestamp at cursor position */
  timestamp: string;
  /** Equity value at the first (leftmost) visible data point */
  firstPrice: number;
}

export interface LineChartProps {
  /** Test identifier; prefixes the Skia runtime fallback testIDs. */
  testID?: string;
  /** Chart data array */
  data: ChartDataApiEquity[];
  /** Chart width */
  width?: number;
  /** Chart height */
  height?: number;
  /** Chart margin (vertical spacing above and below the chart line) */
  marginVertical?: number;
  /** Balance type for coloring (positive = green, negative = red) */
  balance?: 'positive' | 'negative';
  /**
   * Whether the chart is interactive (cursor, gestures enabled).
   * @default true
   */
  isInteractive?: boolean;
  /** Selected value shared value (from parent) */
  selectedValue: SharedValue<number>;
  /**
   * Manual override for the y-axis labels.
   * When provided, takes precedence over `yAxisTickCount` / `yAxisTickFormat`.
   */
  yAxisLabels?: YAxisLabels;
  /** Hide y-axis labels without unmounting them. Useful for transient states that should not replay label entrance animations. */
  yAxisLabelsHidden?: boolean;
  /**
   * Number of auto-computed y-axis ticks to render (3-6).
   * Ignored when `yAxisLabels` is supplied; if omitted along with `yAxisLabels`,
   * no labels are rendered.
   */
  yAxisTickCount?: YAxisTickCount;
  /**
   * Formatter for auto-computed tick values. Defaults to a numeric formatter
   * (whole numbers without decimals, otherwise one decimal place).
   * Only used when `yAxisTickCount` is set and `yAxisLabels` is omitted.
   */
  yAxisTickFormat?: YAxisTickFormat;
  /** Custom content to render on the left side of the chart (e.g., price alert percentages) */
  leftAxisContent?: ReactNode;
  /** Whether to show baseline dots */
  showBaseline?: boolean;
  /** Markers rendered as small dots on the chart line (e.g. deposit points) */
  markers?: ChartMarker[];
  /** Whether to show markers (false = transparent but still interactive) */
  showMarkers?: boolean;
  /** Optional color override for marker dots (defaults to textDisabledPrimaryNeutral) */
  markerColor?: string;
  /** Override the positive line color (defaults to actionBrandText) */
  lineColor?: string;
  /** Override the cursor stroke + dot color (defaults to actionBrandText) */
  cursorColor?: string;
  /**
   * Colour of the surface the chart sits on — used by the scrub overlay to dim the area ahead of the
   * cursor. Set this when the chart isn't on `backgroundBase` (e.g. inside a sheet) so dragging doesn't
   * paint a mismatched band. Defaults to `backgroundBase`.
   */
  surfaceColor?: string;
  /** Override the fade-mask gradient colors [start, end] (defaults to theme brand colors) */
  maskGradientColors?: [string, string];
  /** Skia Path opacity for the gradient fill (default: 0.3) */
  gradientOpacity?: number;
  /** Override Skia LinearGradient colors — bypasses the built-in balance/scheme logic */
  gradientColors?: Color[];
  /** Multiplier for the vertical gradient fade distance (default: 1) */
  gradientFadeEndMultiplier?: number;
  /** Y-axis label position from the end edge in px (default: 30) */
  yAxisEnd?: number;
  /** Y-axis label distribution mode (default: 'space-around') */
  yAxisDistribution?: 'space-around' | 'space-between';
  /**
   * Opt-in re-draw trigger. The line/gradient draw-in animation normally runs
   * once on mount (and never again, since `animationLine` settles at 1). Bump
   * this value to force the chart to redraw — both to replay the draw-in for a
   * chart that was mounted while hidden (e.g. behind a loading skeleton, where
   * the one-shot draw plays off-screen and the line "pops" in fully drawn once
   * revealed) and to repaint a canvas that got visually blanked without a
   * re-render (e.g. react-freeze clears the Skia canvas when a tab is
   * backgrounded). Whether the redraw animates or snaps is controlled by
   * {@link animateOnRedraw}. Leaving it `undefined` preserves the original
   * mount-only behavior for every other consumer (no reset on live data ticks).
   */
  redrawKey?: string | number;
  /**
   * Controls how a {@link redrawKey} change redraws the chart (default `true`):
   * - `true` — reset the line to 0 and replay the draw-in animation. Use when
   *   the chart is being revealed and you want it to animate in.
   * - `false` — snap the line straight to its fully-drawn state with no
   *   animation. Use when a mounted chart was merely blanked (react-freeze on
   *   tab focus-return) and should simply reappear instead of animating again.
   *
   * No effect unless `redrawKey` is provided and changes.
   */
  animateOnRedraw?: boolean;

  // ============================================================================
  // Interaction Callbacks
  // ============================================================================

  /**
   * Called when focus mode changes (user starts/ends gesture interaction).
   * Use this to coordinate UI changes outside the chart (e.g., fade out toggles).
   */
  onFocusModeChange?: (isFocused: boolean) => void;

  /**
   * Called when cursor position changes during pan gesture.
   * Emits cursor data (amount, pnL, timestamp) or null when gesture ends.
   */
  onCursorDataChange?: (data: CursorData | null) => void;
}

/** Shared values for cursor position and visual state */
export interface ChartSharedValues {
  /** Cursor X position */
  cx: SharedValue<number>;
  /** Cursor Y position */
  cy: SharedValue<number>;
  /** Overlay width (from cursor to right edge) */
  overlayWidth: SharedValue<number>;
  /** Overlay opacity */
  overlayOpacity: SharedValue<number>;
  /** Cursor opacity */
  cursorOpacity: SharedValue<number>;
  /** Last data index (for haptic feedback) */
  lastIndex: SharedValue<number>;
  /** Line drawing animation progress */
  animationLine: SharedValue<number>;
  /** Gradient animation position */
  animationGradient: SharedValue<{ x: number; y: number }>;
  /** Current equity value at cursor */
  currentEquityRef: SharedValue<number>;
  /** P&L at cursor position */
  pnLRef: SharedValue<number>;
  /** Timestamp at cursor position */
  timestampRef: SharedValue<string>;
  /** Equity value at the first (leftmost) visible data point */
  firstEquityRef: SharedValue<number>;
}

/** Chart configuration (stable after mount) */
export interface ChartConfig {
  /** Chart width */
  width: number;
  /** Chart height */
  height: number;
  /** Chart margin (vertical only) */
  marginVertical: number;
  /** Whether the chart is interactive (cursor, gestures enabled) */
  isInteractive: boolean;
}

/** Memoized event handlers */
export interface ChartHandlers {
  /** Called when entering focus mode */
  onFocusModeStart: () => void;
  /** Called when exiting focus mode */
  onFocusModeEnd: () => void;
  /** Emits cursor data to parent */
  emitCursorData: () => void;
}

/** Full context value */
export interface LineChartContextValue {
  /** Shared values (stable references) */
  sharedValues: ChartSharedValues;
  /** Chart configuration */
  config: ChartConfig;
  /** Event handlers */
  handlers: ChartHandlers;
  /** Whether cursor is visible (React state) */
  showCursor: boolean;
}

export interface LineChartProviderProps {
  /** Chart width */
  width: number;
  /** Chart height */
  height: number;
  /** Chart margin (vertical) */
  marginVertical: number;
  /** Whether the chart is interactive (cursor, gestures enabled) */
  isInteractive: boolean;
  /** Callback when focus mode changes */
  onFocusModeChange?: (isFocused: boolean) => void;
  /** Callback when cursor data changes */
  onCursorDataChange?: (data: CursorData | null) => void;
  /** Children */
  children: ReactNode;
}
