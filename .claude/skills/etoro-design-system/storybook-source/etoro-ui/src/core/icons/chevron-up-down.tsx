import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { useEtoroTheme } from '../../core/hooks';
import { IconProps } from './models/icon-props';

function ChevronUpDown({ size = 24, hasFill = true, fill, colorUp, colorDown }: IconProps & { colorUp?: string; colorDown?: string }) {
  const { colors } = useEtoroTheme();
  const width = size * (10 / 14); // Maintain aspect ratio from viewBox
  const height = size;

  return (
    <View>
      <Svg width={width} height={height} viewBox="0 0 10 14">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M2.11072 5.4799C1.96591 5.31448 1.96273 5.04256 2.10364 4.87255L4.68534 1.75754C4.85771 1.54957 5.14229 1.54957 5.31466 1.75754L7.89636 4.87255C8.03727 5.04256 8.03409 5.31448 7.88928 5.4799C7.74446 5.64531 7.51283 5.64159 7.37193 5.47158L5 2.60968L2.62807 5.47158C2.48717 5.64159 2.25554 5.64531 2.11072 5.4799Z"
          fill={hasFill ? fill || colorUp || colors.textPrimaryNeutral : 'none'}
        />
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M7.88928 8.72323C8.03409 8.88864 8.03727 9.16056 7.89636 9.33057L5.31466 12.4456C5.14229 12.6536 4.85771 12.6536 4.68534 12.4456L4.94756 12.1461L4.68534 12.4456L2.10364 9.33057C1.96273 9.16056 1.96591 8.88864 2.11072 8.72323C2.25554 8.55781 2.48717 8.56154 2.62807 8.73155L5 11.5934L7.37193 8.73155C7.51283 8.56154 7.74446 8.55781 7.88928 8.72323Z"
          fill={hasFill ? fill || colorDown || colors.textPrimaryNeutral : 'none'}
        />
      </Svg>
    </View>
  );
}

export default ChevronUpDown;
