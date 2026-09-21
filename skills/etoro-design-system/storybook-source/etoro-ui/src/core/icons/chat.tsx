import { View } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

import { useEtoroTheme } from '../../core/hooks';
import { IconProps } from './models/icon-props';

function Chat({ size = 24, hasFill = false, fill, color }: IconProps) {
  const { colors } = useEtoroTheme();
  return (
    <View>
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <G fill={hasFill ? fill : 'none'} stroke={color || colors.textPrimaryNeutral} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
          <Path d="M9.338 15.99a6 6 0 1 0-5.408-2.78l-.424 1.272v.002c-.163.487-.244.73-.187.893c.05.141.163.253.304.303c.162.058.404-.023.888-.184l.007-.002l1.272-.424a5.971 5.971 0 0 0 3.548.92m0 0s0 0 0 0m0 0a6.003 6.003 0 0 0 8.872 3.08l1.272.424h.003c.487.163.73.244.893.186a.5.5 0 0 0 .302-.303c.058-.162-.023-.406-.186-.895l-.424-1.272l.142-.235A6 6 0 0 0 15 8l-.225.004l-.113.006" />
        </G>
      </Svg>
    </View>
  );
}

export default Chat;
