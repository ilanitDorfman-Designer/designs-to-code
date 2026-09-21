import { Path, Svg } from 'react-native-svg';

import type { DsReactLocalIconProps } from '../ds-react-local-icon-props';

/** DS — React `caret-up` (generated from Figma SVG export). */
export function DsReactIconCaretUp({ size, color }: DsReactLocalIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.4398 7.87833C11.3107 7.04104 12.6875 7.04104 13.5584 7.87833L19.1167 13.2218C20.4475 14.5011 19.5419 16.7496 17.696 16.7496L6.30217 16.7496C4.45628 16.7496 3.55073 14.5011 4.88145 13.2218L10.4398 7.87833ZM12.5189 8.95969C12.2286 8.68059 11.7696 8.68059 11.4793 8.95969L5.921 14.3031C5.56398 14.6464 5.80693 15.2496 6.30217 15.2496L17.696 15.2496C18.1913 15.2496 18.4342 14.6464 18.0772 14.3031L12.5189 8.95969Z"
        fill={color}
      />
    </Svg>
  );
}
