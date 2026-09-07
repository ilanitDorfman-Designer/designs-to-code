import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

import { useEtoroTheme } from '../hooks';
import { IconProps } from './models/icon-props';

function ToriiIcon({ size = 20, color }: IconProps) {
  const { colors } = useEtoroTheme();
  const fillColor = color || colors.actionBrandText;

  return (
    <Svg width={size} height={size} viewBox="2 1 22 20">
      <Defs>
        <LinearGradient id="toriiGrad" x1="0" y1="0" x2="0" y2="28" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#6EFF8B" />
          <Stop offset="1" stopColor="#4ECB71" />
        </LinearGradient>
      </Defs>
      <Path d="M9 5C9.6 9.4 12 12 16.5 12.6C12 13.2 9.6 15.8 9 20.2C8.4 15.8 6 13.2 1.5 12.6C6 12 8.4 9.4 9 5Z" fill={fillColor} />
      <Path
        d="M20 1C20.4 3.8 21.8 5.2 24.5 5.6C21.8 6 20.4 7.4 20 10.2C19.6 7.4 18.2 6 15.5 5.6C18.2 5.2 19.6 3.8 20 1Z"
        fill={fillColor}
        opacity={0.8}
      />
      <Path
        d="M22.5 14C22.7 15.6 23.5 16.4 25 16.6C23.5 16.8 22.7 17.6 22.5 19.2C22.3 17.6 21.5 16.8 20 16.6C21.5 16.4 22.3 15.6 22.5 14Z"
        fill={fillColor}
        opacity={0.6}
      />
    </Svg>
  );
}

export default ToriiIcon;
