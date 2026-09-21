import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { runOnJS, useAnimatedReaction } from 'react-native-reanimated';

import { useReducedMotion } from '../../../../core/hooks/accessibility/use-reduced-motion';
import { useBreakpoint } from '../../../../core/hooks/use-breakpoint';
import { useBreakpointTier } from '../../../../core/hooks/use-breakpoint-tier';
import { useEtoroTheme } from '../../../../core/hooks/use-etoro-theme';
import { useHover } from '../../../../core/hooks/use-hover';
import { useLayoutDirection } from '../../../../core/hooks/use-layout-direction';
import { BREAKPOINT_ASIDE_INLINE, BREAKPOINT_TABLET } from '../../../../core/styles/breakpoints';
import { create } from '../../../../utils/create';
import type { EtAppLayoutAsideProps } from '../api/types';
import {
  ASIDE_GAP_INLINE,
  ASIDE_GAP_OVERLAY,
  ASIDE_WIDTH_TIERS,
  DEFAULT_TOGGLE_LABELS,
  PANEL_PADDING,
  PANEL_START_RADIUS,
  panelWidthForTier,
  surfaceShadow,
} from '../constants';
import {
  useAsideAnimation,
  useAsidePanelLayerStyle,
  useAsidePlaceholderStyle,
  useAsideRailLayerStyle,
  useAsideSurfaceStyle,
} from '../hooks/use-aside-animation';
import { useAsideWebClose } from '../hooks/use-aside-web-close';
import type { SlotComponent } from './app-layout-slots';
import { AsideToggle } from './aside-toggle';
import { getRailBlurStyle } from './web-styles';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const railBlurStyle = getRailBlurStyle();

/**
 * EtAppLayout.Aside — the controlled rail/panel machine (the EtSideMenu
 * placeholder/surface pattern mirrored to the end edge). An in-flow
 * PLACEHOLDER reserves rail width (animating to panel width when inline-open);
 * the SURFACE is absolute and end-anchored, so in overlay mode (<1440) it
 * grows leftward OVER main content. No backdrop, ever — outside clicks land on
 * main content, only the surface's own bounds catch; close is
 * button-only, while a press anywhere on the closed rail body expands.
 *
 * Both visual states stay mounted as two crossfading layers (rail Pressable +
 * panel content frame) with pointerEvents/aria-hidden/tabIndex flipping per
 * layer; the toggle is ONE persistent button outside both layers. The panel
 * layer additionally goes `display: none` once the collapse settles: its
 * children are ARBITRARY app content the kit cannot tab-gate per element, and
 * aria-hidden/pointerEvents alone leave them in the web tab order. Below
 * `BREAKPOINT_TABLET` the machine suppresses itself (0-width placeholder,
 * `display: none` surface — layers stay mounted in React), regardless of slot
 * presence. NEVER add `entering`/`exiting` animations anywhere in this family.
 */
function AppLayoutAsideBase({ children, expanded, onExpandedChange, toggleAccessibilityLabels, testID }: EtAppLayoutAsideProps) {
  const { colors } = useEtoroTheme();
  const reducedMotion = useReducedMotion();
  const suppressed = !useBreakpoint(BREAKPOINT_TABLET);
  const isInline = useBreakpoint(BREAKPOINT_ASIDE_INLINE);
  const panelWidth = panelWidthForTier(useBreakpointTier(ASIDE_WIDTH_TIERS));
  const dirSign = useLayoutDirection() === 'rtl' ? -1 : 1;
  const { isHovered, hoverProps } = useHover();

  const animation = useAsideAnimation({ expanded, isInline, railHovered: isHovered, reducedMotion });

  const railActive = !expanded && !suppressed;
  const panelActive = expanded && !suppressed;

  // The rail layer fills the whole surface, and the surface keeps covering main
  // content for the length of the collapse — going live the instant `expanded`
  // flips turns that shrinking overlay into an expand button, swallowing clicks
  // aimed at the content beneath and re-opening the panel. Pointer interactivity
  // therefore trails the GEOMETRY (progress back at 0), which also covers the
  // snap paths: reduced motion and 1440 crossings set `progress` directly.
  // a11y/tab-order still follow the intent, so keyboard users never see a gap.
  const [atRail, setAtRail] = useState(!expanded);
  useAnimatedReaction(
    () => animation.progress.get() === 0,
    (settled, previous) => {
      if (settled !== previous) {
        runOnJS(setAtRail)(settled);
      }
    },
  );
  const railPressable = railActive && atRail;
  // `display: none` only once the collapse SETTLES (the crossfade needs the
  // layer visible); restored synchronously on expand — `expanded` flips in the
  // same render, before the animation leaves progress 0.
  const panelHidden = !expanded && atRail;

  // Rail-press focus hand-off: the rail goes inert on expand, so focus
  // must land on the persistent toggle — the only control left.
  const toggleRef = useRef<View>(null);
  const railPressPendingRef = useRef(false);
  useEffect(() => {
    if (expanded && railPressPendingRef.current) {
      (toggleRef.current as { focus?: () => void } | null)?.focus?.();
    }
    railPressPendingRef.current = false;
  }, [expanded]);

  // Expand only — closing is button-only; the guard also keeps presses on
  // an inert rail (already expanded, mid-collapse, suppressed) from firing.
  const handleRailPress = useCallback(() => {
    if (!railPressable) {
      return;
    }
    // The rail just went inert under the pointer, and a `pointerleave` at a
    // dead element is not guaranteed across engines — without this the next
    // collapse would rest at the 68px hover width.
    hoverProps.onHoverOut();
    railPressPendingRef.current = true;
    onExpandedChange(true, 'rail');
  }, [hoverProps, onExpandedChange, railPressable]);

  const handleTogglePress = useCallback(() => {
    onExpandedChange(!expanded, 'button');
  }, [expanded, onExpandedChange]);

  /*
   * Escape dismisses the panel while it overlays main content (a11y F20); in-flow it is part of the
   * page, so there is nothing to dismiss. Reported as `escape`, not `button` — the funnel would
   * otherwise record a keyboard dismiss as a toggle press. Focus goes back to the toggle, which is
   * the control that opened the panel and the only one left once it closes; without that, Escape
   * strands focus inside a subtree it just made `aria-hidden`.
   */
  const requestClose = useCallback(() => {
    onExpandedChange(false, 'escape');
    (toggleRef.current as { focus?: () => void } | null)?.focus?.();
  }, [onExpandedChange]);
  useAsideWebClose({ dismissible: panelActive && !isInline, requestClose });

  const placeholderStyle = useAsidePlaceholderStyle(animation, isInline, suppressed, panelWidth);
  const surfaceStyle = useAsideSurfaceStyle(animation, panelWidth);
  const railLayerStyle = useAsideRailLayerStyle(animation, reducedMotion);
  const panelLayerStyle = useAsidePanelLayerStyle(animation, reducedMotion, dirSign);

  return (
    /* PLACEHOLDER — in-flow; reserves the rail width + gap (0 when suppressed). */
    <Animated.View
      style={[styles.placeholder, suppressed ? styles.noGap : { marginStart: isInline ? ASIDE_GAP_INLINE : ASIDE_GAP_OVERLAY }, placeholderStyle]}
      testID={testID}
    >
      {/* SURFACE — absolute, END-anchored; animated width; start-corner radii
          (CSS-logical names — the left-menu convention; reanimated's web
          driver drops RN-logical radius names, so the family never uses them);
          constant shadow cast over main content in every state (Figma). */}
      <Animated.View
        aria-hidden={suppressed}
        onLayout={(event) => animation.surfaceHeight.set(event.nativeEvent.layout.height)}
        style={[styles.surface, { boxShadow: surfaceShadow(dirSign) }, suppressed && styles.suppressed, surfaceStyle]}
        testID={testID ? `${testID}-surface` : undefined}
      >
        {/* PANEL LAYER — fixed tier width, end-anchored so content never moves
            or re-wraps while the surface clip-reveals it. */}
        <Animated.View
          aria-hidden={!panelActive}
          role="complementary"
          style={[
            styles.panelLayer,
            { backgroundColor: colors.backgroundElevated, width: panelWidth },
            panelActive ? styles.pointerAuto : styles.pointerNone,
            panelHidden && styles.hidden,
            panelLayerStyle,
          ]}
          testID={testID ? `${testID}-panel` : undefined}
        >
          {children}
        </Animated.View>
        {/* RAIL LAYER — a full-height press-to-open button (product decision);
            translucent fill over main content, blur via the web-styles twin. */}
        <AnimatedPressable
          {...hoverProps}
          accessibilityLabel={toggleAccessibilityLabels?.expand ?? DEFAULT_TOGGLE_LABELS.expand}
          accessibilityRole="button"
          aria-hidden={!railActive}
          focusable={railActive}
          onPress={handleRailPress}
          style={[
            styles.railLayer,
            { backgroundColor: colors.overlayBottom },
            railBlurStyle,
            railPressable ? styles.pointerAuto : styles.pointerNone,
            railLayerStyle,
          ]}
          // RNW 0.21 Pressable ignores focusable={false} (side-menu precedent).
          tabIndex={railActive ? 0 : -1}
          testID={testID ? `${testID}-rail` : undefined}
        />
        {/* TOGGLE — ONE persistent button outside both crossfade layers. */}
        <AsideToggle
          animation={animation}
          dirSign={dirSign}
          expanded={expanded}
          hoverProps={hoverProps}
          labels={toggleAccessibilityLabels}
          onPress={handleTogglePress}
          ref={toggleRef}
          suppressed={suppressed}
          testID={testID ? `${testID}-toggle` : undefined}
        />
      </Animated.View>
    </Animated.View>
  );
}

export const AppLayoutAside = create(AppLayoutAsideBase, 'EtAppLayout.Aside') as SlotComponent<EtAppLayoutAsideProps>;
AppLayoutAside.__SLOT_TYPE = 'aside';

const styles = StyleSheet.create({
  placeholder: {
    height: '100%',
  },
  noGap: {
    marginStart: 0,
  },
  surface: {
    position: 'absolute',
    end: 0,
    top: 0,
    bottom: 0,
    overflow: 'hidden',
    borderStartStartRadius: PANEL_START_RADIUS,
    borderEndStartRadius: PANEL_START_RADIUS,
  },
  panelLayer: {
    position: 'absolute',
    end: 0,
    top: 0,
    bottom: 0,
    padding: PANEL_PADDING,
  },
  railLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  // Sub-768 self-suppression: permanently mounted in React, but display-cut —
  // invisible, inert AND out of the tab order in one property.
  suppressed: {
    display: 'none',
  },
  // The settled-collapsed panel layer: same tab-order reasoning as above.
  hidden: {
    display: 'none',
  },
  // The panel layer flips on state change; the rail layer waits for the
  // collapse to land (see `railPressable`).
  pointerAuto: {
    pointerEvents: 'auto',
  },
  pointerNone: {
    pointerEvents: 'none',
  },
});
