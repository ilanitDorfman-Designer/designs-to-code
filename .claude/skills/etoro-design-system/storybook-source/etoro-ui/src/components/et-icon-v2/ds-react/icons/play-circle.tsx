import { Path, Svg } from 'react-native-svg';

import type { DsReactLocalIconProps } from '../ds-react-local-icon-props';

/** DS — React `play-circle` (generated from Figma SVG export). */
export function DsReactIconPlayCircle({ size, color }: DsReactLocalIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.4741 8.18487C10.3677 7.54006 8.97873 8.33819 8.97873 9.61882V14.3815C8.97873 15.6621 10.3676 16.4602 11.4741 15.8154L15.5603 13.4341C16.659 12.7938 16.659 11.2065 15.5603 10.5662L11.4741 8.18487ZM10.2553 9.61882C10.2553 9.32322 10.5759 9.139 10.8313 9.28783L14.9175 11.6692C15.1711 11.817 15.1711 12.1833 14.9175 12.3311L10.8313 14.7125C10.5759 14.8613 10.2553 14.6771 10.2553 14.3815V9.61882Z"
        fill={color}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2.00012C6.47715 2.00012 2 6.47727 2 12.0001C2 17.523 6.47715 22.0001 12 22.0001C17.5228 22.0001 22 17.523 22 12.0001C22 6.47727 17.5228 2.00012 12 2.00012ZM3.2766 12.0001C3.2766 7.18232 7.1822 3.27672 12 3.27672C16.8178 3.27672 20.7234 7.18232 20.7234 12.0001C20.7234 16.8179 16.8178 20.7235 12 20.7235C7.1822 20.7235 3.2766 16.8179 3.2766 12.0001Z"
        fill={color}
      />
    </Svg>
  );
}
