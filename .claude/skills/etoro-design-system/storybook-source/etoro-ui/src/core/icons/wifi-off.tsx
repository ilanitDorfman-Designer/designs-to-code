import Svg, { Line, Path } from 'react-native-svg';

import { useEtoroTheme } from '../hooks/use-etoro-theme';
import { IconProps } from './models/icon-props';

export function WifiOff({ size = 24, color }: IconProps) {
  const { colors } = useEtoroTheme();
  const strokeColor = color || colors.textBright;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M1 9C1.83846 8.16154 2.81538 7.48462 3.89231 6.96923M23 9C20.4077 6.40769 16.8846 4.84615 13 4.84615C12.3231 4.84615 11.6615 4.89231 11.0154 4.98462M9.08539 9.91539C9.96616 9.53385 10.9615 9.30769 12 9.30769C14.5923 9.30769 16.9308 10.3692 18.6154 12.0538M5.38462 12.0538C5.92308 11.5154 6.52308 11.0385 7.16923 10.6308M8.79539 14.7108C9.71231 14.0538 10.8154 13.6769 12 13.6769C13.3615 13.6769 14.6 14.1692 15.5846 14.9692M12 18.2308C12.6769 18.2308 13.2308 18.7846 13.2308 19.4615C13.2308 20.1385 12.6769 20.6923 12 20.6923C11.3231 20.6923 10.7692 20.1385 10.7692 19.4615C10.7692 18.7846 11.3231 18.2308 12 18.2308Z"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Line x1="3" y1="3" x2="21" y2="21" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}
