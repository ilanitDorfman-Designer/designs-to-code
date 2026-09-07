import { Path, Svg } from 'react-native-svg';

import type { DsReactLocalIconProps } from '../ds-react-local-icon-props';

/** DS — React `filter-fill` (generated from Figma SVG export). */
export function DsReactIconFilterFill({ size, color }: DsReactLocalIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2 4.671C2 3.19585 3.19585 2 4.671 2H19.329C20.8042 2 22 3.19585 22 4.671C22 5.37939 21.7186 6.05877 21.2177 6.55968L15.2276 12.5498C15.0968 12.6806 15.0233 12.8581 15.0233 13.0431V21.3023C15.0233 21.5705 14.8695 21.815 14.6278 21.9311C14.3861 22.0473 14.0992 22.0147 13.8897 21.8471L9.58771 18.4055C9.20154 18.0966 8.97674 17.6288 8.97674 17.1343V13.0431C8.97674 12.8581 8.90324 12.6806 8.7724 12.5498L2.78232 6.55967C2.28141 6.05877 2 5.37939 2 4.671Z"
        fill={color}
      />
    </Svg>
  );
}
