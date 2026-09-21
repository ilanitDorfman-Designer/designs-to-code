import { useTheme } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { memo } from 'react';
import { StyleSheet, type ViewStyle } from 'react-native';
import Animated, { type SharedValue, useAnimatedStyle } from 'react-native-reanimated';

import { useEtoroTheme } from '../../../core/hooks';
import { EtGlassView, useLiquidGlass } from '../../../core/liquid-glass';

/** Faint white sheen sweeping the top edge — the "glass" specular highlight. */
const SPECULAR_DARK = ['rgba(255,255,255,0.14)', 'rgba(255,255,255,0)'] as const;
const SPECULAR_LIGHT = ['rgba(255,255,255,0.6)', 'rgba(255,255,255,0)'] as const;

interface IslandShellProps {
  /** Animated border radius that tracks the morph. */
  surfaceStyle: ReturnType<typeof useAnimatedStyle<ViewStyle>>;
  /** Expansion progress, 0 (collapsed) → 1 (expanded). Drives the solid body fill and rim. */
  expansion: SharedValue<number>;
}

/**
 * The frosted "liquid glass" surface that backs the island. Uses the native
 * Liquid Glass material on iOS 26+, falling back to an `expo-blur` BlurView
 * everywhere else, over a solid `backgroundShell` body so the open island reads
 * clearly even in light mode.
 *
 * The whole surface (glass material, grey body, specular sheen and rim) fades
 * in with `expansion`: collapsed it is fully transparent so the pill blends
 * into whatever sits behind it (just the avatar + neighbour dots show), and it
 * materialises into the solid glass island only as it opens.
 */
function IslandShellBase({ surfaceStyle, expansion }: IslandShellProps) {
  const { colors } = useEtoroTheme();
  const { dark } = useTheme();
  const { supportsLiquidGlass } = useLiquidGlass();

  const rimColor = dark ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.5)';
  const specular = dark ? SPECULAR_DARK : SPECULAR_LIGHT;

  // Fade the entire backing surface with expansion — no slab when collapsed, so
  // the pill blends with any background; full glass island when expanded.
  const fadeStyle = useAnimatedStyle<ViewStyle>(() => ({ opacity: expansion.value }));

  return (
    <Animated.View style={[StyleSheet.absoluteFill, styles.clip, { borderColor: rimColor }, surfaceStyle, fadeStyle]} pointerEvents="none">
      {supportsLiquidGlass ? (
        <EtGlassView style={StyleSheet.absoluteFill} glassEffectStyle="regular" isInteractive={false} />
      ) : (
        <BlurView tint={dark ? 'dark' : 'light'} intensity={dark ? 40 : 60} style={StyleSheet.absoluteFill} />
      )}
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: colors.backgroundShell }]} />
      <LinearGradient colors={specular} style={styles.specular} pointerEvents="none" />
    </Animated.View>
  );
}

export const IslandShell = memo(IslandShellBase);
IslandShell.displayName = 'EtInstrumentIsland.Shell';

const styles = StyleSheet.create({
  clip: {
    overflow: 'hidden',
    borderCurve: 'continuous',
    borderWidth: StyleSheet.hairlineWidth,
  },
  specular: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '55%',
  },
});
