import type { ReactNode } from 'react';
import { Children } from 'react';
import { StyleSheet, View } from 'react-native';

import { EtGlassView } from '../../../core/liquid-glass';
import { X2, X3 } from '../../../core/styles';

/**
 * Wraps slot children in glass surfaces when Liquid Glass is active.
 *
 * - 1 child: it gets its own circular glass capsule.
 * - 2+ children: all children share a single pill-shaped glass surface,
 *   mirroring iOS' GlassEffectContainer grouping so a multi-action top-bar
 *   reads as one connected control instead of a row of disconnected coins.
 *   This keeps the Watchlist / Portfolio / Discovery action pill consistent
 *   with the Home top bar (which hand-rolls the same pill) even when only the
 *   Search + Notifications actions remain.
 *
 * Falls back to a plain View when glass is unavailable.
 */
const GROUPED_GLASS_THRESHOLD = 2;

export function GlassSlotWrapper({ children, disableLiquidGlass }: { children: ReactNode[]; disableLiquidGlass: boolean }) {
  if (disableLiquidGlass || children.length === 0) {
    return <View>{children}</View>;
  }

  const flatChildren: ReactNode[] = [];
  children.forEach((child) => {
    Children.forEach(child, (c) => {
      if (c != null) flatChildren.push(c);
    });
  });

  if (flatChildren.length >= GROUPED_GLASS_THRESHOLD) {
    return (
      <EtGlassView style={[glassStyles.base, glassStyles.pill]}>
        {flatChildren.map((child, index) => (
          <View key={index} style={glassStyles.pillItem}>
            {child}
          </View>
        ))}
      </EtGlassView>
    );
  }

  return (
    <View style={glassStyles.row}>
      {flatChildren.map((child, index) => (
        <EtGlassView key={index} style={[glassStyles.base, glassStyles.circular]}>
          {child}
        </EtGlassView>
      ))}
    </View>
  );
}

const glassStyles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    padding: 6,
  },
  circular: {
    aspectRatio: 1,
  },
  // Pill keeps the same vertical padding as a single capsule so the merged
  // surface lines up vertically with adjacent solo capsules (e.g. the Start
  // slot's menu/back button).
  pill: {
    gap: X3,
  },
  pillItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: X2,
  },
});
