import { Circle, Group } from '@shopify/react-native-skia';
import { SharedValue } from 'react-native-reanimated';

import { MARKER_RADIUS } from '../constants';
import { MarkerPosition } from '../utils';

interface ChartMarkersProps {
  positions: MarkerPosition[];
  animationProgress: SharedValue<number>;
  color: string;
  transparent?: boolean;
}

export function ChartMarkers({ positions, animationProgress, color, transparent = false }: ChartMarkersProps) {
  if (positions.length === 0) {
    return null;
  }

  const opacity = transparent ? 0 : 1;

  return (
    <Group opacity={animationProgress}>
      {positions.map((pos, index) => (
        <Circle key={`marker-${index}-${pos.x}-${pos.y}`} cx={pos.x} cy={pos.y} r={MARKER_RADIUS} color={color} opacity={opacity} style="fill" />
      ))}
    </Group>
  );
}
