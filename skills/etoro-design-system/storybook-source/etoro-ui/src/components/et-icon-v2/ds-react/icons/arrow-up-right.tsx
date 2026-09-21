import { Path, Svg } from 'react-native-svg';

import type { DsReactLocalIconProps } from '../ds-react-local-icon-props';

/** DS — React `arrow-up-right` (generated from Figma SVG export). */
export function DsReactIconArrowUpRight({ size, color }: DsReactLocalIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M17.873 5.59467C18.2873 5.59468 18.623 5.93046 18.623 6.34468L18.623 14.3447C18.623 14.7589 18.2873 15.0947 17.873 15.0947C17.4588 15.0947 17.123 14.7589 17.123 14.3447L17.123 8.15534L6.65631 18.1856C6.36342 18.4785 5.88854 18.4785 5.59565 18.1856C5.30276 17.8927 5.30276 17.4179 5.59565 17.125L16.0624 7.09467L9.87305 7.09467C9.45883 7.09467 9.12305 6.75889 9.12305 6.34467C9.12305 5.93046 9.45883 5.59467 9.87305 5.59467L17.873 5.59467Z"
        fill={color}
      />
    </Svg>
  );
}
