import { ClipPath, Defs, G, Path, Rect, Svg } from 'react-native-svg';

import type { DsReactLocalIconProps } from '../ds-react-local-icon-props';

/** DS — React `send-fill` (generated from Figma SVG export). */
export function DsReactIconSendFill({ size, color }: DsReactLocalIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G clipPath="url(#ds_send_fill_0)">
        <Path
          d="M19.7622 9.52709C21.8485 10.5259 21.8216 13.4857 19.7511 14.4884L7.86688 20.2429C5.54958 21.365 3.11071 18.9903 4.16962 16.6452L5.90757 12.6293C5.90768 12.629 5.90747 12.6295 5.90757 12.6293L11.511 12.6286C11.8577 12.6286 12.1388 12.3475 12.1388 12.0007C12.1388 11.654 11.8577 11.3729 11.511 11.3729L5.90063 11.3729L4.08142 7.40179L4.07566 7.38883C3.06884 5.05314 5.51002 2.7041 7.80487 3.80272L19.7622 9.52709Z"
          fill={color}
        />
      </G>
      <Defs>
        <ClipPath id="ds_send_fill_0">
          <Rect width="24" height="24" fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
