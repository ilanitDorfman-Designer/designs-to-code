import { Path, Svg } from 'react-native-svg';

import type { DsReactLocalIconProps } from '../ds-react-local-icon-props';

/** DS — React `plus` (generated from Figma SVG export). */
export function DsReactIconPlus({ size, color }: DsReactLocalIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M10.916 19.8996C10.916 20.3138 11.2518 20.6496 11.666 20.6496C12.0802 20.6496 12.416 20.3138 12.416 19.8996V12.6496H19.666C20.0802 12.6496 20.416 12.3138 20.416 11.8996C20.416 11.4854 20.0802 11.1496 19.666 11.1496H12.416V3.8996C12.416 3.48538 12.0802 3.1496 11.666 3.1496C11.2518 3.1496 10.916 3.48538 10.916 3.8996V11.1496H3.66602C3.2518 11.1496 2.91602 11.4854 2.91602 11.8996C2.91602 12.3138 3.2518 12.6496 3.66602 12.6496H10.916V19.8996Z"
        fill={color}
      />
    </Svg>
  );
}
