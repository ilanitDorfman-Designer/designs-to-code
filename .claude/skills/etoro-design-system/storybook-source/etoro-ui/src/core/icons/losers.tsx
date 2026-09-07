import { View } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

import { useEtoroTheme } from '../../core/hooks';
import { IconProps } from './models/icon-props';

function Losers({ size = 24, hasFill = false, fill, color }: IconProps) {
  const { colors } = useEtoroTheme();
  return (
    <View>
      <Svg width={size} height={size} viewBox="0 0 20 16">
        <G fill={hasFill ? fill : 'none'} stroke={color || colors.textPrimaryNeutral} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
          <Path
            d="M12.5513 5.08002L15.808 1.25427L19.2173 5.08002"
            stroke={colors.textPrimaryNeutral}
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <Path d="M15.7147 15.8474L15.8265 2" stroke={colors.textPrimaryNeutral} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          <Path
            d="M7.97287 15.8473L8.05856 5.82568"
            stroke={colors.textPrimaryNeutral}
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <Path
            d="M1.56181 15.8474L1.64749 8.4032"
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

export default Losers;
