import { View } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

import { useEtoroTheme } from '../hooks';
import { IconProps } from './models/icon-props';

function SwitchUnits({ size = 21, hasFill = false, fill, color }: IconProps) {
  const { colors } = useEtoroTheme();
  return (
    <View>
      <Svg width={size} height={size} viewBox="0 0 21 21">
        <G fill={hasFill ? fill : 'none'} stroke={color || colors.textPrimaryNeutral} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
          <Path d="m8.501 11.5l-3.001 3l3.001 3" />
          <Path d="M16.5 9.5v2a3 3 0 0 1-3 3h-8m6.999-5l3.001-3l-3.001-3" />
          <Path d="M4.5 11.5v-2a3 3 0 0 1 3-3h8" />
        </G>
      </Svg>
    </View>
  );
}

export default SwitchUnits;
