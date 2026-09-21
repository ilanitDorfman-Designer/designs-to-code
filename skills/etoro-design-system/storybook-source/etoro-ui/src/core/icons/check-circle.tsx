import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';

import { useEtoroTheme } from '../hooks';
import { IconProps } from './models/icon-props';

function CheckCircle({ size = 16, hasFill = false, fill, color }: IconProps) {
  const { colors } = useEtoroTheme();
  const fillColor = hasFill ? fill : color || colors.textPrimaryNeutral;

  return (
    <Svg width={size} height={size} viewBox="0 0 16 16">
      <Defs>
        <ClipPath id="clip0_46519_69">
          <Rect width="16" height="16" fill="white" />
        </ClipPath>
      </Defs>
      <G clipPath="url(#clip0_46519_69)">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0.166668 8.00002C0.166668 3.67379 3.67377 0.166687 8 0.166687C12.3262 0.166687 15.8333 3.67379 15.8333 8.00002C15.8333 12.3263 12.3262 15.8334 8 15.8334C3.67377 15.8334 0.166668 12.3263 0.166668 8.00002ZM11.3536 6.35357C11.5488 6.15831 11.5488 5.84173 11.3536 5.64647C11.1583 5.45121 10.8417 5.45121 10.6464 5.64647L7 9.29291L5.35355 7.64647C5.15829 7.45121 4.84171 7.45121 4.64645 7.64647C4.45119 7.84173 4.45119 8.15831 4.64645 8.35357L6.64645 10.3536C6.84171 10.5488 7.15829 10.5488 7.35356 10.3536L11.3536 6.35357Z"
          fill={fillColor}
        />
      </G>
    </Svg>
  );
}

export default CheckCircle;
