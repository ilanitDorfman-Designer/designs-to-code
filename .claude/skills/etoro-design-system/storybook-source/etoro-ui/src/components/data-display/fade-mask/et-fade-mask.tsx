// NATIVE TWIN: the advanced watchlist table renders the right-edge fade used by the advanced table natively on iOS (SwiftUI) and
// Android (Compose) — apps/etoro-mobile/modules/advanced-table/ios/AdvancedTableView.swift (AdvancedTableEndFade) and
// apps/etoro-mobile/modules/advanced-table/android/.../AdvancedTableView.kt (AdvancedTableEndFade). A change here must be mirrored in both;
// see apps/etoro-mobile/modules/advanced-table/AGENTS.md for the full map.
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { useEtoroTheme } from '../../../core/hooks';
import { makeTransparent } from '../../../core/styles';

export interface EtFadeMaskProps {
  /**
   * Edge the fade mask sits on.
   * - 'top' / 'bottom': a full-width band that fades vertically.
   * - 'left' / 'right': a full-height band that fades horizontally.
   */
  position: 'top' | 'bottom' | 'left' | 'right';
  /**
   * The offset value for the position (e.g., headerHeight for top, or -16 for bottom).
   */
  offset?: number;
  /**
   * Height of the gradient band — used for 'top' / 'bottom'.
   * @default 16
   */
  height?: number;
  /**
   * Width of the gradient band — used for 'left' / 'right'.
   * @default 16
   */
  width?: number;
  /**
   * zIndex for layering
   * @default 1
   */
  zIndex?: number;
  /**
   * Override the solid edge color of the gradient.
   * @default colors.bgNeutralPrimary from theme
   */
  color?: string;
}

export function EtFadeMask({ position, offset = position === 'bottom' ? -16 : 0, height = 16, width = 16, zIndex = 1, color }: EtFadeMaskProps) {
  const { colors } = useEtoroTheme();
  const gradientColor = color ?? colors.bgNeutralPrimary;
  const isHorizontal = position === 'left' || position === 'right';

  // Vertical masks ('top' / 'bottom') span the full width and fade down; horizontal
  // masks ('left' / 'right') span the full height and fade across. The solid color
  // sits on the named edge and dissolves toward the content.
  const containerStyle: ViewStyle = isHorizontal
    ? { top: 0, bottom: 0, width, ...(position === 'left' ? { left: offset } : { right: offset }) }
    : { left: 0, right: 0, height, ...(position === 'top' ? { top: offset } : { bottom: offset }) };

  // Fade to a zero-alpha version of the SAME color, not the `'transparent'` keyword: `'transparent'`
  // is `rgba(0,0,0,0)`, so interpolating toward it darkens the midpoint with black (a visible gray
  // haze, especially on light backgrounds). makeTransparent keeps the RGB and only drops the alpha.
  const fadeColor = makeTransparent(gradientColor);
  const gradientColors: [string, string] = position === 'right' || position === 'bottom' ? [fadeColor, gradientColor] : [gradientColor, fadeColor];

  return (
    <View style={[styles.container, { zIndex }, containerStyle]} pointerEvents="none">
      <LinearGradient
        colors={gradientColors}
        style={StyleSheet.absoluteFill}
        start={isHorizontal ? { x: 0, y: 0 } : undefined}
        end={isHorizontal ? { x: 1, y: 0 } : undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
});
