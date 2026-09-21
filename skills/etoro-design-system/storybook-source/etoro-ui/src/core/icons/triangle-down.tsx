import { View } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

import { useEtoroTheme } from '../../core/hooks';
import { IconProps } from './models/icon-props';

function TriangleDown({ size = 12, hasFill, fill, color }: IconProps) {
  const { colors } = useEtoroTheme();

  return (
    <View>
      <Svg width={size} height={size} viewBox="0 0 16 16">
        <G>
          <Path
            d="M8.31249 10.2298C8.15236 10.4299 7.84792 10.4299 7.68779 10.2298L4.52004 6.27007C4.31052 6.00817 4.49699 5.62024 4.83239 5.62024H11.1679C11.5033 5.62024 11.6898 6.00817 11.4802 6.27007L8.31249 10.2298Z"
            fill={hasFill ? fill || color || colors.statusNegative : 'none'}
            stroke={!hasFill ? color || colors.statusNegative : 'none'}
            strokeWidth={!hasFill ? 1 : 0}
          />
        </G>
      </Svg>
    </View>
  );
}

export default TriangleDown;
