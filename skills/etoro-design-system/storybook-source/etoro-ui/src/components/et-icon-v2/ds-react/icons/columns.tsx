import { Path, Svg } from 'react-native-svg';

import type { DsReactLocalIconProps } from '../ds-react-local-icon-props';

/** DS — React `columns` (generated from Figma SVG export). */
export function DsReactIconColumns({ size, color }: DsReactLocalIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M16.9023 3.50488C18.7518 3.59842 20.2227 5.12727 20.2227 7V17C20.2227 18.8727 18.7518 20.4016 16.9023 20.4951L16.7227 20.5H7.27734C5.34435 20.5 3.77734 18.933 3.77734 17V7C3.77734 5.067 5.34435 3.5 7.27734 3.5H16.7227L16.9023 3.50488ZM7.27734 5C6.17278 5 5.27734 5.89543 5.27734 7V17C5.27734 18.1046 6.17277 19 7.27734 19H8.75V5H7.27734ZM15.25 19H16.7227C17.8272 19 18.7227 18.1046 18.7227 17V7C18.7227 5.89543 17.8272 5 16.7227 5H15.25V19ZM10.25 19H13.75V5H10.25V19Z"
        fill={color}
      />
    </Svg>
  );
}
