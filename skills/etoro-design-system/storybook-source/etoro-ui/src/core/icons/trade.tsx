import Svg, { Circle, Path } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

export function Trade({ size = 30, color = 'white' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 31 30" fill="none">
      <Path d="M4.13086 19.9648L4.13086 11.4214" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M9.05105 16.9994L9.02539 3.51562" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M13.9443 10.2574L13.9443 5.50244" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx="19.9909" cy="19.3738" r="7.15745" stroke={color} strokeWidth="1.8" />
      <Path d="M16.6572 19.3746L23.3244 19.3746M19.9908 16.041L19.9908 22.7082" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}
