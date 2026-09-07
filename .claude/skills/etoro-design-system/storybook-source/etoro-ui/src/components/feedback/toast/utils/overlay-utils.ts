import { ColorValue } from 'react-native';

export function getOverlayColors(): readonly [ColorValue, ColorValue, ...ColorValue[]] {
  return ['rgba(255, 255, 255, 0.4)', 'rgba(44, 44, 44, 0)'];
}
