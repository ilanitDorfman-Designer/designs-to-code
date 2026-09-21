import { Path, Svg } from 'react-native-svg';

import { useEtoroTheme } from '../../core/hooks';
import { IconProps } from './models/icon-props';

/**
 * Three stacked plates — the "all accounts" / combined-scope marker.
 *
 * @remarks
 * Stroke-based, so it takes `color` rather than `fill`; `hasFill` is
 * intentionally unsupported (see `iconMetadata.allAccounts.supportsFill`).
 */
function AllAccounts({ size = 20, color }: IconProps) {
  const { colors } = useEtoroTheme();
  const stroke = color ?? colors.textPrimaryNeutral;

  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path
        d="M10.0002 3.3335L3.3335 6.66683L10.0002 10.0002L16.6668 6.66683L10.0002 3.3335Z"
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M3.3335 10L10.0002 13.3333L16.6668 10" stroke={stroke} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M3.3335 13.3335L10.0002 16.6668L16.6668 13.3335" stroke={stroke} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export default AllAccounts;
