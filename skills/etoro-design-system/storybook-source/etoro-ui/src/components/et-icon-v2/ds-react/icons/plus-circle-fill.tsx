import { Path, Svg } from 'react-native-svg';

import type { DsReactLocalIconProps } from '../ds-react-local-icon-props';

/** DS — React `plus-circle-fill` (generated from Figma SVG export). */
export function DsReactIconPlusCircleFill({ size, color }: DsReactLocalIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM12 16.0426C11.6475 16.0426 11.3617 15.7568 11.3617 15.4043V12.6383H8.59574C8.24322 12.6383 7.95745 12.3525 7.95745 12C7.95745 11.6475 8.24322 11.3617 8.59574 11.3617H11.3617V8.59574C11.3617 8.24322 11.6475 7.95745 12 7.95745C12.3525 7.95745 12.6383 8.24322 12.6383 8.59574V11.3617H15.4043C15.7568 11.3617 16.0426 11.6475 16.0426 12C16.0426 12.3525 15.7568 12.6383 15.4043 12.6383H12.6383V15.4043C12.6383 15.7568 12.3525 16.0426 12 16.0426Z"
        fill={color}
      />
    </Svg>
  );
}
