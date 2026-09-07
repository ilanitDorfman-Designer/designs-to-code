import { Path, Svg } from 'react-native-svg';

import type { DsReactLocalIconProps } from '../ds-react-local-icon-props';

/** DS — React `edit` (generated from Figma SVG export). */
export function DsReactIconEdit({ size, color }: DsReactLocalIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.8943 4.4523C16.8047 3.51707 18.301 3.49692 19.2364 4.40702C20.1712 5.31675 20.1926 6.81176 19.284 7.74754L9.18895 17.9838C8.10405 19.1007 6.67302 19.8245 5.13183 20.0406C4.43197 20.1384 3.81883 19.5584 3.88367 18.8503C4.029 17.2651 4.7139 15.7778 5.82424 14.6371L15.8943 4.4523ZM6.75541 15.5439C5.91369 16.4087 5.37296 17.5191 5.20804 18.71C6.36556 18.4936 7.43308 17.9245 8.25569 17.0777L16.3316 8.92139L14.8041 7.43472L6.75541 15.5439ZM18.3306 5.33835C17.9097 4.92869 17.2352 4.93817 16.8255 5.35908L15.7111 6.50258L17.2376 7.98909L18.3515 6.84254C18.7603 6.42144 18.7512 5.74771 18.3306 5.33835Z"
        fill={color}
      />
    </Svg>
  );
}
