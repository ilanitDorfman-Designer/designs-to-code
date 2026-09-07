import { Path, Svg } from 'react-native-svg';

import type { DsReactLocalIconProps } from '../ds-react-local-icon-props';

/** DS — React `play` (generated from Figma SVG export). */
export function DsReactIconPlay({ size, color }: DsReactLocalIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 5.31482C3 2.82616 5.69589 1.27235 7.84929 2.51985L19.3891 9.20502C21.537 10.4493 21.537 13.5507 19.3891 14.795L7.84928 21.4801C5.69588 22.7276 3 21.1738 3 18.6852L3 5.31482ZM7.15535 3.71769C5.92484 3.00484 4.38433 3.89273 4.38433 5.31482L4.38433 18.6852C4.38433 20.1073 5.92483 20.9952 7.15535 20.2823L18.6951 13.5971C19.9225 12.8861 19.9225 11.1139 18.6951 10.4029L7.15535 3.71769Z"
        fill={color}
      />
    </Svg>
  );
}
