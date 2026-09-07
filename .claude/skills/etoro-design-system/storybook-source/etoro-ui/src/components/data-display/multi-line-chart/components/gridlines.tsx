import { Line } from '@shopify/react-native-skia';

import { computeYAxisTickPositions } from '../../line-chart/utils';

interface GridlinesProps {
  /** Number of gridlines — matches the rendered y-axis tick count */
  count: number;
  chartWidth: number;
  chartHeight: number;
  /** Gridline stroke color (pass a translucent token, e.g. carbonSecondaryDivider) */
  color: string;
  /** Must match the y-axis label distribution so lines align with the chips */
  distribution?: 'space-around' | 'space-between';
}

/**
 * Full-width horizontal gridlines drawn inside the Skia canvas, one per y-axis
 * tick. Positions share `computeYAxisTickPositions` with `YAxisLabels` so the
 * lines always align with the label chips.
 */
export function Gridlines({ count, chartWidth, chartHeight, color, distribution = 'space-around' }: GridlinesProps) {
  const positions = computeYAxisTickPositions(count, chartHeight, distribution);

  return (
    <>
      {positions.map((y, index) => (
        <Line key={`gridline-${index}`} p1={{ x: 0, y }} p2={{ x: chartWidth, y }} color={color} style="stroke" strokeWidth={1} />
      ))}
    </>
  );
}
