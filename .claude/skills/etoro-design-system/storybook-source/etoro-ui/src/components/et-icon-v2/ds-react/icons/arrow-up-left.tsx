import { Path, Svg } from 'react-native-svg';

import type { DsReactLocalIconProps } from '../ds-react-local-icon-props';

/** DS — React `arrow-up-left` (generated from Figma SVG export). */
export function DsReactIconArrowUpLeft({ size, color }: DsReactLocalIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6.125 5.59468C5.71079 5.59468 5.375 5.93046 5.375 6.34468L5.375 14.3447C5.375 14.7589 5.71079 15.0947 6.125 15.0947C6.53921 15.0947 6.875 14.7589 6.875 14.3447L6.875 8.15534L17.3417 18.1856C17.6346 18.4785 18.1095 18.4785 18.4024 18.1856C18.6953 17.8927 18.6953 17.4179 18.4024 17.125L7.93566 7.09468L14.125 7.09468C14.5392 7.09468 14.875 6.75889 14.875 6.34468C14.875 5.93046 14.5392 5.59468 14.125 5.59468L6.125 5.59468Z"
        fill={color}
      />
    </Svg>
  );
}
