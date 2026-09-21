import Svg, { Path } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

export function PriceAlert({ size = 30, color = 'white' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 31 30" fill="none">
      <Path
        d="M14.8955 7.63788C13.3604 6.65521 11.5277 6.31205 9.71063 6.67081C7.89357 7.02956 6.32714 8.02783 5.26196 9.50964C4.21246 10.9759 3.82085 12.7228 4.16546 14.4386L4.87036 18.0261C5.10532 19.2584 4.99567 20.553 4.52574 21.7541C4.38476 22.1128 4.24378 22.5028 4.11847 22.9395C4.07148 23.0799 4.11847 23.2203 4.21246 23.3139C4.32211 23.423 4.47875 23.4698 4.65106 23.4386L20.7383 20.319C20.9106 20.2878 21.0359 20.1787 21.0986 20.0383C21.1456 19.8979 21.1299 19.7575 21.0359 19.6483C20.7383 19.2896 20.472 18.9776 20.2057 18.6969C19.3285 17.7454 18.7333 16.6067 18.4826 15.3745C18.4826 15.3745 17.9501 12.676 17.7778 11.7869C17.4488 10.0712 16.4306 8.60496 14.8955 7.63788Z"
        stroke={color}
        strokeWidth="1.8"
        strokeMiterlimit="10"
      />
      <Path
        d="M19.5059 6.32812C19.9858 6.76834 20.5991 7.42232 21.0762 8.24402C21.5113 8.99346 21.8658 10.2358 21.8368 10.876"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M22.5156 3.6499C23.2175 4.299 24.114 5.2627 24.8094 6.47178C25.4437 7.57456 25.9566 9.40042 25.9102 10.34"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M7.91296 5.88177C7.73669 4.8057 7.91285 3.80266 9.05333 3.47609C10.3835 3.24365 10.9341 4.30572 11.0956 5.38134"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M15.9571 24.4565C15.6505 25.655 14.5635 26.5329 13.2814 26.5329C12.3617 26.5329 11.5534 26.087 11.0518 25.3902"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
