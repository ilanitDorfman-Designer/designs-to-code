import React, { useMemo } from 'react';
import type { StyleProp, ViewProps, ViewStyle } from 'react-native';
import { View } from 'react-native';

import type { GlassColorScheme, GlassEffectStyle } from './glass-effect-registry';
import { getGlassEffectModule } from './glass-effect-registry';
import { useLiquidGlassContext } from './liquid-glass-context';

export interface EtGlassViewProps extends ViewProps {
  /** Glass effect variant passed to the native GlassView. */
  glassEffectStyle?: GlassEffectStyle;
  /** Tint color applied to the native glass material. */
  tintColor?: string;
  /**
   * Whether the glass surface responds to touch with native visual feedback.
   * Can only be set on mount — changing it after render requires remounting via `key`.
   */
  isInteractive?: boolean;
  /** Color scheme override for the native glass material. */
  colorScheme?: GlassColorScheme;
  /** Style applied only when Liquid Glass is unavailable. */
  fallbackStyle?: StyleProp<ViewStyle>;
}

/**
 * Unified glass surface component.
 *
 * - On iOS 26+ renders the native `GlassView` from the registered glass module.
 * - On all other platforms renders a plain `View` with optional `fallbackStyle`.
 *
 * Requires `registerGlassEffect()` to have been called at app startup
 * for the native glass effect to work. Without registration the component
 * always renders the fallback View.
 */
function EtGlassViewBase({
  glassEffectStyle = 'regular',
  tintColor,
  isInteractive = true,
  colorScheme,
  fallbackStyle,
  style,
  children,
  ...rest
}: EtGlassViewProps) {
  const { isLiquidGlass } = useLiquidGlassContext();

  const NativeGlassView = useMemo(() => {
    if (!isLiquidGlass) return null;
    return getGlassEffectModule()?.GlassView ?? null;
  }, [isLiquidGlass]);

  if (NativeGlassView) {
    return (
      <NativeGlassView
        glassEffectStyle={glassEffectStyle}
        tintColor={tintColor}
        isInteractive={isInteractive}
        colorScheme={colorScheme}
        style={style}
        {...rest}
      >
        {children}
      </NativeGlassView>
    );
  }

  return (
    <View style={[style, fallbackStyle]} {...rest}>
      {children}
    </View>
  );
}

EtGlassViewBase.displayName = 'EtGlassView';

export const EtGlassView = React.memo(EtGlassViewBase);
