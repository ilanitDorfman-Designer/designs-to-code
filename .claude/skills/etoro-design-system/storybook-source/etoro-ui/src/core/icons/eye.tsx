import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { useEtoroTheme } from '../../core/hooks';
import { IconProps } from './models/icon-props';

/** Figma DS 20×20 filled eye (visibility on). */
function Eye({ size = 20, color }: IconProps) {
  const { colors } = useEtoroTheme();
  const fill = color || colors.textPrimaryNeutral;

  return (
    <View>
      <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10.0001 6.70541C8.1784 6.70541 6.70551 8.17831 6.70551 9.99999C6.70551 11.8217 8.1784 13.2946 10.0001 13.2946C11.8218 13.2946 13.2947 11.8217 13.2947 9.99999C13.2947 8.17831 11.8218 6.70541 10.0001 6.70541ZM7.8683 9.99999C7.8683 8.8205 8.82059 7.8682 10.0001 7.8682C11.1796 7.8682 12.1319 8.8205 12.1319 9.99999C12.1319 11.1795 11.1796 12.1318 10.0001 12.1318C8.82059 12.1318 7.8683 11.1795 7.8683 9.99999Z"
          fill={fill}
        />
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M18.1726 9.07533C15.3674 1.26428 4.63274 1.26428 1.82752 9.07533C1.61316 9.6722 1.61316 10.3278 1.82752 10.9246C4.63274 18.7357 15.3674 18.7357 18.1726 10.9246C18.387 10.3278 18.387 9.6722 18.1726 9.07533ZM2.92187 9.46835C5.35849 2.68366 14.6417 2.68366 17.0783 9.46835C17.2014 9.81115 17.2014 10.1888 17.0783 10.5316C14.6417 17.3163 5.35849 17.3163 2.92187 10.5316C2.79876 10.1888 2.79876 9.81115 2.92187 9.46835Z"
          fill={fill}
        />
      </Svg>
    </View>
  );
}

export default Eye;
