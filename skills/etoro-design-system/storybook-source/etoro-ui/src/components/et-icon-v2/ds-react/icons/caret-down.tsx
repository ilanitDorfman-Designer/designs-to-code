import { Path, Svg } from 'react-native-svg';

import type { DsReactLocalIconProps } from '../ds-react-local-icon-props';

/** DS — React `caret-down` (generated from Figma SVG export). */
export function DsReactIconCaretDown({ size, color }: DsReactLocalIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.4398 16.1217C11.3107 16.959 12.6875 16.959 13.5584 16.1217L19.1167 10.7782C20.4475 9.49894 19.5419 7.25037 17.696 7.25037L6.30217 7.25037C4.45628 7.25037 3.55073 9.49894 4.88145 10.7782L10.4398 16.1217ZM12.5189 15.0403C12.2286 15.3194 11.7696 15.3194 11.4793 15.0403L5.921 9.69686C5.56398 9.35365 5.80693 8.75037 6.30217 8.75037L17.696 8.75037C18.1913 8.75037 18.4342 9.35364 18.0772 9.69686L12.5189 15.0403Z"
        fill={color}
      />
    </Svg>
  );
}
