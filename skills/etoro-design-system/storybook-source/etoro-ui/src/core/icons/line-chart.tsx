import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { useEtoroTheme } from '../../core/hooks';
import { IconProps } from './models/icon-props';

function LineChart({ size = 24, fill, color }: IconProps) {
  const { colors } = useEtoroTheme();
  const fillColor = fill || color || colors.textPrimaryNeutral;

  return (
    <View>
      <Svg width={size} height={size} viewBox="0 0 14 15">
        <Path d="M1 11.5L4 8.5L7 10.5L10 6.5L13 3.5" stroke={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </Svg>
    </View>
  );
}

export default LineChart;
