import type { PressableProps, PressableStateCallbackType } from 'react-native';
import { Pressable, StyleSheet } from 'react-native';

import { useLiquidGlassContext } from '../../../core/liquid-glass';
import { X3 } from '../../../core/styles';

export function TopbarAction({ children, hitSlop, style, ...rest }: PressableProps) {
  const { isLiquidGlass } = useLiquidGlassContext();
  const baseStyle = isLiquidGlass ? styles.actionGlass : styles.action;
  const composedStyle = typeof style === 'function' ? (state: PressableStateCallbackType) => [baseStyle, style(state)] : [baseStyle, style];

  return (
    <Pressable accessibilityRole="button" hitSlop={hitSlop ?? X3} style={composedStyle} {...rest}>
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  action: {
    alignItems: 'center',
    justifyContent: 'center',
    // Only vertical padding so the icon's left/right edges sit flush with the
    // enclosing topbar slot. The slot itself is already indented by the topbar's
    // paddingHorizontal (X6), which matches the screen content padding — this
    // gives outermost actions the same x-alignment as the screen title.
    // Horizontal tap target is preserved by Pressable's hitSlop (X3).
    paddingVertical: X3,
  },
  actionGlass: {
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
