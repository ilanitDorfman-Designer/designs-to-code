import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { useEtoroTheme } from '../../core/hooks';
import { IconProps } from './models/icon-props';

function Menu({ color, size = 20 }: IconProps) {
  const { colors } = useEtoroTheme();
  return (
    <View>
      <Svg width={size} height={size} viewBox="0 0 20 10">
        <Path
          d="M18.856 2.30809H1.62789C1.10897 2.30809 0.641943 1.87716 0.641943 1.39834V1.30258C0.641943 0.823758 1.10897 0.392822 1.62789 0.392822H18.856C19.3749 0.392822 19.8419 0.823758 19.8419 1.30258V1.39834C19.8419 1.87716 19.3749 2.30809 18.856 2.30809Z"
          fill={color || colors.textPrimaryNeutral}
        />
        <Path
          d="M13.4545 9.60721H1.74937C1.16651 9.60721 0.641943 9.17627 0.641943 8.69745V8.60169C0.641943 8.12287 1.16651 7.69194 1.74937 7.69194H13.4545C14.0374 7.69194 14.5619 8.12287 14.5619 8.60169V8.69745C14.5619 9.17627 14.0374 9.60721 13.4545 9.60721Z"
          fill={color || colors.textPrimaryNeutral}
        />
      </Svg>
    </View>
  );
}

export default Menu;
