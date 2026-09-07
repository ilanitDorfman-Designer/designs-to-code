import { Path, Svg } from 'react-native-svg';

import type { DsReactLocalIconProps } from '../ds-react-local-icon-props';

/** DS — React `bookmark` (generated from Figma SVG export). */
export function DsReactIconBookmark({ size, color }: DsReactLocalIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M10.5059 16.5657C11.3809 15.7392 12.7482 15.7353 13.6279 16.5569L17.4629 20.1389C17.7697 20.425 18.2705 20.207 18.2705 19.7874V6.11938C18.2705 5.1917 17.5184 4.43897 16.5908 4.43872H7.62012C6.69228 4.43872 5.93945 5.19155 5.93945 6.11938V19.7659C5.93957 20.1868 6.44296 20.4035 6.74902 20.1145L10.5059 16.5657ZM19.71 19.7874C19.71 21.4664 17.7067 22.3367 16.4795 21.1907L12.6445 17.6096C12.3204 17.3069 11.8165 17.308 11.4941 17.6125L7.73828 21.1614C6.51395 22.3181 4.50012 21.4501 4.5 19.7659V6.11938C4.5 4.39626 5.89699 2.99927 7.62012 2.99927H16.5908C18.3137 2.99952 19.71 4.39641 19.71 6.11938V19.7874Z"
        fill={color}
      />
    </Svg>
  );
}
