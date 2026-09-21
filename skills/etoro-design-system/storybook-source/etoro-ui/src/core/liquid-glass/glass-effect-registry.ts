import type { ComponentType } from 'react';
import type { ViewProps } from 'react-native';

export type GlassEffectStyleConfig = {
  style: GlassEffectStyleName;
  animate?: boolean;
  animationDuration?: number;
};

export type GlassEffectStyleName = 'regular' | 'clear' | 'none';
export type GlassEffectStyle = GlassEffectStyleName | GlassEffectStyleConfig;
export type GlassColorScheme = 'auto' | 'light' | 'dark';

export interface GlassEffectModule {
  GlassView: ComponentType<
    ViewProps & {
      glassEffectStyle?: GlassEffectStyle;
      tintColor?: string;
      isInteractive?: boolean;
      colorScheme?: GlassColorScheme;
    }
  >;
  isLiquidGlassAvailable: () => boolean;
  isGlassEffectAPIAvailable: () => boolean;
}

let registeredModule: GlassEffectModule | null = null;

/**
 * Register the `expo-glass-effect` native module with the UI kit.
 *
 * Call once at app startup (before rendering) so glass-aware components
 * can use the native GlassView. If never called, all glass components
 * gracefully fall back to plain Views.
 *
 * @example
 * ```ts
 * import * as ExpoGlassEffect from 'expo-glass-effect';
 * import { registerGlassEffect } from 'etoro-ui/core';
 *
 * registerGlassEffect(ExpoGlassEffect);
 * ```
 */
export function registerGlassEffect(module: GlassEffectModule): void {
  registeredModule = module;
}

/** @internal */
export function getGlassEffectModule(): GlassEffectModule | null {
  return registeredModule;
}

/** @internal Clears the registered module. Intended for test cleanup only. */
export function resetGlassEffect(): void {
  registeredModule = null;
}
