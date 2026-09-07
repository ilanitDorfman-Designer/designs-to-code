import { StyleSheet, View } from 'react-native';

import { useEtoroTheme } from '../../../../core/hooks';
import { X1 } from '../../../../core/styles/spacing';
import { EtoroIcon } from '../../../../foundations/icon-assets';
import type { IconName } from '../../../../foundations/icon-assets/api';
import { useEtNumberContext } from '../context';

interface EtNumberArrowProps {
  size?: number;
  /**
   * When true, the arrow remains visible while the value itself is masked.
   * Use only when revealing direction is intended for the current UI.
   */
  showWhenMasked?: boolean;
}

/**
 * EtNumber.Arrow - Directional indicator from context value.
 * Color: when root `color` prop is set, uses it; else when isColored, sign-based (green/red); else neutral.
 * Renders nothing when value is NaN or non-finite.
 */
export function EtNumberArrow({ size = 8, showWhenMasked = false }: EtNumberArrowProps) {
  const { value, isMasked, color: explicitColor, isColored } = useEtNumberContext();
  const { colors } = useEtoroTheme();

  if ((isMasked && !showWhenMasked) || value == null || !Number.isFinite(value)) return null;

  const isPositive = value >= 0;
  const iconName: IconName = isPositive ? 'caretUp' : 'caretDown';
  const signColor = isPositive ? colors.verdictPositive600 : colors.verdictNegative600;
  const color = explicitColor ?? (isColored ? signColor : colors.carbon900);

  return (
    <View style={styles.container}>
      <EtoroIcon icon={{ iconName }} appearance={{ size, color }} style={iconStyle} />
    </View>
  );
}

EtNumberArrow.displayName = 'EtNumber.Arrow';

const iconStyle = { hasFill: true };

const styles = StyleSheet.create({
  container: {
    marginRight: X1,
  },
});
