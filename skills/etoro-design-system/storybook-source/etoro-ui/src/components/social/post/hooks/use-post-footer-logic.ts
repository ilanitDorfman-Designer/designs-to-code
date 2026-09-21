import { useCallback, useMemo } from 'react';

import { useEtoroTheme } from '../../../../core/hooks';
import { neutral } from '../../../../core/styles/colors/primitives';
import { IconVariant } from '../../../et-icon-v2';
import { triggerHaptic } from '../utils';

// ============================================================================
// useFooterActionStyle
// ============================================================================

export interface FooterActionStyle {
  iconColor: string;
  iconVariant: IconVariant;
  textColor: string;
}

/**
 * Returns icon color, icon variant, and text color for a footer action
 * based on its active state and the current theme.
 */
export function useFooterActionStyle(isActive: boolean): FooterActionStyle {
  const { colors } = useEtoroTheme();

  return useMemo(() => {
    const activeIconColor = colors.primary600 || colors.carbon900 || neutral[900];
    const textColor = colors.carbon900 || neutral[900];
    const iconColor = isActive ? activeIconColor : textColor;
    const iconVariant = isActive ? IconVariant.Filled : IconVariant.Regular;

    return { iconColor, iconVariant, textColor };
  }, [isActive, colors.primary600, colors.carbon900]);
}

// ============================================================================
// useHapticHandler
// ============================================================================

/**
 * Wraps a handler with haptic feedback. Returns a stable callback
 * that triggers haptics (when enabled) before calling the handler.
 */
export function useHapticHandler(handler: (() => void) | undefined, haptics: boolean): () => void {
  return useCallback(() => {
    triggerHaptic(haptics);
    handler?.();
  }, [handler, haptics]);
}
