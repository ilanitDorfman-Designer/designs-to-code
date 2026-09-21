import { Path, Svg } from 'react-native-svg';

import type { DsReactLocalIconProps } from '../ds-react-local-icon-props';

/** DS — React `xmark-circle` (generated from Figma SVG export). */
export function DsReactIconXmarkCircle({ size, color }: DsReactLocalIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15.0045 15.0045C14.7553 15.2538 14.3511 15.2538 14.1018 15.0045L12 12.9027L9.89815 15.0045C9.64887 15.2538 9.24473 15.2538 8.99546 15.0045C8.74619 14.7553 8.74619 14.3511 8.99546 14.1018L11.0973 12L8.99546 9.89816C8.74619 9.64889 8.74619 9.24474 8.99546 8.99547C9.24473 8.7462 9.64888 8.7462 9.89815 8.99547L12 11.0973L14.1018 8.99546C14.3511 8.74619 14.7553 8.74619 15.0045 8.99546C15.2538 9.24473 15.2538 9.64888 15.0045 9.89815L12.9027 12L15.0045 14.1019C15.2538 14.3511 15.2538 14.7553 15.0045 15.0045Z"
        fill={color}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM12 3.2766C7.1822 3.2766 3.2766 7.1822 3.2766 12C3.2766 16.8178 7.1822 20.7234 12 20.7234C16.8178 20.7234 20.7234 16.8178 20.7234 12C20.7234 7.1822 16.8178 3.2766 12 3.2766Z"
        fill={color}
      />
    </Svg>
  );
}
