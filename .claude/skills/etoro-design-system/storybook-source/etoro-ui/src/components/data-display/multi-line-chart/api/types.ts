import { ChartDataApiEquity } from '@etoro/common/types';
import { SharedValue } from 'react-native-reanimated';

import { CursorData, YAxisLabels, YAxisTickCount, YAxisTickFormat } from '../../line-chart/api/types';

/** A single line series rendered by EtMultiLineChart */
export interface MultiLineChartSeries {
  /** Series data — same shape as EtLineChart's `data` prop */
  data: ChartDataApiEquity[];
  /** Stroke color for this series' line */
  color: string;
}

export interface MultiLineChartProps {
  /**
   * Line series to render. All series share one unified y-domain so the lines
   * are visually comparable. The first entry is the primary series: it drives
   * the scrub cursor and plays the draw-in animation; the rest render as
   * static strokes beneath it. While scrubbing, the vertical needle shows a
   * dot on every series at the cursor position, each tinted with its series
   * color. The DS compare design uses up to 4 series.
   */
  series: MultiLineChartSeries[];
  /** Chart width */
  width?: number;
  /** Chart height */
  height?: number;
  /** Chart margin (vertical spacing above and below the chart lines) */
  marginVertical?: number;
  /**
   * Whether the chart is interactive (cursor, gestures enabled).
   * @default true
   */
  isInteractive?: boolean;
  /** Selected value shared value (from parent) — tracks the primary series */
  selectedValue: SharedValue<number>;
  /**
   * Render a full-width horizontal gridline at each y-axis tick position.
   * Tick positions come from the rendered y-axis labels (`yAxisLabels` or
   * `yAxisTickCount`); combine with `yAxisLabelsHidden` to get gridlines
   * without visible label chips.
   * @default true
   */
  showGridlines?: boolean;
  /** Override the gridline color (defaults to `carbonSecondaryDivider`) */
  gridlineColor?: string;
  /**
   * Manual override for the y-axis labels.
   * When provided, takes precedence over `yAxisTickCount` / `yAxisTickFormat`.
   */
  yAxisLabels?: YAxisLabels;
  /** Hide y-axis labels without unmounting them */
  yAxisLabelsHidden?: boolean;
  /**
   * Number of auto-computed y-axis ticks to render (3-6), derived from the
   * unified y-domain. Ignored when `yAxisLabels` is supplied; if omitted along
   * with `yAxisLabels`, no labels (and no gridlines) are rendered.
   */
  yAxisTickCount?: YAxisTickCount;
  /** Formatter for auto-computed tick values. Receives the raw numeric tick. */
  yAxisTickFormat?: YAxisTickFormat;
  /** Y-axis label position from the end edge in px (default: 30) */
  yAxisEnd?: number;
  /** Y-axis label distribution mode (default: 'space-around') */
  yAxisDistribution?: 'space-around' | 'space-between';
  /** Override the needle + primary dot color (defaults to the primary series color) */
  cursorColor?: string;
  /**
   * Override the vertical needle's color, leaving the primary dot on
   * `cursorColor`. Defaults to the neutral `carbon500` token: in a compare
   * chart the per-series dots carry the colour identity, so a tinted needle
   * would imply it belongs to one particular series.
   */
  needleColor?: string;
  /**
   * Colour of the surface the chart sits on — used by the scrub overlay to dim
   * the area ahead of the cursor. Defaults to `backgroundBase`.
   */
  surfaceColor?: string;
  /** Re-draw trigger — bump to redraw the chart (see EtLineChart's `redrawKey`). */
  redrawKey?: string | number;
  /** Whether a `redrawKey` change animates the draw-in (default) or snaps. */
  animateOnRedraw?: boolean;
  /** Called when focus mode changes (user starts/ends gesture interaction) */
  onFocusModeChange?: (isFocused: boolean) => void;
  /** Called with primary-series cursor data during pan gestures, null on end */
  onCursorDataChange?: (data: CursorData | null) => void;
}
