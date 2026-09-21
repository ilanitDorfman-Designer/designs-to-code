import { View } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

import { useEtoroTheme } from '../../core/hooks';
import { IconProps } from './models/icon-props';

function Gainers({ size = 24, hasFill = false, fill, color }: IconProps) {
  const { colors } = useEtoroTheme();
  return (
    <View>
      <Svg width={size} height={size} viewBox="0 0 20 16">
        <G fill={hasFill ? fill : 'none'} stroke={color || colors.textPrimaryNeutral} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
          <Path
            d="M1 11.1743L4.25677 15L7.66599 11.1743"
            stroke={colors.textPrimaryNeutral}
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <Path d="M4.28483 14.8474L4.17299 1" stroke={colors.textPrimaryNeutral} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          <Path
            d="M12.0266 14.8474L11.941 4.82581"
            stroke={colors.textPrimaryNeutral}
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <Path
            d="M18.4377 14.8474L18.352 7.4032"
            stroke={colors.textPrimaryNeutral}
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </G>
      </Svg>
    </View>
  );
}

export default Gainers;
