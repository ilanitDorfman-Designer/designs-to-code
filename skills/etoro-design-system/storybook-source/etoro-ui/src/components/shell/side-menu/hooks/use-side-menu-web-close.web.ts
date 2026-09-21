import { useEffect, useRef } from 'react';

import { useDismissable } from '../../../../core/web/use-dismissable';
import type { SideMenuFocusHandle, UseSideMenuWebCloseOptions } from '../api/types';

// Minimal structural DOM typing: this lib does not include the TS "dom" lib.
interface FocusOutEventLike {
  relatedTarget: unknown;
}
interface SurfaceNodeLike {
  contains?: (node: unknown) => boolean;
  focus?: () => void;
  addEventListener?: (type: 'focusout', handler: (event: FocusOutEventLike) => void) => void;
  removeEventListener?: (type: 'focusout', handler: (event: FocusOutEventLike) => void) => void;
}
interface DocumentLike {
  activeElement?: SideMenuFocusHandle | null;
  body?: unknown;
}

const getDocument = (): DocumentLike | undefined => (globalThis as unknown as { document?: DocumentLike }).document;

/**
 * Web close behaviors for the expanded panel:
 * - focus the panel toggle on open; on close (or unmount while expanded)
 *   restore focus to the opener — UNLESS the close was focus-driven (a
 *   focus-driven dismiss must not yank focus back, ARIA APG). Escape/toggle/
 *   item leave focus inside the surface and outside-click keeps it there
 *   (backdrop preventDefaults mousedown), so both restore; a Tab/click-driven
 *   'focusout' close leaves it on the new target and skips. The skip travels
 *   via a ref, NOT the activeElement heuristic alone: at cleanup time the
 *   browser's Tab target has not received focus yet (focusout dispatches
 *   before the new focus lands, and React flushes the discrete close
 *   synchronously), so activeElement still looks "inside" and restoring
 *   would win over the pending Tab move.
 * - Escape closes via the shared dismiss stack (`core/web/use-dismissable`):
 *   the panel registers while expanded, and only the TOPMOST open layer
 *   receives an Escape — stacked overlays can never double-close;
 * - focusout closes when focus leaves the surface subtree (`relatedTarget`
 *   null — body/devtools — counts as outside; the backdrop already covers the
 *   pointer path). Clicks on non-focusable content INSIDE the panel never take
 *   this path: the surface carries `tabIndex={-1}` (see `EtSideMenu`), so such
 *   a click focuses the surface itself and `relatedTarget` stays inside.
 */
export function useSideMenuWebClose({ expanded, surfaceRef, requestClose, initialFocusRef }: UseSideMenuWebCloseOptions): void {
  // Set by the focusout close path right before requestClose so the restore
  // cleanup below knows the dismiss was focus-driven (see docblock).
  const focusOutCloseRef = useRef(false);

  // Focus management: capture the opener + focus the panel toggle on open; the
  // cleanup (runs on collapse AND on unmount while expanded) restores the opener.
  useEffect(() => {
    if (!expanded) return;
    const doc = getDocument();
    if (!doc) return;
    focusOutCloseRef.current = false;
    const opener = doc.activeElement ?? null;
    // Captured now (lint: ref may be cleared before cleanup) — the surface node
    // never remounts, so the identity is stable for the whole expanded phase.
    const surface = surfaceRef.current as unknown as SurfaceNodeLike | null;
    // The Header registers its toggle as the initial focus target. A menu
    // composed WITHOUT a Header still needs focus to enter the panel (the
    // focusout close only works from inside) — fall back to the surface
    // itself, which is programmatically focusable (tabIndex -1).
    (initialFocusRef.current ?? surface)?.focus?.();
    return () => {
      const focusOutClose = focusOutCloseRef.current;
      focusOutCloseRef.current = false;
      if (focusOutClose) return; // APG: never yank focus back on a focus-driven dismiss.
      const active = doc.activeElement;
      const activeInSurface = surface?.contains?.(active) === true;
      const focusMovedElsewhere = active != null && active !== doc.body && !activeInSurface;
      if (!focusMovedElsewhere) {
        opener?.focus?.();
      }
    };
  }, [expanded, initialFocusRef, surfaceRef]);

  // Escape — on the dismiss stack only while expanded.
  useDismissable({ active: expanded, onDismiss: () => requestClose('escape') });

  // focusout — close when focus leaves the surface subtree.
  useEffect(() => {
    if (!expanded) return;
    // On react-native-web the View ref IS the underlying DOM element.
    const node = surfaceRef.current as unknown as SurfaceNodeLike | null;
    if (!node?.addEventListener) return;
    const handleFocusOut = (event: FocusOutEventLike) => {
      const next = event.relatedTarget;
      if (!next || !node.contains?.(next)) {
        focusOutCloseRef.current = true;
        requestClose('focusout');
      }
    };
    node.addEventListener('focusout', handleFocusOut);
    return () => node.removeEventListener?.('focusout', handleFocusOut);
  }, [expanded, surfaceRef, requestClose]);
}
