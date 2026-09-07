import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

import { useEtoroTheme } from '../../../../core/hooks/use-etoro-theme';
import { create } from '../../../../utils/create';
import { ACTIVE_BAR_RADIUS, ACTIVE_BAR_WIDTH, ACTIVE_TINT_OPACITY } from '../constants';

/**
 * Internal active-item marker: a full-bleed `carbon900` 3% band (the same
 * fill-layer structure as hover) plus a 2px vertical gradient bar flush to the
 * surface's start edge — `primary600` → `verdictPositive400Static`, top to
 * bottom, exactly the band's height (Figma's −7 insets are against the row's
 * 26px text line: 26+7+7 = the 40px row). Figma layers a blend-mode glow
 * around the bar; deliberately not built (blend modes are unreliable on
 * react-native-web) — bar + band only.
 */
function ActiveIndicatorBase() {
  const { colors } = useEtoroTheme();

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View style={[styles.band, { backgroundColor: colors.carbon900 }]} />
      <LinearGradient colors={[colors.primary600, colors.verdictPositive400Static]} end={{ x: 0, y: 1 }} start={{ x: 0, y: 0 }} style={styles.bar} />
    </View>
  );
}

export const ActiveIndicator = create(ActiveIndicatorBase, 'EtSideMenu.ActiveIndicator');

const styles = StyleSheet.create({
  band: {
    ...StyleSheet.absoluteFillObject,
    opacity: ACTIVE_TINT_OPACITY,
  },
  bar: {
    position: 'absolute',
    start: 0,
    top: 0,
    bottom: 0,
    width: ACTIVE_BAR_WIDTH,
    borderRadius: ACTIVE_BAR_RADIUS,
  },
});
