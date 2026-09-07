import Svg, { Path } from 'react-native-svg';

import { useEtoroTheme } from '../../core/hooks';
import { IconProps } from './models/icon-props';

export function V(props: IconProps) {
  const { colors } = useEtoroTheme();
  return (
    <Svg
      width={props.size}
      height={props.size}
      viewBox="0
      0
      14
      11"
      fill={props.hasFill ? props.fill : colors.actionBrandText}
      {...props}
    >
      <Path
        d="M4.45992 8.46655C4.59674 8.57792 4.79672 8.56305 4.91557 8.43267L12.2539 0.381816C12.5753 -0.0398643 13.1833 -0.125324 13.6119 0.190936C14.0405 0.507197 14.1274 1.10542 13.8059 1.5271C13.8059 1.5271 5.60038 10.6511 5.58674 10.6667C5.23809 11.0669 4.6257 11.1132 4.21894 10.7702L0.338765 7.58888C-0.0679991 7.24585 -0.115106 6.64334 0.233549 6.24313C0.582204 5.84293 1.19459 5.79658 1.60136 6.13961L4.45992 8.46655Z"
        fill={props.hasFill ? props.fill : colors.actionBrandText}
      />
    </Svg>
  );
}
