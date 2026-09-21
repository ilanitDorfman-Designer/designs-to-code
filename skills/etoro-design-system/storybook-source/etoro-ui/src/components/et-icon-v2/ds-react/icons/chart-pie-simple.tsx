import { Path, Svg } from 'react-native-svg';

import type { DsReactLocalIconProps } from '../ds-react-local-icon-props';

/** DS — React `chart-pie-simple` (generated from Figma SVG export). */
export function DsReactIconChartPieSimple({ size, color }: DsReactLocalIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.5895 2.00226C10.9471 1.97476 10.4492 2.49683 10.4492 3.10363V3.7945C5.72697 4.136 2.00195 8.0753 2.00195 12.8846C2.00195 17.9182 6.0825 21.9988 11.1161 21.9988C15.9254 21.9988 19.8647 18.2738 20.2062 13.5516H20.8972C21.5039 13.5516 22.026 13.0537 21.9985 12.4113C21.7571 6.7718 17.229 2.24367 11.5895 2.00226ZM19.571 12.2178C19.5685 12.2178 19.5659 12.2177 19.5634 12.2177C19.5608 12.2177 19.5583 12.2178 19.5557 12.2178H11.783V3.3488C16.5304 3.67577 20.325 7.47035 20.652 12.2178H19.571ZM10.4492 5.13243V12.4401C10.4492 13.0539 10.9468 13.5516 11.5607 13.5516H18.8683C18.53 17.5363 15.1884 20.665 11.1161 20.665C6.81912 20.665 3.33573 17.1816 3.33573 12.8846C3.33573 8.81229 6.46442 5.4707 10.4492 5.13243Z"
        fill={color}
      />
    </Svg>
  );
}
