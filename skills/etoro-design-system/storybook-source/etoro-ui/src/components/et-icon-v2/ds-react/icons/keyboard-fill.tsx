import { Path, Svg } from 'react-native-svg';

import type { DsReactLocalIconProps } from '../ds-react-local-icon-props';

/** DS — React `keyboard-fill` (generated from Figma SVG export). */
export function DsReactIconKeyboardFill({ size, color }: DsReactLocalIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.1768 4.67771C21.0473 4.68151 22.5031 6.21946 22.5 8.04197L22.4854 15.998C22.4819 17.8209 21.0193 19.3532 19.1484 19.3496L4.82325 19.3213C2.95262 19.3173 1.49657 17.7797 1.50001 15.957L1.51465 8.00095C1.51843 6.17835 2.9809 4.64583 4.85157 4.64939L19.1768 4.67771ZM7.74317 14.4013C7.31245 14.4007 6.96182 14.7131 6.96094 15.0996C6.96029 15.486 7.30949 15.8 7.74024 15.8008L16.4199 15.8164C16.8504 15.8168 17.2001 15.5044 17.2012 15.1181C17.2021 14.7316 16.8528 14.4178 16.4219 14.417L7.74317 14.4013Z"
        fill={color}
      />
    </Svg>
  );
}
