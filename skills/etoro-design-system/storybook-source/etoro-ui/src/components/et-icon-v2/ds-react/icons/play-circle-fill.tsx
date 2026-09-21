import { Path, Svg } from 'react-native-svg';

import type { DsReactLocalIconProps } from '../ds-react-local-icon-props';

/** DS — React `play-circle-fill` (generated from Figma SVG export). */
export function DsReactIconPlayCircleFill({ size, color }: DsReactLocalIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C17.5228 2 21.9999 6.47721 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2.00007 6.47721 6.47719 2 12 2ZM11.5391 8.39941C10.4921 7.79121 9.17778 8.54458 9.17773 9.75293V14.2471C9.17773 15.4555 10.492 16.2089 11.5391 15.6006L15.4062 13.3535C16.4458 12.7493 16.4456 11.2518 15.4062 10.6475L11.5391 8.39941Z"
        fill={color}
      />
    </Svg>
  );
}
