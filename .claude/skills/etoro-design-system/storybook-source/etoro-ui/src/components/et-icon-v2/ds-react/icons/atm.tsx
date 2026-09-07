import { Path, Svg } from 'react-native-svg';

import type { DsReactLocalIconProps } from '../ds-react-local-icon-props';

/** DS — React `atm` (generated from Figma SVG export). */
export function DsReactIconAtm({ size, color }: DsReactLocalIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.79688 15.168H7.36621L6.86816 13.666H4.37012L3.84473 15.168H2.42383L4.75977 8.83105H6.5332L8.79688 15.168ZM4.75977 12.5615H6.49707L5.69141 10.1348H5.61035L4.75977 12.5615Z"
        fill={color}
      />
      <Path d="M13.6738 10.0449H11.7812V15.168H10.3516V10.0449H8.45898V8.83203H13.6738V10.0449Z" fill={color} />
      <Path
        d="M18.082 13.2314L18.1455 13.5205H18.1816L18.2627 13.2314L19.874 8.83203H21.5762V15.168H20.2451V12.8418L20.3447 10.7871H20.3086L18.8242 15.168H17.5205L16.0176 10.7871H15.9814L16.0898 12.8418V15.168H14.7598V8.83203H16.5605L18.082 13.2314Z"
        fill={color}
      />
    </Svg>
  );
}
