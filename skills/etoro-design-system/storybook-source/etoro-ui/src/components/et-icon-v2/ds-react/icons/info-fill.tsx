import { Path, Svg } from 'react-native-svg';

import type { DsReactLocalIconProps } from '../ds-react-local-icon-props';

/** DS — React `info-fill` (generated from Figma SVG export). */
export function DsReactIconInfoFill({ size, color }: DsReactLocalIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.0332 12C2.0332 17.5038 6.49488 21.9654 11.9986 21.9654C17.5024 21.9654 21.9641 17.5038 21.9641 12C21.9641 6.49625 17.5024 2.03457 11.9986 2.03457C6.49488 2.03457 2.0332 6.49625 2.0332 12ZM11.3625 11.1519L11.3625 16.2406C11.3625 16.5919 11.6473 16.8767 11.9986 16.8767C12.3499 16.8767 12.6347 16.5919 12.6347 16.2406L12.6347 11.1519C12.6347 10.8006 12.3499 10.5158 11.9986 10.5158C11.6473 10.5158 11.3625 10.8006 11.3625 11.1519ZM11.1505 8.18345C11.1505 8.65186 11.5302 9.03157 11.9986 9.03157C12.467 9.03157 12.8468 8.65186 12.8468 8.18345C12.8468 7.71505 12.467 7.33533 11.9986 7.33533C11.5302 7.33533 11.1505 7.71505 11.1505 8.18345Z"
        fill={color}
      />
    </Svg>
  );
}
