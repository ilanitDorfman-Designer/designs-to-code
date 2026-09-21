import Svg, { Path } from 'react-native-svg';

import { useEtoroTheme } from '../hooks';
import { IconProps } from './models/icon-props';

function Microphone({ size = 24, color }: IconProps) {
  const { colors } = useEtoroTheme();
  const fillColor = color || colors.textPrimaryNeutral;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" fill={fillColor} />
      <Path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" fill={fillColor} />
    </Svg>
  );
}

export default Microphone;
