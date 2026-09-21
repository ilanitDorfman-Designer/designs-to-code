import { Path, Svg } from 'react-native-svg';

import type { DsReactLocalIconProps } from '../ds-react-local-icon-props';

/** DS — React `alert-circle-fill` (generated from Figma SVG export). */
export function DsReactIconAlertCircleFill({ size, color }: DsReactLocalIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM11.3617 12.8511L11.3617 7.74468C11.3617 7.39216 11.6475 7.10638 12 7.10638C12.3525 7.10638 12.6383 7.39216 12.6383 7.74468L12.6383 12.8511C12.6383 13.2036 12.3525 13.4894 12 13.4894C11.6475 13.4894 11.3617 13.2036 11.3617 12.8511ZM11.1489 15.8298C11.1489 15.3598 11.53 14.9787 12 14.9787C12.47 14.9787 12.8511 15.3598 12.8511 15.8298C12.8511 16.2998 12.47 16.6809 12 16.6809C11.53 16.6809 11.1489 16.2998 11.1489 15.8298Z"
        fill={color}
      />
    </Svg>
  );
}
