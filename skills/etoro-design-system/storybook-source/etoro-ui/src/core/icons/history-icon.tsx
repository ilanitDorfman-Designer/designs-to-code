import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { useEtoroTheme } from '../../core/hooks';
import { IconProps } from './models/icon-props';

function HistoryIcon({ size = 24, color }: IconProps) {
  const { colors } = useEtoroTheme();
  const stroke = color || colors.textPrimaryNeutral;

  return (
    <View>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M12 8v4l3 3" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M3.05 11a9 9 0 1 1 .5 4m-.5 4v-4h4" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    </View>
  );
}

export default HistoryIcon;
