import { Circle, Path, Svg } from 'react-native-svg';

import { useEtoroTheme } from '../hooks';
import { IconProps } from './models/icon-props';

/**
 * `info-circle-fill` — solid filled info icon (filled circle with an inverted "i" inside).
 *
 * The `color` prop controls the filled circle background. The "i" glyph is always
 * rendered using `textInvertedPrimaryNeutral` to guarantee contrast against the circle.
 *
 * Pairs with `infoCircleLine` (the outlined variant) — use this when the design calls
 * for a stamped/solid affordance (e.g. Figma `info-fill`).
 */
export function InfoCircleFill({ size = 24, color }: IconProps) {
  const { colors } = useEtoroTheme();
  const circleColor = color ?? colors.textPrimaryNeutral;
  const glyphColor = colors.textInvertedPrimaryNeutral;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={10} fill={circleColor} />
      <Path
        d="M12.0117 10.625C12.4037 10.625 12.7216 10.943 12.7217 11.335V16.042C12.7215 16.4338 12.4036 16.752 12.0117 16.752C11.62 16.7519 11.302 16.4337 11.3018 16.042V11.335C11.3018 10.9431 11.6199 10.6251 12.0117 10.625Z"
        fill={glyphColor}
      />
      <Path
        d="M12.0127 7.3125C12.4737 7.31271 12.8475 7.68647 12.8477 8.14746C12.8477 8.60859 12.4738 8.98319 12.0127 8.9834C11.5515 8.98337 11.1777 8.60871 11.1777 8.14746C11.1779 7.68635 11.5516 7.31253 12.0127 7.3125Z"
        fill={glyphColor}
      />
    </Svg>
  );
}
