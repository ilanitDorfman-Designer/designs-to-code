import Svg, { Path } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

export function Trash({ size = 30, color = 'white' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 31 30" fill="none">
      <Path
        d="M7.07422 11.1L8.95313 24.3311C9.14322 25.7137 10.3184 26.7333 11.7182 26.7333H15.6584H19.5986C20.9811 26.7333 22.1736 25.7137 22.3637 24.3311L24.2195 11.0742"
        stroke={color}
        strokeWidth="1.8"
        strokeMiterlimit="10"
        strokeLinecap="round"
      />
      <Path d="M5.71777 7.2207H25.5743" stroke={color} strokeWidth="1.8" strokeMiterlimit="10" strokeLinecap="round" />
      <Path d="M12.5215 3.26562H18.7947" stroke={color} strokeWidth="1.8" strokeMiterlimit="10" strokeLinecap="round" />
    </Svg>
  );
}
