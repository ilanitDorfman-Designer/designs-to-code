import { Path, Svg } from 'react-native-svg';

import type { DsReactLocalIconProps } from '../ds-react-local-icon-props';

/** DS — React `home-fill` (generated from Figma SVG export). */
export function DsReactIconHomeFill({ size, color }: DsReactLocalIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.2182 2.59028C11.2433 1.72222 12.7463 1.72284 13.7719 2.59028L20.9369 8.65278C21.6827 9.28384 22.0377 10.2637 21.8695 11.226L20.3627 19.8432C20.1325 21.1592 18.9897 22.1196 17.6537 22.1196H6.4086C5.0736 22.1192 3.93149 21.1601 3.70059 19.8452L2.18008 11.184C2.01139 10.2218 2.36527 9.24126 3.11075 8.60981L10.2182 2.59028ZM8.39102 16.0239C7.97697 16.0239 7.64129 16.3599 7.64102 16.7739C7.64102 17.1881 7.97681 17.5239 8.39102 17.5239H15.6615C16.0755 17.5236 16.4115 17.1879 16.4115 16.7739C16.4113 16.36 16.0754 16.0241 15.6615 16.0239H8.39102Z"
        fill={color}
      />
    </Svg>
  );
}
