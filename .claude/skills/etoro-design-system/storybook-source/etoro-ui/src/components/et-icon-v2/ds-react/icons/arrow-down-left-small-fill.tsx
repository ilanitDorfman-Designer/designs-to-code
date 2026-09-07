import { Path, Svg } from 'react-native-svg';

import type { DsReactLocalIconProps } from '../ds-react-local-icon-props';

/** DS — React `arrow-down-left-small-fill` (generated from Figma SVG export). */
export function DsReactIconArrowDownLeftSmallFill({ size, color }: DsReactLocalIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 20C4.44772 20 4 19.5523 4 19V11C4 10.4477 4.44772 10 5 10C5.55228 10 6 10.4477 6 11V16.5858L18.2929 4.29289C18.6834 3.90237 19.3166 3.90237 19.7071 4.29289C20.0976 4.68342 20.0976 5.31658 19.7071 5.70711L7.41421 18H13C13.5523 18 14 18.4477 14 19C14 19.5523 13.5523 20 13 20H5Z"
        fill={color}
      />
    </Svg>
  );
}
