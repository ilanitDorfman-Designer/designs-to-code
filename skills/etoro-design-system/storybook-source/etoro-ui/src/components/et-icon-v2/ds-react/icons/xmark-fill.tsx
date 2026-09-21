import { Path, Svg } from 'react-native-svg';

import type { DsReactLocalIconProps } from '../ds-react-local-icon-props';

/** DS — React `xmark-fill` (generated from Figma SVG export). */
export function DsReactIconXmarkFill({ size, color }: DsReactLocalIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18.5129 3.94024C18.9389 3.51422 19.6298 3.51423 20.0558 3.94024C20.4818 4.36626 20.4818 5.05719 20.0558 5.48321L13.5392 11.9988L20.0558 18.5154C20.4818 18.9415 20.4819 19.6324 20.0558 20.0584C19.6298 20.4841 18.9388 20.4843 18.5129 20.0584L11.9972 13.5418L5.48161 20.0584C5.05565 20.4843 4.36467 20.4842 3.93864 20.0584C3.51262 19.6324 3.51266 18.9415 3.93864 18.5154L10.4543 11.9988L3.93864 5.48321C3.51283 5.05724 3.51288 4.36623 3.93864 3.94024C4.36463 3.51427 5.05558 3.51435 5.48161 3.94024L11.9972 10.4559L18.5129 3.94024Z"
        fill={color}
      />
    </Svg>
  );
}
