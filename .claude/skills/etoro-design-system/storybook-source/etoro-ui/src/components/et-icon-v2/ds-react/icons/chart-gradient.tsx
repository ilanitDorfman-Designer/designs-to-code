import { Defs, LinearGradient, Path, Stop, Svg } from 'react-native-svg';

import type { DsReactLocalIconProps } from '../ds-react-local-icon-props';

/** DS — React `chart-gradient` (generated from Figma SVG export). */
export function DsReactIconChartGradient({ size, color }: DsReactLocalIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.22928 17.8333V12.5833L3.28529 11.093C4.44842 10.2499 6.03035 10.1972 7.25046 10.961C8.72853 11.8863 10.6874 11.5942 11.8098 10.2811L12.5437 9.42258C13.5006 8.30314 15.1423 7.99771 16.4592 8.6941C17.5975 9.29603 18.9991 9.16778 20.0008 8.37003L22.7677 6.16668V17.8333"
        fill="url(#ds_chart_gradient_0)"
      />
      <Path
        d="M22.2312 5.97635C22.3785 5.84903 22.601 5.86519 22.7283 6.01249C22.8556 6.15979 22.8395 6.38222 22.6922 6.50956L20.2312 8.63651L20.2263 8.64139L20.2205 8.64627C19.1084 9.53175 17.5559 9.67245 16.2947 9.00565C15.1212 8.38507 13.6592 8.66018 12.8113 9.65213L12.0779 10.5105C10.8404 11.9581 8.68716 12.2761 7.06326 11.2596C5.96465 10.572 4.53837 10.6202 3.49197 11.3787L1.70389 12.7127C1.5479 12.8291 1.32722 12.7973 1.21072 12.6414C1.09432 12.4854 1.12614 12.2647 1.28201 12.1482L3.074 10.8103L3.07791 10.8074C4.35758 9.87984 6.09576 9.82229 7.43728 10.6619C8.76936 11.4958 10.5345 11.2306 11.5418 10.0525L12.2762 9.19315C13.3421 7.94659 15.1637 7.61053 16.6238 8.3826C17.6377 8.91877 18.886 8.80375 19.7771 8.09647L22.2312 5.97635Z"
        fill={color}
      />
      <Defs>
        <LinearGradient id="ds_chart_gradient_0" x1="11.9774" y1="17.8333" x2="11.9774" y2="5.12106" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#26292B" stopOpacity="0.01" />
          <Stop offset="0.830427" stopColor="#26292B" stopOpacity="0.25" />
        </LinearGradient>
      </Defs>
    </Svg>
  );
}
