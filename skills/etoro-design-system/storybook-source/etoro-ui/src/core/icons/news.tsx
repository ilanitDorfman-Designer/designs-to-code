import React from 'react';
import { View } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

import { IconProps } from './models/icon-props';

function News({ hasFill = false, fill }: IconProps) {
  return (
    <View>
      <Svg width={16} height={15} viewBox="0 0 14 15">
        <G fill={hasFill ? fill : 'none'} strokeLinecap="round" strokeLinejoin="round">
          <Path d="M3.5 4.5H8.5" stroke="#D9EEFE" stroke-linecap="round" />
          <Path d="M3.5 6.5H8.5" stroke="#D9EEFE" stroke-linecap="round" />
          <Path d="M3.5 6.5H13.5" stroke="#54BCFF" stroke-linecap="round" />
          <Path d="M3.5 8.5H6.5" stroke="#D9EEFE" stroke-linecap="round" />
          <Path
            opacity="0.59209"
            d="M13 3V3C14.1046 3 15 3.89543 15 5V12C15 13.1046 14.1046 14 13 14V14"
            stroke="#65B6E9"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </G>
      </Svg>
    </View>
  );
}

export default News;
