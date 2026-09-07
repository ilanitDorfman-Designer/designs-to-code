import { Path, Svg } from 'react-native-svg';

import type { DsReactLocalIconProps } from '../ds-react-local-icon-props';

/** DS — React `arrow-down-right-small` (generated from Figma SVG export). */
export function DsReactIconArrowDownRightSmall({ size, color }: DsReactLocalIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M17.707 18.4053C18.1212 18.4053 18.457 18.0695 18.457 17.6553V9.65531C18.457 9.2411 18.1212 8.90531 17.707 8.90531C17.2928 8.90531 16.957 9.2411 16.957 9.65531V15.8446L6.49029 5.81435C6.1974 5.52145 5.72253 5.52145 5.42963 5.81435C5.13674 6.10724 5.13674 6.58211 5.42963 6.87501L15.8964 16.9053H9.70703C9.29282 16.9053 8.95703 17.2411 8.95703 17.6553C8.95703 18.0695 9.29282 18.4053 9.70703 18.4053H17.707Z"
        fill={color}
      />
    </Svg>
  );
}
