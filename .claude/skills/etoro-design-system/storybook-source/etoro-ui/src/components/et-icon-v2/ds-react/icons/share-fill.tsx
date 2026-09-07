import { Path, Svg } from 'react-native-svg';

import type { DsReactLocalIconProps } from '../ds-react-local-icon-props';

/** DS — React `share-fill` (generated from Figma SVG export). */
export function DsReactIconShareFill({ size, color }: DsReactLocalIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12.8935 6.64896C12.9446 4.92285 15.0218 4.11474 16.231 5.3224L21.8314 10.9111C22.3904 11.469 22.3956 12.3728 21.8432 12.9372L16.2393 18.663L16.2334 18.6689C15.0033 19.911 12.8807 19.0523 12.8807 17.2896V15.1685C10.6177 14.5976 7.71105 15.1288 4.35175 17.865C3.85046 18.2731 3.13806 18.2969 2.61034 17.9236C2.08267 17.5501 1.86834 16.8704 2.08652 16.2619C2.13148 16.1364 2.18181 16.0041 2.23769 15.8658H2.23886C2.64959 14.8282 3.22694 13.7926 3.98378 12.8189L3.99316 12.8072C6.0119 10.2648 8.9533 8.65719 12.8689 8.39506V6.90209C12.869 6.81702 12.8786 6.73257 12.8935 6.64896Z"
        fill={color}
      />
    </Svg>
  );
}
