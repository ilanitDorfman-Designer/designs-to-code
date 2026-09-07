import { ClipPath, Defs, G, Path, Rect, Svg } from 'react-native-svg';

import { useEtoroTheme } from '../hooks';
import { IconProps } from './models/icon-props';

export function ExclamationCircleLine({ size = 24, color }: IconProps) {
  const { colors } = useEtoroTheme();
  const fillColor = color || colors.textPrimaryNeutral;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G clipPath="url(#clip0_exclamation)">
        <Path
          d="M10.0837 15.125C10.0837 14.6187 10.4941 14.2083 11.0003 14.2083C11.5066 14.2083 11.9171 14.6187 11.9171 15.125C11.9171 15.6312 11.5067 16.0417 11.0004 16.0417C10.4942 16.0417 10.0837 15.6312 10.0837 15.125Z"
          fill={fillColor}
        />
        <Path
          d="M10.3128 6.41666L10.3128 11.9167C10.3128 12.2964 10.6206 12.6042 11.0003 12.6042C11.38 12.6042 11.6878 12.2964 11.6878 11.9167L11.6878 6.41666C11.6878 6.03696 11.38 5.72916 11.0003 5.72916C10.6206 5.72916 10.3128 6.03696 10.3128 6.41666Z"
          fill={fillColor}
        />
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0.229492 11C0.229492 5.05142 5.05176 0.229156 11.0003 0.229156C16.9489 0.229156 21.7712 5.05142 21.7712 11C21.7712 16.9486 16.9489 21.7708 11.0003 21.7708C5.05176 21.7708 0.229492 16.9486 0.229492 11ZM11.0003 1.60416C5.81115 1.60416 1.60449 5.81081 1.60449 11C1.60449 16.1892 5.81115 20.3958 11.0003 20.3958C16.1895 20.3958 20.3962 16.1892 20.3962 11C20.3962 5.81081 16.1895 1.60416 11.0003 1.60416Z"
          fill={fillColor}
        />
      </G>
      <Defs>
        <ClipPath id="clip0_exclamation">
          <Rect width={22} height={22} fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
