import { Path, Svg } from 'react-native-svg';

import type { DsReactLocalIconProps } from '../ds-react-local-icon-props';

/** DS — React `eye` (generated from Figma SVG export). */
export function DsReactIconEye({ size, color }: DsReactLocalIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 8.04652C9.81398 8.04652 8.04651 9.81399 8.04651 12C8.04651 14.186 9.81398 15.9535 12 15.9535C14.186 15.9535 15.9535 14.186 15.9535 12C15.9535 9.81399 14.186 8.04652 12 8.04652ZM9.44186 12C9.44186 10.5846 10.5846 9.44187 12 9.44187C13.4154 9.44187 14.5581 10.5846 14.5581 12C14.5581 13.4154 13.4154 14.5581 12 14.5581C10.5846 14.5581 9.44186 13.4154 9.44186 12Z"
        fill={color}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M21.8071 10.8904C18.4408 1.51716 5.55919 1.51716 2.19292 10.8904C1.93569 11.6067 1.93569 12.3933 2.19292 13.1096C5.55919 22.4829 18.4408 22.4829 21.8071 13.1096C22.0643 12.3933 22.0643 11.6067 21.8071 10.8904ZM3.50615 11.362C6.4301 3.22041 17.5699 3.22041 20.4938 11.362C20.6416 11.7734 20.6416 12.2266 20.4938 12.638C17.5699 20.7796 6.4301 20.7796 3.50615 12.638C3.35842 12.2266 3.35842 11.7734 3.50615 11.362Z"
        fill={color}
      />
    </Svg>
  );
}
