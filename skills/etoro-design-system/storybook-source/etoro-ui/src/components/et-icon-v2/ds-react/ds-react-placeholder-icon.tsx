import Svg, { Rect } from 'react-native-svg';

import { IconVariant } from '../api/types';

type Props = {
  size: number;
  color: string;
  /** When `filled`, draws a solid tile; otherwise outline (until the real SVG is registered). */
  variant?: IconVariant;
};

/** Shown until a Figma-exported SVG is registered for that `DsReactIconName` in `DS_REACT_ICON_REGISTRY`. */
export function DsReactPlaceholderIcon({ size, color, variant }: Props) {
  if (variant === IconVariant.Filled) {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Rect x={3} y={3} width={18} height={18} rx={2} fill={color} />
      </Svg>
    );
  }

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={3} y={3} width={18} height={18} rx={2} stroke={color} strokeWidth={1.5} />
    </Svg>
  );
}
