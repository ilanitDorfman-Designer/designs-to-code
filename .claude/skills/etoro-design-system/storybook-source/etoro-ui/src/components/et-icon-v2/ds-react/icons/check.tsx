import { Path, Svg } from 'react-native-svg';

import type { DsReactLocalIconProps } from '../ds-react-local-icon-props';

/** DS — React `check` (generated from Figma SVG export). */
export function DsReactIconCheck({ size, color }: DsReactLocalIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20.6222 4.95217C20.9281 4.64626 21.4241 4.64637 21.73 4.95217C22.036 5.25811 22.036 5.75403 21.73 6.05999L8.8645 19.0477C8.71682 19.1954 8.51639 19.278 8.30753 19.2772C8.09874 19.2763 7.89909 19.1924 7.7526 19.0436L2.26438 13.4618C1.96098 13.1534 1.96427 12.6574 2.27254 12.3539C2.58091 12.0505 3.07689 12.0549 3.38036 12.3631L8.31365 17.3819L20.6222 4.95217Z"
        fill={color}
      />
    </Svg>
  );
}
