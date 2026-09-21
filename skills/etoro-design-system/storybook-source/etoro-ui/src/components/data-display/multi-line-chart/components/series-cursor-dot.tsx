import { Circle, Group } from '@shopify/react-native-skia';
import { SharedValue, useDerivedValue } from 'react-native-reanimated';
import { getYForX } from 'react-native-redash';

import { ChartGeometry } from '../../line-chart/utils';

const HEX_COLOR_PATTERN = /^#(?:[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/;

interface SeriesCursorDotProps {
  /** Shared cursor x position (driven by the primary-series gesture) */
  cx: SharedValue<number>;
  /** Parsed Skia path of this series — the dot rides along it */
  parsedPath: ChartGeometry['parsedPath'];
  /** Series color — dot fill + translucent halo */
  color: string;
  /** Cursor opacity shared value (fades with the scrub state) */
  opacity: SharedValue<number>;
}

/**
 * Scrub dot pinned to one series' line at the shared cursor x, so the vertical
 * needle visually passes through a dot on every series. Mirrors the dot + halo
 * styling of the line-chart `Cursor`, tinted with the series color.
 */
export function SeriesCursorDot({ cx, parsedPath, color, opacity }: SeriesCursorDotProps) {
  const cy = useDerivedValue(() => getYForX(parsedPath, cx.value) ?? 0);
  const haloColor = HEX_COLOR_PATTERN.test(color) ? `${color.slice(0, 7)}20` : color;

  return (
    <Group opacity={opacity}>
      <Circle r={4} cx={cx} cy={cy} strokeWidth={5} color={color} style="fill" />
      <Circle r={8} cx={cx} cy={cy} color={haloColor} style="stroke" strokeWidth={10} />
    </Group>
  );
}
