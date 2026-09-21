import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { useReducedMotion } from '../../../core/hooks/accessibility/use-reduced-motion';
import { useEtoroTheme } from '../../../core/hooks/use-etoro-theme';
import { Z_SHELL_MENU } from '../../../core/styles/z-index';
import type { EtSideMenuProps, SideMenuCloseReason, SideMenuFocusHandle } from './api/types';
import { HEADER_PROFILE_GAP, MENU_VERTICAL_PADDING, PANEL_BLOCK_GAP, PANEL_WIDTH, railWidthForTier } from './constants';
import { SideMenuConfigContext, SideMenuLayerContext, SideMenuRailHoverContext, SideMenuStateContext } from './context';
import { useSideMenuAnimation, useSideMenuChildren, useSideMenuRailLayerStyle, useSideMenuSurfaceStyle, useSideMenuWebClose } from './hooks';
import { SideMenuBackdrop, SideMenuFooter, SideMenuHeader, SideMenuItem, SideMenuProfile, SideMenuSection, SideMenuTile } from './subcomponents';

/**
 * EtSideMenu — the web shell's left menu: a fixed rail (72/80/84 by tier) that
 * morphs into a 280px overlay panel. Fully controlled (`expanded` +
 * `onExpandedChange`), navigation-agnostic (ids in, presses out).
 *
 * Structure: an in-flow PLACEHOLDER reserves the rail width and carries
 * `Z_SHELL_MENU` (sibling-scoped — meaningful only among the shell row's
 * children); the SURFACE is absolute within it, animating width/end-radii with
 * `overflow: hidden` (clip reveal). Both visual states stay mounted as two
 * crossfading layers — slot children are rendered TWICE (rail + panel layer,
 * via SideMenuLayerContext) so nothing mounts/unmounts during animation.
 * NEVER add `entering`/`exiting` animations anywhere in this family.
 *
 * At tier -1 the rail layer is not rendered (railWidth 0, clip-reveal from the
 * edge); mount `EtSideMenuTrigger` in the top panel to open it.
 *
 * @example
 * ```tsx
 * <EtSideMenu tier={tier} expanded={expanded} onExpandedChange={setExpandedWithReason}
 *             activeItemId={activeId} onItemPress={navigate}>
 *   <EtSideMenu.Header logo={<EtoroWordmark size={WORDMARK_GLYPH_HEIGHT} />} />
 *   <EtSideMenu.Profile avatar={<EtAvatar … />} name="Jane" handle="@jane" />
 *   <EtSideMenu.Tile icon="star" title="Club Select" subtitle="Manage benefits" onPress={openClub} />
 *   <EtSideMenu.Section>
 *     <EtSideMenu.Item id="home" label="Home" icon="home" />
 *   </EtSideMenu.Section>
 *   <EtSideMenu.Section label="More" secondary>
 *     <EtSideMenu.Item id="settings" label="Settings" icon="gear" />
 *   </EtSideMenu.Section>
 *   <EtSideMenu.Footer>
 *     <EtSideMenu.Item id="more" label="More" icon="more" />
 *   </EtSideMenu.Footer>
 * </EtSideMenu>
 * ```
 */
function EtSideMenuBase({ tier, expanded, onExpandedChange, activeItemId, onItemPress, children, style, testID }: EtSideMenuProps) {
  const railWidth = railWidthForTier(tier);
  const reducedMotion = useReducedMotion();
  const { colors } = useEtoroTheme();

  const animation = useSideMenuAnimation({ expanded, tier, reducedMotion });
  const { headerChild, profileChild, tileChild, sectionChildren, footerChild } = useSideMenuChildren(children);

  // Web-only: hovering ANYWHERE on the collapsed rail reveals the header's
  // expand glyph (pointer handlers never fire on native). Reset on expand —
  // the rail goes pointer-none mid-hover, so its pointerLeave never comes —
  // and at tier -1, where the rail layer unmounts mid-hover the same way.
  const [railHovered, setRailHovered] = useState(false);
  const handleRailPointerEnter = useCallback(() => setRailHovered(true), []);
  const handleRailPointerLeave = useCallback(() => setRailHovered(false), []);
  useEffect(() => {
    if (expanded || tier === -1) {
      setRailHovered(false);
    }
  }, [expanded, tier]);

  const surfaceRef = useRef<View>(null);
  const initialFocusRef = useRef<SideMenuFocusHandle | null>(null);
  const setInitialFocus = useCallback((handle: SideMenuFocusHandle | null) => {
    initialFocusRef.current = handle;
  }, []);

  const toggle = useCallback(() => {
    onExpandedChange(!expanded, expanded ? 'toggle' : 'open');
  }, [expanded, onExpandedChange]);

  // Close requests are only meaningful while expanded — the guard lives here
  // so rail-cell item presses don't fire a spurious `onExpandedChange(false)`.
  const requestClose = useCallback(
    (reason: SideMenuCloseReason) => {
      if (!expanded) return;
      onExpandedChange(false, reason);
    },
    [expanded, onExpandedChange],
  );

  useSideMenuWebClose({ expanded, surfaceRef, requestClose, initialFocusRef });

  const configValue = useMemo(
    () => ({ tier, railWidth, activeItemId, onItemPress, reducedMotion, setInitialFocus }),
    [tier, railWidth, activeItemId, onItemPress, reducedMotion, setInitialFocus],
  );
  // SharedValues are stable refs and never invalidate this memo.
  const stateValue = useMemo(
    () => ({
      expanded,
      progress: animation.progress,
      crossfade: animation.crossfade,
      isExpanding: animation.isExpanding,
      toggle,
      requestClose,
    }),
    [expanded, animation.progress, animation.crossfade, animation.isExpanding, toggle, requestClose],
  );

  const surfaceStyle = useSideMenuSurfaceStyle(animation, railWidth);
  const railLayerStyle = useSideMenuRailLayerStyle(animation, reducedMotion);

  const handleBackdropPress = useCallback(() => requestClose('outside'), [requestClose]);

  return (
    <SideMenuConfigContext.Provider value={configValue}>
      <SideMenuStateContext.Provider value={stateValue}>
        {/* PLACEHOLDER — in-flow, reserves the rail width, carries the shell-scoped elevation. */}
        <View style={[styles.placeholder, { width: railWidth }, style]} testID={testID}>
          {/* BACKDROP — mounted only while expanded; sibling BELOW the surface. */}
          {expanded ? <SideMenuBackdrop onPress={handleBackdropPress} /> : null}
          {/* SURFACE — absolute within the placeholder; animated width + end radii; clip reveal.
              NO navigation landmark here — EtAppLayout stamps it on the SideMenu slot (nesting
              two navigation landmarks doubles the entry in the AT landmark list).
              tabIndex -1: a click on NON-focusable panel content (padding, headings, the
              loading tile) must focus the surface itself, not blur to body — a body blur
              fires `focusout` with a null relatedTarget and the web close hook reads that
              as "left the menu". Also keeps Safari item clicks inside: its buttons are not
              mouse-focusable, so focus walks up to the nearest mouse-focusable ancestor. */}
          <Animated.View ref={surfaceRef} style={[styles.surface, { backgroundColor: colors.backgroundBase }, surfaceStyle]} tabIndex={-1}>
            {/* RAIL LAYER — absolute fill at rail width; not rendered at tier -1. */}
            {/* The INACTIVE layer is opacity-0 but stays mounted, so it must also be
                hidden from AT (aria-hidden flips with `expanded`, like pointerEvents)
                and from the tab order (subcomponents drive Pressable `focusable` AND
                an explicit `tabIndex` from layer × expanded — RNW 0.21 ignores
                `focusable={false}`) — otherwise every item announces twice and
                Tab lands on invisible controls. */}
            {tier !== -1 ? (
              <SideMenuLayerContext.Provider value="rail">
                <SideMenuRailHoverContext.Provider value={railHovered}>
                  <Animated.View
                    aria-hidden={expanded}
                    onPointerEnter={handleRailPointerEnter}
                    onPointerLeave={handleRailPointerLeave}
                    style={[styles.railLayer, { width: railWidth }, expanded ? styles.pointerNone : styles.pointerAuto, railLayerStyle]}
                  >
                    <View style={styles.railTopGroup}>
                      {headerChild}
                      {profileChild}
                    </View>
                    <View style={styles.railGroup}>{sectionChildren}</View>
                    <View style={styles.railGroup}>{footerChild}</View>
                  </Animated.View>
                </SideMenuRailHoverContext.Provider>
              </SideMenuLayerContext.Provider>
            ) : null}
            {/* PANEL LAYER — fixed 280 width so labels never re-wrap mid-animation. NO footer (rail-only). */}
            <SideMenuLayerContext.Provider value="panel">
              <View aria-hidden={!expanded} style={[styles.panelLayer, expanded ? styles.pointerAuto : styles.pointerNone]}>
                {headerChild}
                {profileChild}
                {tileChild}
                <ScrollView showsVerticalScrollIndicator={false} style={styles.panelMenu}>
                  {sectionChildren}
                </ScrollView>
              </View>
            </SideMenuLayerContext.Provider>
          </Animated.View>
        </View>
      </SideMenuStateContext.Provider>
    </SideMenuConfigContext.Provider>
  );
}

export const EtSideMenu = Object.assign(React.memo(EtSideMenuBase), {
  Header: SideMenuHeader,
  Profile: SideMenuProfile,
  Tile: SideMenuTile,
  Section: SideMenuSection,
  Item: SideMenuItem,
  Footer: SideMenuFooter,
});

EtSideMenu.displayName = 'EtSideMenu';

const styles = StyleSheet.create({
  placeholder: {
    height: '100%',
    zIndex: Z_SHELL_MENU,
  },
  surface: {
    position: 'absolute',
    start: 0,
    top: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  railLayer: {
    position: 'absolute',
    start: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: MENU_VERTICAL_PADDING,
  },
  railTopGroup: {
    alignItems: 'center',
    gap: HEADER_PROFILE_GAP,
  },
  railGroup: {
    alignItems: 'center',
  },
  panelLayer: {
    flex: 1,
    width: PANEL_WIDTH,
    paddingVertical: MENU_VERTICAL_PADDING,
  },
  panelMenu: {
    flex: 1,
    marginTop: PANEL_BLOCK_GAP,
  },
  // pointerEvents flips immediately on state change (not at animation end).
  pointerAuto: {
    pointerEvents: 'auto',
  },
  pointerNone: {
    pointerEvents: 'none',
  },
});
