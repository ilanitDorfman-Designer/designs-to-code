import { Path, Svg } from 'react-native-svg';

import type { DsReactLocalIconProps } from '../ds-react-local-icon-props';

/** DS — React `search` (generated from Figma SVG export). */
export function DsReactIconSearch({ size, color }: DsReactLocalIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.0312 2.02051C14.4408 2.02051 18.0156 5.59533 18.0156 10.0049C18.0156 11.8924 17.3588 13.6255 16.2637 14.9922L21.7217 20.5908C22.0368 20.9144 22.0305 21.4327 21.707 21.748C21.3836 22.0631 20.8652 22.0565 20.5498 21.7334L15.1162 16.1602C13.7351 17.3024 11.9635 17.9893 10.0312 17.9893C5.62174 17.9893 2.04694 14.4144 2.04688 10.0049C2.04688 5.59533 5.6217 2.02051 10.0312 2.02051ZM10.0312 3.65723C6.52544 3.65723 3.68359 6.49907 3.68359 10.0049C3.68366 13.5106 6.52548 16.3525 10.0312 16.3525C13.537 16.3525 16.3788 13.5106 16.3789 10.0049C16.3789 6.49907 13.5371 3.65723 10.0312 3.65723Z"
        fill={color}
      />
    </Svg>
  );
}
