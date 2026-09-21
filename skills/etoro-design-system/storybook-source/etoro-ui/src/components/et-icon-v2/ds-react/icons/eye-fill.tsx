import { Path, Svg } from 'react-native-svg';

import type { DsReactLocalIconProps } from '../ds-react-local-icon-props';

/** DS — React `eye-fill` (generated from Figma SVG export). */
export function DsReactIconEyeFill({ size, color }: DsReactLocalIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9.44186 12C9.44186 10.5846 10.5846 9.44187 12 9.44187C13.4154 9.44187 14.5581 10.5846 14.5581 12C14.5581 13.4154 13.4154 14.5581 12 14.5581C10.5846 14.5581 9.44186 13.4154 9.44186 12Z"
        fill={color}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.19292 10.8904C5.55919 1.51716 18.4408 1.51716 21.8071 10.8904C22.0643 11.6067 22.0643 12.3933 21.8071 13.1096C18.4408 22.4829 5.55919 22.4829 2.19292 13.1096C1.93569 12.3933 1.93569 11.6067 2.19292 10.8904ZM12 8.04652C9.81398 8.04652 8.04651 9.81399 8.04651 12C8.04651 14.186 9.81398 15.9535 12 15.9535C14.186 15.9535 15.9535 14.186 15.9535 12C15.9535 9.81399 14.186 8.04652 12 8.04652Z"
        fill={color}
      />
    </Svg>
  );
}
