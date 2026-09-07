import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { useEtoroTheme } from '../../../../core/hooks/use-etoro-theme';
import { useLayoutDirection } from '../../../../core/hooks/use-layout-direction';
import { EtoroMark } from '../../../../core/icons/etoro-mark';
import { create } from '../../../../utils/create';
import { EtIconV2 } from '../../../et-icon-v2';
import type { EtSideMenuHeaderProps, SideMenuFocusHandle, SideMenuSlotType } from '../api/types';
import { HEADER_ROW_HEIGHT, MENU_HORIZONTAL_PADDING, RAIL_LOGO_SIZE, TOGGLE_ICON_SIZE, TOGGLE_SIZE } from '../constants';
import { useSideMenuConfig, useSideMenuLayer, useSideMenuRailHover, useSideMenuState } from '../context';
import { HEADER_PROFILE_EXPAND_WINDOW, useSideMenuBlockRevealStyle } from '../hooks/use-side-menu-animation';
import { useSideMenuLayerHover } from '../hooks/use-side-menu-layer-hover';
import { HoverOverlay } from './hover-overlay';

/**
 * EtSideMenu.Header — rail form: the `<e>` mark doubling as the expand toggle
 * (positioned by the root's rail top group). At rest it shows the brand mark;
 * on mouse hover OR keyboard focus it swaps to the expand glyph — there is no
 * separate toggle button in the rail anymore. Panel form: 36px row with the
 * logo slot at the start and the collapse toggle at the end.
 *
 * The toggle's affordance is keyed by LAYER, not by `expanded` — each layer's
 * instance is only visible in its own state, and keying by state would snap
 * the glyph mid-crossfade. Panel glyph = collapse (arrow-to-bar toward start);
 * the rail's hover/focus glyph flips 180° to point toward expand; RTL mirrors
 * via scaleX(dirSign). Toggles are circular (Figma icon-button radius 60) —
 * `overflow: hidden` clips the hover overlay to the circle. `testID` is
 * layer-suffixed (`-rail` toggle / `-panel` row); only the active layer's
 * toggle is keyboard-focusable — via explicit `tabIndex`, because RNW 0.21
 * Pressable ignores `focusable={false}` (backdrop precedent).
 */
function SideMenuHeaderBase({ logo, toggleAccessibilityLabels, testID }: EtSideMenuHeaderProps) {
  const layer = useSideMenuLayer();
  const { reducedMotion, setInitialFocus } = useSideMenuConfig();
  const { expanded, toggle } = useSideMenuState();
  const { colors } = useEtoroTheme();
  const direction = useLayoutDirection();
  const railHovered = useSideMenuRailHover();
  const [isFocused, setIsFocused] = useState(false);
  const revealStyle = useSideMenuBlockRevealStyle(HEADER_PROFILE_EXPAND_WINDOW);

  const isPanel = layer === 'panel';
  const isActiveLayer = isPanel ? expanded : !expanded;
  const { isHovered, hoverProps } = useSideMenuLayerHover(isActiveLayer);
  // Focus gets the same stale-state guard as hover: if the layer flip beats the
  // blur (or the focus hand-off fails), the glyph must not stay stuck revealed.
  useEffect(() => {
    if (!isActiveLayer) {
      setIsFocused(false);
    }
  }, [isActiveLayer]);
  // The rail control shows the brand mark until the pointer reaches the rail
  // (anywhere on it, not just this button) or the keyboard focuses it — all
  // must reveal the expand affordance. The button's circular hover tint stays
  // tied to its own hover only.
  const showRailExpandGlyph = !isPanel && (isHovered || isFocused || railHovered);

  // The panel-layer toggle is the focus-on-open target (web); registered via
  // the config setter in an effect, cleared on unmount.
  const toggleNodeRef = useRef<View | null>(null);
  useEffect(() => {
    if (!isPanel) return;
    setInitialFocus(toggleNodeRef.current as unknown as SideMenuFocusHandle | null);
    return () => setInitialFocus(null);
  }, [isPanel, setInitialFocus]);

  const toggleButton = (
    <Pressable
      {...hoverProps}
      accessibilityLabel={isPanel ? (toggleAccessibilityLabels?.collapse ?? 'Collapse menu') : (toggleAccessibilityLabels?.expand ?? 'Expand menu')}
      accessibilityRole="button"
      focusable={isActiveLayer}
      onBlur={() => setIsFocused(false)}
      onFocus={() => setIsFocused(true)}
      onPress={toggle}
      ref={isPanel ? toggleNodeRef : undefined}
      style={styles.toggle}
      tabIndex={isActiveLayer ? 0 : -1}
      testID={!isPanel && testID ? `${testID}-rail` : undefined}
    >
      {isPanel || showRailExpandGlyph ? (
        <View style={{ transform: [{ scaleX: direction === 'rtl' ? -1 : 1 }] }}>
          <EtIconV2 color={colors.carbon900} name={isPanel ? 'collapse-fill-left' : 'collapse-fill-right'} size={TOGGLE_ICON_SIZE} />
        </View>
      ) : (
        <EtoroMark size={RAIL_LOGO_SIZE} />
      )}
      <HoverOverlay hovered={isHovered} reducedMotion={reducedMotion} />
    </Pressable>
  );

  if (!isPanel) {
    return toggleButton;
  }

  return (
    <Animated.View style={[styles.panelRow, revealStyle]} testID={testID ? `${testID}-panel` : undefined}>
      <View style={styles.logo}>{logo}</View>
      {toggleButton}
    </Animated.View>
  );
}

export const SideMenuHeader = create(SideMenuHeaderBase, 'EtSideMenu.Header') as React.MemoExoticComponent<
  React.ComponentType<EtSideMenuHeaderProps>
> & { __SLOT_TYPE: SideMenuSlotType };

SideMenuHeader.__SLOT_TYPE = 'header';

const styles = StyleSheet.create({
  toggle: {
    width: TOGGLE_SIZE,
    height: TOGGLE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    // Circular per Figma (icon-button radius 60); clips the hover overlay round.
    borderRadius: TOGGLE_SIZE / 2,
    overflow: 'hidden',
  },
  panelRow: {
    height: HEADER_ROW_HEIGHT,
    paddingHorizontal: MENU_HORIZONTAL_PADDING,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    flexShrink: 1,
    justifyContent: 'center',
  },
});
