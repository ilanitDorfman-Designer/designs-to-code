import { Path, Svg } from 'react-native-svg';

import type { DsReactLocalIconProps } from '../ds-react-local-icon-props';

/** DS — React `exclamation` (generated from Figma SVG export). */
export function DsReactIconExclamation({ size, color }: DsReactLocalIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12.7499 3.37551C12.7499 2.96132 12.4141 2.62555 11.9999 2.62555C11.5858 2.62555 11.25 2.96132 11.25 3.37551L11.25 15.1428C11.25 15.557 11.5858 15.8928 11.9999 15.8928C12.4141 15.8928 12.7499 15.557 12.7499 15.1428L12.7499 3.37551Z"
        fill={color}
      />
      <Path
        d="M11.9999 19.3746C11.4477 19.3746 11 19.8223 11 20.3745C11 20.9268 11.4477 21.3745 11.9999 21.3745C12.5522 21.3745 13 20.9268 13 20.3745C13 19.8223 12.5522 19.3746 11.9999 19.3746Z"
        fill={color}
      />
    </Svg>
  );
}
