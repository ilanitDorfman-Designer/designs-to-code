import Svg, { Circle, Path } from 'react-native-svg';

import { useEtoroTheme } from '../hooks/use-etoro-theme';
import { IconProps } from './models/icon-props';

export function WifiSlow({ size = 24, color }: IconProps) {
  const { colors } = useEtoroTheme();
  const strokeColor = color || colors.textBright;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M1 9C3.59231 6.40769 7.11538 4.84615 11 4.84615C14.8846 4.84615 18.4077 6.40769 21 9"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="4 3"
      />
      <Path
        d="M5.38462 12.0538C7.06923 10.3692 9.40769 9.30769 12 9.30769C14.5923 9.30769 16.9308 10.3692 18.6154 12.0538"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="4 3"
      />
      <Path
        d="M8.41538 14.9692C9.4 14.1692 10.6385 13.6769 12 13.6769C13.3615 13.6769 14.6 14.1692 15.5846 14.9692"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="12" cy="19.4615" r="1.2308" fill={strokeColor} />
    </Svg>
  );
}
