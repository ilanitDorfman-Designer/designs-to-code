import { Path, Svg } from 'react-native-svg';

import type { DsReactLocalIconProps } from '../ds-react-local-icon-props';

/** DS — React `chart-column-alt-fill` (generated from Figma SVG export). */
export function DsReactIconChartColumnAltFill({ size, color }: DsReactLocalIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M10.842 2.04102C9.69078 2.04102 8.75754 2.97425 8.75754 4.12545V21.959H15.2425V4.12545C15.2425 2.97425 14.3092 2.04102 13.158 2.04102H10.842Z"
        fill={color}
      />
      <Path
        d="M19.8745 7.59952H16.6321V21.959H19.8745C21.0258 21.959 21.959 21.0258 21.959 19.8745V9.68396C21.959 8.53275 21.0258 7.59952 19.8745 7.59952Z"
        fill={color}
      />
      <Path
        d="M4.12545 12.2316C2.97425 12.2316 2.04102 13.1648 2.04102 14.316V19.8745C2.04102 21.0258 2.97425 21.959 4.12545 21.959H7.36791V12.2316H4.12545Z"
        fill={color}
      />
    </Svg>
  );
}
