import { View } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

import { useEtoroTheme } from '../../core/hooks';
import { IconProps } from './models/icon-props';

function Checked({ size = 24, hasFill = false, fill, color }: IconProps) {
  const { colors } = useEtoroTheme();
  return (
    <View>
      <Svg width={size} height={size} viewBox={`0 -2 14 18`}>
        <G
          fill={hasFill ? fill : colors.textInvertedPrimaryNeutral}
          stroke={hasFill ? fill : color || colors.textPrimaryNeutral}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="0.1"
        >
          <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4.76002 11.825L12.32 1.02506C12.6292 0.583231 13.2142 0.493689 13.6266 0.825057C14.039 1.15643 14.1226 1.78322 13.8133 2.22504L5.41335 14.2249C5.10407 14.6668 4.51906 14.7563 4.10669 14.4249L0.373385 11.425C-0.0389842 11.0936 -0.122557 10.4668 0.18672 10.025C0.495997 9.58316 1.08101 9.49361 1.49338 9.82498L4.10669 11.925C4.31287 12.0906 4.60538 12.0459 4.76002 11.825Z"
          />
        </G>
      </Svg>
    </View>
  );
}

export default Checked;
