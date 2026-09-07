import Svg, { Path } from 'react-native-svg';

import { useEtoroTheme } from '../hooks';
import { IconProps } from './models/icon-props';

function ArrowUpFill({ size = 16, color }: IconProps) {
  const { colors } = useEtoroTheme();
  const fillColor = color || colors.textPrimaryNeutral;
  return (
    <Svg width={size} height={size} viewBox="0 0 8 14" fill="none">
      <Path
        d="M1.13807 4.4714C0.877722 4.73175 0.455612 4.73175 0.195262 4.4714C-0.0650874 4.21105 -0.0650874 3.78894 0.195262 3.5286L3.5286 0.195262C3.78894 -0.0650874 4.21105 -0.0650874 4.4714 0.195262L7.80474 3.5286C8.06509 3.78894 8.06509 4.21105 7.80474 4.4714C7.54439 4.73175 7.12228 4.73175 6.86193 4.4714L4.66667 2.27614V12.6667C4.66667 13.0349 4.36819 13.3333 4 13.3333C3.63181 13.3333 3.33333 13.0349 3.33333 12.6667V2.27614L1.13807 4.4714Z"
        fill={fillColor}
      />
    </Svg>
  );
}

export default ArrowUpFill;
