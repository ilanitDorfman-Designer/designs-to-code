import { Path, Svg } from 'react-native-svg';

import type { DsReactLocalIconProps } from '../ds-react-local-icon-props';

/** DS — React `chart-pie` (generated from Figma SVG export). */
export function DsReactIconChartPie({ size, color }: DsReactLocalIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2.04688C6.50304 2.04688 2.04688 6.50304 2.04688 12C2.04688 17.497 6.50304 21.9531 12 21.9531C17.497 21.9531 21.9531 17.497 21.9531 12C21.9531 6.50304 17.497 2.04688 12 2.04688ZM11.3647 3.34038C6.86609 3.6657 3.31749 7.41844 3.31749 12C3.31749 16.7952 7.20478 20.6825 12 20.6825C13.7268 20.6825 15.3358 20.1784 16.6879 19.3094L11.4963 12.3872C11.4317 12.3033 11.3875 12.2027 11.3714 12.093C11.3699 12.0825 11.3686 12.0719 11.3676 12.0614C11.366 12.0445 11.3651 12.0276 11.3648 12.0107C11.3647 12.0071 11.3647 12.0036 11.3647 12V3.34038ZM12.6353 3.34038V11.3647H20.6596C20.3495 7.07588 16.9241 3.65053 12.6353 3.34038ZM20.6596 12.6353H13.2706L17.7039 18.5463C19.3798 17.0848 20.4893 14.9902 20.6596 12.6353Z"
        fill={color}
      />
    </Svg>
  );
}
