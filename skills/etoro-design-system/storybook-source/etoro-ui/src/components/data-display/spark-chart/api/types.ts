import { ChartDataApiEquity } from '@etoro/common/types';

export interface EtSparkChartProps {
  data: ChartDataApiEquity[];
  /** Y-value for the dashed baseline. Defaults to the first data point and is ignored when `showBaseline` is `false`. */
  referenceValue?: number;
  /** Whether the chart fades at the right edge. Defaults to `true`. */
  fadeRightEdge?: boolean;
  width?: number;
  height?: number;
  margin?: number;
  balance?: 'positive' | 'negative';
  /**
   * Draw the dashed horizontal reference line at `referenceValue`. Defaults to `true`
   * to preserve the historical rendering; pass `false` for surfaces that want a bare
   * spark (e.g. tightly packed cards where the extra line adds visual noise).
   */
  showBaseline?: boolean;
}
