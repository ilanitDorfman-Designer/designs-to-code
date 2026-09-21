import Svg, { G, Path } from 'react-native-svg';

import { useEtoroTheme } from '../../core/hooks';
import { IconProps } from './models/icon-props';

function Close({ size = 24, fill, color }: IconProps) {
  const { colors } = useEtoroTheme();
  return (
    <Svg width={size} height={size} viewBox="-5 -5 28 28">
      <G
        fill={color || colors.textPrimaryNeutral}
        stroke={color || colors.textPrimaryNeutral}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="0.3"
      >
        <Path
          d="M10.3607 8.52109L16.6194 2.27792C17.1269 1.77171 17.1269 0.92804 16.6194 0.421836C16.0556 -0.140612 15.2662 -0.140612 14.7023 0.421836L8.5 6.60877L2.29768 0.421836C1.73383 -0.140612 0.88806 -0.140612 0.380597 0.421836C-0.126866 0.92804 -0.126866 1.77171 0.380597 2.27792L6.6393 8.52109L0.380597 14.7643C-0.126866 15.2705 -0.126866 16.1141 0.380597 16.6203C0.88806 17.1266 1.73383 17.1266 2.24129 16.6203L8.5 10.3772L14.7587 16.6203C15.2662 17.1266 16.1119 17.1266 16.6194 16.6203C17.1269 16.1141 17.1269 15.2705 16.6194 14.7643L10.3607 8.52109Z"
          fill={fill}
        />
      </G>
    </Svg>
  );
}

export default Close;
