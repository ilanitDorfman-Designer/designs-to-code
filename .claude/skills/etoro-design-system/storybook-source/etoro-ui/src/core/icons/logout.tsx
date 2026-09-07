import { View } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

import { useEtoroTheme } from '../../core/hooks';
import { IconProps } from './models/icon-props';

function Logout({ size = 24, hasFill = false, fill, color }: IconProps) {
  const { colors } = useEtoroTheme();
  return (
    <View>
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <G fill={hasFill ? fill : 'none'} stroke={color || colors.textPrimaryNeutral} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
          <Path d="m12 15l3-3m0 0l-3-3m3 3H4m5-4.751V7.2c0-1.12 0-1.68.218-2.108c.192-.377.497-.682.874-.874C10.52 4 11.08 4 12.2 4h4.6c1.12 0 1.68 0 2.107.218c.377.192.683.497.875.874c.218.427.218.987.218 2.105v9.607c0 1.118 0 1.677-.218 2.104a2.002 2.002 0 0 1-.875.874c-.427.218-.986.218-2.104.218h-4.606c-1.118 0-1.678 0-2.105-.218a2 2 0 0 1-.874-.874C9 18.48 9 17.92 9 16.8v-.05" />
        </G>
      </Svg>
    </View>
  );
}

export default Logout;
