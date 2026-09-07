import { Path, Svg } from 'react-native-svg';

import type { DsReactLocalIconProps } from '../ds-react-local-icon-props';

/** DS — React `arrow-up` (generated from Figma SVG export). */
export function DsReactIconArrowUp({ size, color }: DsReactLocalIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M7.53033 10.0303C7.23744 10.3232 6.76256 10.3232 6.46967 10.0303C6.17678 9.73744 6.17678 9.26256 6.46967 8.96967L11.4697 3.96967C11.7626 3.67678 12.2374 3.67678 12.5303 3.96967L17.5303 8.96967C17.8232 9.26256 17.8232 9.73744 17.5303 10.0303C17.2374 10.3232 16.7626 10.3232 16.4697 10.0303L12.75 6.31066V19.5C12.75 19.9142 12.4142 20.25 12 20.25C11.5858 20.25 11.25 19.9142 11.25 19.5V6.31066L7.53033 10.0303Z"
        fill={color}
      />
    </Svg>
  );
}
