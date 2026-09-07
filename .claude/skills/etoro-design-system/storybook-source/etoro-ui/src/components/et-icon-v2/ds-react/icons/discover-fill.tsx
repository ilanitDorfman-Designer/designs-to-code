import { Path, Svg } from 'react-native-svg';

import type { DsReactLocalIconProps } from '../ds-react-local-icon-props';

/** DS — React `discover-fill` (generated from Figma SVG export). */
export function DsReactIconDiscoverFill({ size, color }: DsReactLocalIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.0146 2.01465C17.5377 2.01478 22.0155 6.49257 22.0156 12.0156C22.0155 17.5387 17.5377 22.0165 12.0146 22.0166C6.49148 22.0166 2.0138 17.5388 2.01367 12.0156C2.0138 6.49249 6.49148 2.01465 12.0146 2.01465ZM16.499 8.70508C16.8902 7.92382 16.0566 7.09685 15.2783 7.49414L11.3438 9.5498C10.553 9.95348 9.91089 10.5986 9.51172 11.3916L7.52441 15.3203C7.14928 16.0661 7.94064 16.8595 8.6875 16.4863L12.6094 14.5176C13.4168 14.1141 14.0722 13.4593 14.4766 12.6523L16.499 8.70508Z"
        fill={color}
      />
    </Svg>
  );
}
