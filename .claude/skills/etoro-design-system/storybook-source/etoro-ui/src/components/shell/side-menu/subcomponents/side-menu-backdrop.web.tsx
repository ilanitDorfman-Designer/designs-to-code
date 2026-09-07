import { ComponentProps, ComponentType } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import type { SideMenuBackdropProps } from './side-menu-backdrop';

// RNW forwards DOM props that RN's Pressable types don't declare.
const WebPressable = Pressable as ComponentType<
  ComponentProps<typeof Pressable> & { tabIndex?: number; onMouseDown?: (event: { preventDefault: () => void }) => void }
>;

/**
 * Web backdrop behind the expanded surface: full-viewport, colorless (no scrim
 * by design), it closes the panel by swallowing the outside click (Pressable eats
 * the event by existing). Pointer-only affordance — the keyboard counterpart
 * is the focusout-close in `use-side-menu-web-close.web.ts`, so it is hidden
 * from the accessibility tree. Mounted only while expanded (root), as a
 * sibling BELOW the surface.
 */
export function SideMenuBackdrop({ onPress }: SideMenuBackdropProps) {
  return (
    <WebPressable
      accessible={false}
      // RNW 0.21 Pressable ignores focusable={false} and still renders
      // tabindex="0" (verified live) — tabIndex={-1} removes the invisible
      // full-viewport tab stop, and preventing mousedown default keeps focus
      // where it was so an outside click closes as 'outside', not 'focusout'.
      focusable={false}
      importantForAccessibility="no-hide-descendants"
      onMouseDown={(event) => event.preventDefault()}
      onPress={onPress}
      style={styles.backdrop}
      tabIndex={-1}
      testID="et-side-menu-backdrop"
    />
  );
}

const styles = StyleSheet.create({
  backdrop: {
    // RNW passes CSS position values through; 'absolute' would size to the
    // rail-width placeholder instead of the viewport. Physical edges are fine:
    // full viewport either direction.
    position: 'fixed' as unknown as 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
