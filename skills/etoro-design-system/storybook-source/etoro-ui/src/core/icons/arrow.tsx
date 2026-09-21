import Svg, { Path } from 'react-native-svg';

import { useEtoroTheme } from '../hooks';
import { IconProps } from './models/icon-props';

function Arrow({ size = 16, hasFill = false, fill, color }: IconProps) {
  const { colors } = useEtoroTheme();
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16">
      <Path
        d="M14.4075 10.9486C14.4074 11.2137 14.1929 11.4283 13.9278 11.4283C13.6628 11.4283 13.4482 11.2137 13.4481 10.9486V3.22832L2.44111 14.2275L2.36611 14.2893C2.17975 14.4122 1.92618 14.3916 1.7622 14.2275C1.57495 14.04 1.57551 13.736 1.76298 13.5486L12.7685 2.5502H5.01376C4.7488 2.55004 4.53408 2.33551 4.53408 2.07051C4.53408 1.8055 4.7488 1.59097 5.01376 1.59082H13.9278L14.0247 1.6002C14.2434 1.645 14.4075 1.83859 14.4075 2.07051V10.9486Z"
        fill={hasFill ? fill : 'none'}
        stroke={color || colors.textPrimaryNeutral}
      />
    </Svg>
  );
}

export default Arrow;
