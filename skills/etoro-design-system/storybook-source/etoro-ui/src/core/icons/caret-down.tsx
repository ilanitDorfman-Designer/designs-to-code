import Svg, { Path } from 'react-native-svg';

import { useEtoroTheme } from '../../core/hooks';
import { IconProps } from './models/icon-props';

function CaretDown({ color, size = 7 }: IconProps) {
  const { colors } = useEtoroTheme();

  // Viewbox is 7x4; height is proportional to width
  const height = Math.round((size * 4) / 7);

  return (
    <Svg width={size} height={height} viewBox="0 0 7 4" fill="none">
      <Path
        d="M2.71776 3.75189C3.06187 4.0827 3.60581 4.0827 3.94992 3.75189L6.42049 1.37683C6.93983 0.877562 6.58642 0 5.86601 0L0.801675 0C0.0812677 0 -0.272145 0.877562 0.2472 1.37683L2.71776 3.75189Z"
        fill={color || colors.statusNegative}
      />
    </Svg>
  );
}

export default CaretDown;
