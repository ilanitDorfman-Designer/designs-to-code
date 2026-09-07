import Svg, { Rect } from 'react-native-svg';

import { useEtoroTheme } from '../hooks/use-etoro-theme';
import { IconProps } from './models/icon-props';

export function ErrorIcon({ size = 24, fill }: IconProps) {
  const { colors } = useEtoroTheme();
  return (
    <Svg width={size} height={size} viewBox="0 0 3 9" fill="none">
      <Rect x={0.1} y={-2} width={2.50002} height={8.75005} rx={1.25001} fill={fill || colors.textBright} />
      <Rect x={0.1} y={7.5} width={2.50002} height={2.50002} rx={1.25001} fill={fill || colors.textBright} />
    </Svg>
  );
}
