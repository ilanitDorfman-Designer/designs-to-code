import { Path, Svg } from 'react-native-svg';

import type { DsReactLocalIconProps } from '../ds-react-local-icon-props';

/** DS — React `clock-fill` (generated from Figma SVG export). */
export function DsReactIconClockFill({ size, color }: DsReactLocalIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM12 6.25488C11.6477 6.25511 11.3623 6.5412 11.3623 6.89355V11.8174L9.33105 15.0664C9.14471 15.3652 9.23565 15.7585 9.53418 15.9453C9.83312 16.1321 10.2272 16.0411 10.4141 15.7422L12.542 12.3379C12.6052 12.2365 12.6387 12.1195 12.6387 12V6.89355C12.6386 6.54106 12.3525 6.25488 12 6.25488Z"
        fill={color}
      />
    </Svg>
  );
}
