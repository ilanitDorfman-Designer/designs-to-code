import { Path, Svg } from 'react-native-svg';

import type { DsReactLocalIconProps } from '../ds-react-local-icon-props';

/** DS — React `check-circle-fill` (generated from Figma SVG export). */
export function DsReactIconCheckCircleFill({ size, color }: DsReactLocalIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C17.5227 2.00005 22 6.47728 22 12C22 17.5228 17.5227 21.9999 12 22C6.47721 22 2 17.5228 2 12C2.00005 6.47725 6.47723 2 12 2ZM16.4785 8.7207C16.2442 8.48648 15.8642 8.48641 15.6299 8.7207L10.3467 14.0029L8.375 12C8.14265 11.7639 7.76256 11.76 7.52637 11.9922C7.29053 12.2245 7.28748 12.6047 7.51953 12.8408L9.91602 15.2764C10.0281 15.3903 10.1811 15.4553 10.3408 15.4561C10.5006 15.4567 10.6545 15.3931 10.7676 15.2803L16.4785 9.56836C16.7125 9.3341 16.7125 8.95496 16.4785 8.7207Z"
        fill={color}
      />
    </Svg>
  );
}
