import { View } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

import { useEtoroTheme } from '../../core/hooks';
import { IconProps } from './models/icon-props';

function Map({ size = 24, hasFill = false, fill, color }: IconProps) {
  const { colors } = useEtoroTheme();
  return (
    <View>
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <G fill={hasFill ? fill : 'none'} stroke={color || colors.textPrimaryNeutral} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
          <Path d="M15 6v15m0-15l6-3v15l-6 3m0-15L9 3m6 18l-6-3m0 0l-6 3V6l6-3m0 15V3" />
        </G>
      </Svg>
    </View>
  );
}

export default Map;
