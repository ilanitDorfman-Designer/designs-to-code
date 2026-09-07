import { Path, Svg } from 'react-native-svg';

import type { DsReactLocalIconProps } from '../ds-react-local-icon-props';

/** DS — React `star-fill` (filled counterpart for the regular star asset). */
export function DsReactIconStarFill({ size, color }: DsReactLocalIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M10.3889 4.57089C10.9721 3.14304 13.028 3.14304 13.6111 4.57089L15.1793 8.41051L19.3792 8.69112C20.94 8.79554 21.5752 10.7172 20.3747 11.7037L17.1441 14.357L18.1717 18.3708C18.5533 19.8628 16.8898 21.0511 15.5646 20.2331L11.9995 18.0318L8.43547 20.2331C7.11018 21.0512 5.44671 19.8628 5.82835 18.3708L6.855 14.357L3.62529 11.7037C2.4248 10.7172 3.05994 8.7955 4.62086 8.69112L8.81976 8.41051L10.3889 4.57089Z"
        fill={color}
      />
    </Svg>
  );
}
