import Svg, { Path } from 'react-native-svg';

import { useEtoroTheme } from '../hooks';
import { IconProps } from './models/icon-props';

function Copy({ size = 24, hasFill = false, fill, color }: IconProps) {
  const { colors } = useEtoroTheme();
  const fillColor = hasFill ? fill : color || colors.textPrimaryNeutral;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M7 6V3C7 2.44772 7.44772 2 8 2H20C20.5523 2 21 2.44772 21 3V17C21 17.5523 20.5523 18 20 18H17V21C17 21.5523 16.5523 22 16 22H4C3.44772 22 3 21.5523 3 21V9C3 8.44772 3.44772 8 4 8H7V6ZM9 8H16C16.5523 8 17 8.44772 17 9V16H19V4H9V8ZM5 10V20H15V10H5Z"
        fill={fillColor}
      />
    </Svg>
  );
}

export default Copy;
