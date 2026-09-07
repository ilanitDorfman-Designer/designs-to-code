import { type ReactNode } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import { useReducedMotionState } from '../../../../core/hooks/accessibility';
import { SkeletonGroupContext } from '../context/skeleton-group-context';

interface EtSkeletonGroupHostProps {
  /** Shape atoms (`EtSkeleton`, `EtSkeleton.Box`, rows, etc.) laid out to mirror the real content. */
  children: ReactNode;
  /** Layout style for the group container (padding, gap, etc.). */
  style?: StyleProp<ViewStyle>;
  /** Disable the shimmer for the whole group (renders static placeholders). */
  animated?: boolean;
  testID?: string;
}

/**
 * `EtSkeleton.Group` — a pure layout host for a multi-shape skeleton.
 *
 * Lays its shape-atom children out with normal flexbox so the skeleton mirrors
 * the real content, and toggles their pulse animation on/off via context. It
 * owns NO animation itself: each atom pulses its own opacity, and the
 * enter/exit dissolve is owned by the loading-aware `EtView` / `EtScrollView`.
 * This keeps the group a plain, predictable `View`.
 */
export function EtSkeletonGroupHost({ children, style, animated = true, testID }: EtSkeletonGroupHostProps) {
  const reducedMotion = useReducedMotionState();
  const context = { animated, reducedMotion };

  return (
    <SkeletonGroupContext.Provider value={context}>
      <View style={style} testID={testID}>
        {children}
      </View>
    </SkeletonGroupContext.Provider>
  );
}
