import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';

import { useEtoroTheme } from '../../../../core/hooks/use-etoro-theme';
import { useLayoutDirection } from '../../../../core/hooks/use-layout-direction';
import { EtText } from '../../../../foundations/text/et-text';
import { TORI_LABEL_GRADIENT_STOP } from '../constants';
import type { ToriBadgeLabelProps } from './tori-badge-label.types';

/**
 * The "Ask Tori" gradient label, native side of the platform pair: the text
 * masks a carbon900 → verdictPositive600 run (fully green from
 * `TORI_LABEL_GRADIENT_STOP`). The inner transparent copy of the text sizes
 * the gradient to exactly the glyph box. Decorative — the badge container
 * carries the accessible label.
 */
export function ToriBadgeLabel({ label, accentLabel }: ToriBadgeLabelProps) {
  const { colors } = useEtoroTheme();
  // RTL: a translated `label` renders on the visual right, so the run flips —
  // the green end must keep painting the "Tori" word.
  const isRtl = useLayoutDirection() === 'rtl';
  const text = `${label} ${accentLabel}`;

  return (
    <MaskedView
      maskElement={
        <EtText numberOfLines={1} variant="body-secondary-medium">
          {text}
        </EtText>
      }
    >
      <LinearGradient
        colors={[colors.carbon900, colors.verdictPositive600]}
        end={{ x: isRtl ? 0 : 1, y: 0 }}
        locations={[0, TORI_LABEL_GRADIENT_STOP]}
        start={{ x: isRtl ? 1 : 0, y: 0 }}
      >
        <EtText numberOfLines={1} style={styles.sizer} variant="body-secondary-medium">
          {text}
        </EtText>
      </LinearGradient>
    </MaskedView>
  );
}

const styles = StyleSheet.create({
  sizer: {
    opacity: 0,
  },
});
