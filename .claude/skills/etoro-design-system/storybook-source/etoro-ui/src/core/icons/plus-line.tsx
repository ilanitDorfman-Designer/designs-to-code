import Svg, { Path } from 'react-native-svg';

import { useEtoroTheme } from '../hooks';
import { IconProps } from './models/icon-props';

function PlusLine({ size = 24, hasFill = false, fill, color }: IconProps) {
  const { colors } = useEtoroTheme();
  const fillColor = hasFill ? fill : color || colors.textPrimaryNeutral;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M11.25 20C11.25 20.4142 11.5858 20.75 12 20.75C12.4142 20.75 12.75 20.4142 12.75 20V12.75H20C20.4142 12.75 20.75 12.4142 20.75 12C20.75 11.5858 20.4142 11.25 20 11.25H12.75V4C12.75 3.58579 12.4142 3.25 12 3.25C11.5858 3.25 11.25 3.58579 11.25 4V11.25H4C3.58579 11.25 3.25 11.5858 3.25 12C3.25 12.4142 3.58579 12.75 4 12.75H11.25V20Z"
        fill={fillColor}
      />
    </Svg>
  );
}

export default PlusLine;
