import { View } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

import { useEtoroTheme } from '../hooks';
import { IconProps } from './models/icon-props';

function Watched({ hasFill = false, fill }: IconProps) {
  const { colors } = useEtoroTheme();
  return (
    <View>
      <Svg width={15} height={10} viewBox="0 0 15 10">
        <G fill={hasFill ? fill : 'none'} strokeLinecap="round" strokeLinejoin="round">
          <Path
            d="M4.27619 6.08106C4.43274 6.1928 4.65016 6.15699 4.7626 6.00094L8.67804 0.566963C9.01986 0.146401 9.66643 0.0611671 10.1222 0.376589C10.578 0.692011 10.6703 1.28865 10.3285 1.70921C10.3285 1.70921 5.51273 8.26386 5.49824 8.27947C5.12748 8.67861 4.47626 8.72484 4.04371 8.38271L1.31874 6.37389C0.886186 6.03176 0.836092 5.43085 1.20685 5.0317C1.57761 4.63256 2.22883 4.58634 2.66138 4.92846L4.27619 6.08106Z"
            fill={colors.actionBrandText}
          />
          <Path
            d="M8.74403 6.37029C8.88636 6.42287 9.04635 6.37756 9.13999 6.25816L13.1016 1.20646C13.4435 0.713865 14.09 0.614032 14.5458 0.98348C15.0016 1.35293 15.0939 2.05175 14.7521 2.54435C14.7521 2.54435 9.93633 8.77853 9.92183 8.7968C9.55107 9.26431 8.89986 9.31846 8.4673 8.91773L7.12402 7.97979L8.3914 6.24004L8.74403 6.37029Z"
            fill={colors.actionBrandText}
          />
        </G>
      </Svg>
    </View>
  );
}

export default Watched;
