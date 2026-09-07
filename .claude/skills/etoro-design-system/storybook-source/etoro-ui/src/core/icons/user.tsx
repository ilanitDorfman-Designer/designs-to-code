import { View } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

import { useEtoroTheme } from '../hooks';
import { IconProps } from './models/icon-props';

function User({ size = 24, color }: IconProps) {
  const { colors } = useEtoroTheme();
  return (
    <View>
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <G stroke={color || colors.textPrimaryNeutral} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
          <Path fill="none" d="M20 21c0-2.761-3.582-5-8-5s-8 2.239-8 5m8-8a5 5 0 1 1 0-10a5 5 0 0 1 0 10" />
        </G>
      </Svg>
    </View>
  );
}

export default User;
