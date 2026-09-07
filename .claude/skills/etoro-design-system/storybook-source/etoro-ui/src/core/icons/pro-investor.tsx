import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

import { IconProps } from './models/icon-props';

function ProInvestor({ size = 18 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <Defs>
        <LinearGradient id="proInvestorGradient" x1="1.35" y1="3.17" x2="16.65" y2="14.83" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#FFE3A3" />
          <Stop offset="0.45" stopColor="#F1C056" />
          <Stop offset="1" stopColor="#D9972E" />
        </LinearGradient>
      </Defs>
      <Path
        d="M4.26 14.08c-.36 0-.69-.23-.81-.58L1.42 7.7c-.26-.74.63-1.3 1.2-.76l3.05 2.85 2.68-5.84c.27-.6 1.12-.6 1.4 0l2.67 5.84 3.06-2.85c.57-.54 1.45.02 1.19.76l-2.02 5.8a.87.87 0 0 1-.82.58H4.26Z"
        fill="url(#proInvestorGradient)"
      />
    </Svg>
  );
}

export default ProInvestor;
