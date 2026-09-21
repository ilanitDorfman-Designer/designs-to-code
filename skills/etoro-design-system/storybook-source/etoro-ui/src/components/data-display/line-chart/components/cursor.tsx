import { Circle, Group, LinearGradient, Mask, Path, Rect, Skia } from '@shopify/react-native-skia';
import { useDerivedValue } from 'react-native-reanimated';

import { CursorProps } from '../api/types';

const HEX_COLOR_PATTERN = /^#(?:[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/;

export function Cursor({ cx, cy, chartHeight, colors, isDarkMode, showCursor, opacity, needleExtension = 0, color, needleColor }: CursorProps) {
  const strokeColor = color ?? colors.verdictPositive600;
  const lineColor = needleColor ?? strokeColor;
  const needleTipColor = isDarkMode ? colors.textPrimaryNeutral : lineColor;
  const haloColor = HEX_COLOR_PATTERN.test(strokeColor) ? `${strokeColor.slice(0, 7)}20` : strokeColor;
  const needleStartY = -needleExtension / 2;
  const needleEndY = chartHeight + needleExtension;
  const needleHeight = chartHeight + needleExtension - needleStartY;
  const path = useDerivedValue(() => {
    const filledLine = Skia.Path.Make().moveTo(0, needleStartY).lineTo(0, needleEndY);

    const matrix = Skia.Matrix();
    matrix.translate(cx.value, 0); // Only translate x, y stays at chart bounds
    filledLine.transform(matrix);

    return filledLine;
  });

  const animatedOpacity = useDerivedValue(() => {
    if (opacity) {
      return opacity.value;
    }
    return showCursor ? 1 : 0;
  });

  return (
    <Group opacity={animatedOpacity}>
      <Mask
        mode="alpha"
        mask={
          <Rect x={cx} y={needleStartY} width={20} height={needleHeight}>
            <LinearGradient
              start={{ x: 0, y: needleStartY }}
              end={{ x: 0, y: needleEndY }}
              colors={['white', 'white', 'rgba(255,255,255,0.18)', 'transparent']}
              positions={[0, 0.66, 0.86, 1]}
            />
          </Rect>
        }
      >
        <Path path={path} color={lineColor} style="stroke" strokeJoin="round" strokeCap="round" strokeWidth={1.5}>
          {isDarkMode && (
            <LinearGradient
              start={{ x: 0, y: needleStartY }}
              end={{ x: 0, y: needleEndY }}
              colors={[needleTipColor, lineColor, lineColor]}
              positions={[0, 0.12, 1]}
            />
          )}
        </Path>
      </Mask>
      <Circle r={4} cx={cx} cy={cy} strokeWidth={5} color={strokeColor} style={'fill'} />
      <Circle r={8} cx={cx} cy={cy} color={haloColor} style="stroke" strokeWidth={10} />
    </Group>
  );
}
