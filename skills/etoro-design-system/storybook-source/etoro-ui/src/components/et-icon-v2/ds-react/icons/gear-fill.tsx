import { Path, Svg } from 'react-native-svg';

import type { DsReactLocalIconProps } from '../ds-react-local-icon-props';

/** DS — React `gear-fill` (generated from Figma SVG export). */
export function DsReactIconGearFill({ size, color }: DsReactLocalIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.0762 2.56856C11.2656 1.88164 12.7324 1.88182 13.9219 2.56856L19.2051 5.61934C20.3944 6.30637 21.1279 7.57615 21.1279 8.95039V15.05C21.1279 16.4242 20.3944 17.694 19.2051 18.3811L13.9219 21.4318C12.7323 22.1186 11.2656 22.1188 10.0762 21.4318L4.79297 18.3811C3.60373 17.694 2.87109 16.4242 2.87109 15.05V8.95039C2.87109 7.57619 3.60368 6.30639 4.79297 5.61934L10.0762 2.56856ZM12 8.58418C10.1134 8.58418 8.58416 10.1136 8.58398 12.0002C8.5841 13.8868 10.1133 15.4162 12 15.4162C13.8865 15.416 15.4159 13.8867 15.416 12.0002C15.4158 10.1137 13.8865 8.58435 12 8.58418Z"
        fill={color}
      />
    </Svg>
  );
}
