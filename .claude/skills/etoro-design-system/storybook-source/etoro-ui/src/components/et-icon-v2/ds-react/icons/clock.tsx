import { Path, Svg } from 'react-native-svg';

import type { DsReactLocalIconProps } from '../ds-react-local-icon-props';

/** DS — React `clock` (generated from Figma SVG export). */
export function DsReactIconClock({ size, color }: DsReactLocalIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M11.3617 6.89362C11.3617 6.54109 11.6475 6.25532 12 6.25532C12.3525 6.25532 12.6383 6.54109 12.6383 6.89362V12C12.6383 12.1196 12.6047 12.2369 12.5413 12.3383L10.4136 15.7426C10.2268 16.0415 9.83298 16.1324 9.53404 15.9455C9.23511 15.7587 9.14423 15.3649 9.33107 15.066L11.3617 11.8169V6.89362Z"
        fill={color}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM3.2766 12C3.2766 7.1822 7.1822 3.2766 12 3.2766C16.8178 3.2766 20.7234 7.1822 20.7234 12C20.7234 16.8178 16.8178 20.7234 12 20.7234C7.1822 20.7234 3.2766 16.8178 3.2766 12Z"
        fill={color}
      />
    </Svg>
  );
}
