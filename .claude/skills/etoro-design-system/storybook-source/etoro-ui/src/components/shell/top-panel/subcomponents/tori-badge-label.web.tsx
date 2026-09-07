import { useMemo } from 'react';
import type { TextStyle } from 'react-native';

import { useEtoroTheme } from '../../../../core/hooks/use-etoro-theme';
import { useLayoutDirection } from '../../../../core/hooks/use-layout-direction';
import { EtText } from '../../../../foundations/text/et-text';
import { TORI_LABEL_GRADIENT_STOP } from '../constants';
import type { ToriBadgeLabelProps } from './tori-badge-label.types';

/**
 * The "Ask Tori" gradient label, web side of the platform pair: CSS
 * `background-clip: text` paints the glyphs with the carbon900 →
 * verdictPositive600 run (fully green from `TORI_LABEL_GRADIENT_STOP`) —
 * MaskedView's web build is a no-op passthrough, so the native masking route
 * renders no gradient here. The properties are CSS-only, hence the cast:
 * react-native-web forwards them to the DOM untouched.
 */
export function ToriBadgeLabel({ label, accentLabel }: ToriBadgeLabelProps) {
  const { colors } = useEtoroTheme();
  // RTL: a translated `label` renders on the visual right, so the run flips —
  // the green end must keep painting the "Tori" word.
  const isRtl = useLayoutDirection() === 'rtl';

  const gradientTextStyle = useMemo(
    () =>
      ({
        backgroundImage: `linear-gradient(to ${isRtl ? 'left' : 'right'}, ${colors.carbon900}, ${colors.verdictPositive600} ${TORI_LABEL_GRADIENT_STOP * 100}%)`,
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        color: 'transparent',
      }) as unknown as TextStyle,
    [colors.carbon900, colors.verdictPositive600, isRtl],
  );

  return (
    <EtText numberOfLines={1} style={gradientTextStyle} variant="body-secondary-medium">
      {`${label} ${accentLabel}`}
    </EtText>
  );
}
