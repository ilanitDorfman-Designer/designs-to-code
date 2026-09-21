import { Path, Svg } from 'react-native-svg';

import type { DsReactLocalIconProps } from '../ds-react-local-icon-props';

/** DS — React `arrow-down-left-small` (generated from Figma SVG export). */
export function DsReactIconArrowDownLeftSmall({ size, color }: DsReactLocalIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6.12695 18.4053C5.71274 18.4053 5.37695 18.0695 5.37695 17.6553V9.65531C5.37695 9.2411 5.71274 8.90531 6.12695 8.90531C6.54117 8.90531 6.87695 9.2411 6.87695 9.65531V15.8446L17.3437 5.81435C17.6366 5.52145 18.1115 5.52145 18.4044 5.81435C18.6972 6.10724 18.6972 6.58211 18.4044 6.87501L7.93761 16.9053H14.127C14.5412 16.9053 14.877 17.2411 14.877 17.6553C14.877 18.0695 14.5412 18.4053 14.127 18.4053H6.12695Z"
        fill={color}
      />
    </Svg>
  );
}
