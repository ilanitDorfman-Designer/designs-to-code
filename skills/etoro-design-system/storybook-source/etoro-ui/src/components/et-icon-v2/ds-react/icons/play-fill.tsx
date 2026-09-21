import { Path, Svg } from 'react-native-svg';

import type { DsReactLocalIconProps } from '../ds-react-local-icon-props';

/** DS — React `play-fill` (generated from Figma SVG export). */
export function DsReactIconPlayFill({ size, color }: DsReactLocalIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 5.31482C3 2.82616 5.69589 1.27235 7.84929 2.51985L19.3891 9.20502C21.537 10.4493 21.537 13.5507 19.3891 14.795L7.84928 21.4801C5.69588 22.7276 3 21.1738 3 18.6852L3 5.31482Z"
        fill={color}
      />
    </Svg>
  );
}
