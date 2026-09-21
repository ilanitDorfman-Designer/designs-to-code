import { Path, Svg } from 'react-native-svg';

import type { DsReactLocalIconProps } from '../ds-react-local-icon-props';

/** DS — React `location-pin-fill` (generated from Figma SVG export). */
export function DsReactIconLocationPinFill({ size, color }: DsReactLocalIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2.01855C16.4873 2.01855 20.125 5.65627 20.125 10.1436C20.1249 14.0507 17.56 16.8942 15.9111 18.7227L15.7676 18.8828C15.1342 19.5865 13.6699 20.944 12.9355 21.6172C12.4058 22.1028 11.5942 22.1028 11.0645 21.6172C10.33 20.944 8.86578 19.5865 8.23242 18.8828L8.08203 18.7158C6.36007 16.806 3.87509 14.0501 3.875 10.1436C3.875 5.65625 7.5127 2.01856 12 2.01855ZM12 7.125C10.3334 7.12516 8.98242 8.47693 8.98242 10.1436C8.98255 11.8101 10.3335 13.161 12 13.1611C13.6666 13.1611 15.0184 11.8102 15.0186 10.1436C15.0186 8.47683 13.6667 7.125 12 7.125Z"
        fill={color}
      />
    </Svg>
  );
}
