import React from 'react';
import { View } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

import { IconProps } from './models/icon-props';

function Ai({ hasFill = false, fill }: IconProps) {
  return (
    <View>
      <Svg width={17} height={17} viewBox="0 0 17 17">
        <G fill={hasFill ? fill : 'none'} strokeLinecap="round" strokeLinejoin="round">
          <Path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M0.585938 10.5C3.97401 10.4393 6.75421 7.80007 6.99089 4.41973L7.02028 4L7.17438 5.00292C7.65307 8.11838 10.3032 10.438 13.4546 10.5L13.1066 10.5854C9.99718 11.348 7.61867 13.8548 7.02028 17C6.75381 13.9264 4.52609 11.3801 1.5152 10.7076L0.585938 10.5Z"
            fill="#C9B3FF"
          />
          <Path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M9.36377 3.85714C11.3743 3.82115 13.0241 2.25499 13.1645 0.249074L13.182 0L13.2734 0.595141C13.5575 2.44387 15.1301 3.82038 17.0001 3.85714L16.7936 3.9078C14.9485 4.36036 13.537 5.84793 13.182 7.71429C13.0238 5.89042 11.7019 4.37941 9.9152 3.98032L9.36377 3.85714Z"
            fill="#EAE1FF"
          />
        </G>
      </Svg>
    </View>
  );
}

export default Ai;
