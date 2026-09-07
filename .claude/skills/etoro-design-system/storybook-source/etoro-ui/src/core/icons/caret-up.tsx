import Svg, { Path } from 'react-native-svg';

import { useEtoroTheme } from '../../core/hooks';
import { IconProps } from './models/icon-props';

function CaretUp({ color, size = 7 }: IconProps) {
  const { colors } = useEtoroTheme();

  // Viewbox is 7x4; height is proportional to width
  const height = Math.round((size * 4) / 7);

  return (
    <Svg width={size} height={height} viewBox="0 0 7 4" fill="none">
      <Path
        d="M3.94992 0.248106C3.60581 -0.0827022 3.06187 -0.0827019 2.71776 0.248106L0.2472 2.62317C-0.272145 3.12244 0.0812677 4 0.801675 4L5.86601 4C6.58642 4 6.93983 3.12244 6.42049 2.62317L3.94992 0.248106Z"
        fill={color || colors.statusPositive}
      />
    </Svg>
  );
}

export default CaretUp;
