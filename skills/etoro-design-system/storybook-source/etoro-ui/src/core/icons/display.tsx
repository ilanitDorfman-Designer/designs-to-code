import { View } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

import { useEtoroTheme } from '../../core/hooks';
import { IconProps } from './models/icon-props';

function Display({ size = 24, hasFill = false, fill, color }: IconProps) {
  const { colors } = useEtoroTheme();
  return (
    <View>
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <G fill={hasFill ? fill : 'none'} stroke={color || colors.textPrimaryNeutral} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1">
          <Path d="M3.5 15.327q-.214 0-.357-.144T3 14.827V4.616q0-.667.475-1.141T4.615 3H16.77q.213 0 .357.144t.143.357t-.143.356T16.77 4H4.616q-.27 0-.443.173T4 4.616v10.211q0 .213-.144.356t-.357.144M12.33 21q-.35 0-.58-.232t-.23-.576V19H8.385q-.69 0-1.153-.462t-.463-1.153v-9q0-.69.463-1.153t1.153-.463h12.019q.69 0 1.153.463t.462 1.153v9q0 .69-.462 1.153T20.404 19H17.25v1.192q0 .344-.232.576t-.576.232zm-3.944-3h12.019q.269 0 .442-.173t.173-.442v-9q0-.27-.173-.443t-.442-.173H8.384q-.268 0-.442.173q-.173.173-.173.442v9q0 .27.173.443q.174.173.443.173m6.019-5.116" />
        </G>
      </Svg>
    </View>
  );
}

export default Display;
