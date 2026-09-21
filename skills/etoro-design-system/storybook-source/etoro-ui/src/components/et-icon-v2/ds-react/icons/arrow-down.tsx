import { Path, Svg } from 'react-native-svg';

import type { DsReactLocalIconProps } from '../ds-react-local-icon-props';

/** DS — React `arrow-down` (generated from Figma SVG export). */
export function DsReactIconArrowDown({ size, color }: DsReactLocalIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M7.53033 13.9697C7.23744 13.6768 6.76256 13.6768 6.46967 13.9697C6.17678 14.2626 6.17678 14.7374 6.46967 15.0303L11.4697 20.0303C11.7626 20.3232 12.2374 20.3232 12.5303 20.0303L17.5303 15.0303C17.8232 14.7374 17.8232 14.2626 17.5303 13.9697C17.2374 13.6768 16.7626 13.6768 16.4697 13.9697L12.75 17.6893V4.5C12.75 4.08579 12.4142 3.75 12 3.75C11.5858 3.75 11.25 4.08579 11.25 4.5V17.6893L7.53033 13.9697Z"
        fill={color}
      />
    </Svg>
  );
}
