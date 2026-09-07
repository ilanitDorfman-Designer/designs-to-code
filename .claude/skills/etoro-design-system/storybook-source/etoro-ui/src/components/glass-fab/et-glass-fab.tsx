import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useEtoroTheme } from '../../core/hooks/use-etoro-theme';
import { EtGlassView, LiquidGlassContext, useLiquidGlass } from '../../core/liquid-glass';
import { clampAndroidDimezisBlurIntensity } from '../../utils/android-blur-intensity';
import { EtIconV2 } from '../et-icon-v2';
import type { EtGlassFabProps } from './api';
import { createGlassFabStyles } from './styles';

const DEFAULT_SIZE = 44;
const DEFAULT_ICON_SIZE = 24;
/** Blur strength for the non-liquid-glass fallback (Android / older iOS) — higher reads as frostier glass. */
const FALLBACK_BLUR_INTENSITY = 70;

/**
 * EtGlassFab — circular liquid-glass floating action button.
 *
 * On iOS 26+ it renders the native `GlassView` (via {@link EtGlassView}); on every
 * other platform it falls back to a primary Carbon circle with a `BlurView` underlay.
 * Self-contained: it detects liquid-glass support and provides the
 * `LiquidGlassContext` for its own subtree, so consumers only supply an icon + handler.
 *
 * Positioning (absolute placement, scroll-driven animation) is intentionally left to
 * the consumer — wrap the FAB in a positioned `View` / `Animated.View`.
 *
 * @example
 * ```tsx
 * <EtGlassFab iconName="plus" onPress={handleAdd} accessibilityLabel="Add to watchlist" />
 * ```
 */
function EtGlassFabBase({
  iconName,
  children,
  onPress,
  accessibilityLabel,
  size = DEFAULT_SIZE,
  iconSize = DEFAULT_ICON_SIZE,
  iconColor,
  fallbackColor,
  glassEffectStyle = 'regular',
  tintColor,
  haptics = true,
  disabled = false,
  hitSlop,
  style,
  testID,
}: EtGlassFabProps) {
  const { colors } = useEtoroTheme();
  const { supportsLiquidGlass } = useLiquidGlass();

  const resolvedFallbackColor = fallbackColor ?? colors.carbon900;
  const styles = useMemo(() => createGlassFabStyles(size, resolvedFallbackColor), [size, resolvedFallbackColor]);
  const liquidGlassCtx = useMemo(() => ({ isLiquidGlass: supportsLiquidGlass }), [supportsLiquidGlass]);
  const resolvedIconColor = iconColor ?? (!supportsLiquidGlass ? colors.carbon050 : undefined);

  const handlePress = () => {
    if (disabled) return;
    if (haptics) {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
    }
    onPress();
  };

  return (
    <LiquidGlassContext.Provider value={liquidGlassCtx}>
      <EtGlassView style={[styles.glass, style]} fallbackStyle={styles.fallbackClip} glassEffectStyle={glassEffectStyle} tintColor={tintColor}>
        {!supportsLiquidGlass && (
          <>
            <BlurView
              intensity={clampAndroidDimezisBlurIntensity(FALLBACK_BLUR_INTENSITY)}
              tint="regular"
              experimentalBlurMethod="dimezisBlurView"
              style={StyleSheet.absoluteFillObject}
              pointerEvents="none"
            />
            <View style={styles.fallbackScrim} pointerEvents="none" />
          </>
        )}
        <Pressable
          style={styles.pressable}
          onPress={handlePress}
          disabled={disabled}
          hitSlop={hitSlop}
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel}
          accessibilityState={{ disabled }}
          testID={testID}
        >
          {children ?? (iconName ? <EtIconV2 name={iconName} size={iconSize} color={resolvedIconColor} /> : null)}
        </Pressable>
      </EtGlassView>
    </LiquidGlassContext.Provider>
  );
}

EtGlassFabBase.displayName = 'EtGlassFab';

export const EtGlassFab = React.memo(EtGlassFabBase);
