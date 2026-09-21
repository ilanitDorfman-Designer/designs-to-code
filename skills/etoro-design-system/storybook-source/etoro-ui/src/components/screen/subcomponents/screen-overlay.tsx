import { memo, ReactNode, useEffect } from 'react';

import { useScreenContext } from '../api/context';

/**
 * Props for {@link ScreenOverlay} / `<EtScreenOverlay>`.
 *
 * The overlay is a screen-level slot for content that must sit ABOVE the scrolled body but BELOW
 * the topbar — e.g. a progressive-blur backdrop, a scroll-driven compact title that fades in next
 * to the leading action, or a floating ticker badge. Anchored to the physical screen top so
 * `position: 'absolute', top: 0` inside the overlay reaches behind the status bar.
 */
export interface ScreenOverlayProps {
  /**
   * Overlay content. Hoisted by the screen shell to an absolute, full-width,
   * `pointerEvents="box-none"` wrapper, so taps pass through to the underlying body unless an
   * inner element is interactive.
   */
  children?: ReactNode;
}

/**
 * `<EtScreenOverlay>` — screen-level overlay slot.
 *
 * Registers its `children` with the screen context; the shell ({@link ScreenContentRenderer})
 * paints them into a fixed, full-screen wrapper that sits BETWEEN the scrolled body and the
 * topbar. Because registration is context-based (not partition), the overlay can be declared at
 * ANY depth inside `<EtScreenV2>` — consumers don't have to hoist their data up to the screen
 * root just to opt into the overlay slot.
 *
 * Layering (bottom → top):
 *   1. Scrolled body content (zIndex 0)
 *   2. Overlay (zIndex 999, painted by the screen shell)
 *   3. TopBar / animated header (zIndex 1000)
 *
 * Pairs with two contract changes:
 *   - The screen's SafeAreaView drops its top edge so the overlay reaches behind the status bar.
 *   - The body's auto top inset is dropped (EtScreenV2 stops protecting your content), so scroll
 *     owners can render items behind the topbar where the blur applies. Consumers take over:
 *       - Scroll owners → `contentContainerStyle.paddingTop = headerAreaHeight`
 *       - Static branches (loading/error/empty) → wrap in `View` with `paddingTop: headerAreaHeight`
 *     Read `headerAreaHeight` from `useScreenContext()`.
 *
 * @example Progressive-blur backdrop pinned to the status bar
 * ```tsx
 * <EtScreenV2 animateHalo>
 *   <EtTopbar style={transparentTopbarStyle}>
 *     <EtTopbar.Middle>
 *       <TopNavBar transparent />
 *     </EtTopbar.Middle>
 *   </EtTopbar>
 *   <BodyList />
 *   <EtScreenOverlay>
 *     <ScrollDrivenBlurBackdrop />
 *     <ScrollDrivenCompactTitle />
 *   </EtScreenOverlay>
 * </EtScreenV2>
 * ```
 */
function ScreenOverlayComponent({ children }: ScreenOverlayProps) {
  const { registerOverlay, unregisterOverlay } = useScreenContext();

  // Split into two effects so the cleanup does NOT run on every children change. If unmount were
  // chained to children deps, every parent re-render would briefly toggle `hasOverlay` false→true
  // — that toggle invalidates the main `ScreenContext` value and re-renders every consumer
  // (including the parent screen), feeding new JSX back in and looping forever.
  //
  // Content effect: runs on every children change. `registerOverlay` updates the dedicated
  // overlay context (not `ScreenContext`) and only flips `hasOverlay` on the first call (Object.is
  // bailout afterwards). Net effect on the main context: zero re-renders past the first mount.
  useEffect(() => {
    registerOverlay(children ?? null);
  }, [children, registerOverlay]);

  // Lifecycle effect: cleanup fires only when the overlay unmounts, restoring `hasOverlay=false`
  // and clearing the published node so the screen shell drops back to its default top inset.
  useEffect(() => {
    return () => {
      unregisterOverlay();
    };
  }, [unregisterOverlay]);

  return null;
}

export const ScreenOverlay = memo(ScreenOverlayComponent);
ScreenOverlay.displayName = 'EtScreenOverlay';
