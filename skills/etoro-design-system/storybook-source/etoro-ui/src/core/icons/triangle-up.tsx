import { View } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

import { useEtoroTheme } from '../../core/hooks';
import { IconProps } from './models/icon-props';

function TriangleUp({ size = 12, hasFill, fill, color }: IconProps) {
  const { colors } = useEtoroTheme();

  return (
    <View>
      <Svg width={size} height={size} viewBox="0 0 16 16">
        <G>
          <Path
            d="M7.68779 5.77024C7.84792 5.57008 8.15236 5.57008 8.31249 5.77024L11.4802 9.72993C11.6898 9.99183 11.5033 10.3798 11.1679 10.3798H4.83239C4.49699 10.3798 4.31052 9.99183 4.52004 9.72993L7.68779 5.77024Z"
            fill={hasFill ? fill || color || colors.statusPositive : 'none'}
            stroke={!hasFill ? color || colors.statusPositive : 'none'}
            strokeWidth={!hasFill ? 1 : 0}
          />
        </G>
      </Svg>
    </View>
  );
}

export default TriangleUp;
