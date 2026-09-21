import { LinearGradient, Path, Skia } from '@shopify/react-native-skia';

import { GraphGradientProps } from '../api/types';

export function GraphGradient({
  chartHeight,
  chartWidth,
  chartMarginVertical,
  curvedLine,
  animationGradient,
  colors,
  balance = 'positive',
  opacity = 0.5,
  gradientColors,
}: GraphGradientProps) {
  const getGradientArea = (chartLine: string, width: number, height: number, marginVertical: number) => {
    // Create a path from the chart line
    const gradientAreaSplit = Skia.Path.MakeFromSVGString(chartLine);

    // Close the path if exists
    if (gradientAreaSplit) {
      const bottomY = height - marginVertical;
      gradientAreaSplit
        // add line to the bottom right corner
        .lineTo(width, bottomY)
        // add line to the bottom left corner
        .lineTo(0, bottomY)
        // add line to the first point
        .lineTo(0, gradientAreaSplit.getPoint(0).y);
    }

    return gradientAreaSplit;
  };
  const gradientPath = getGradientArea(curvedLine, chartWidth, chartHeight, chartMarginVertical);

  if (!gradientPath) {
    return null;
  }

  const defaultColors =
    balance === 'positive'
      ? [colors.verdictPositive600Opacity50, colors.verdictPositive600Opacity0]
      : [colors.verdictNegative600Opacity50, colors.verdictNegative600Opacity0];

  return (
    <Path path={gradientPath} opacity={opacity}>
      <LinearGradient start={{ x: 0, y: 0 }} end={animationGradient} colors={gradientColors ?? defaultColors} />
    </Path>
  );
}
