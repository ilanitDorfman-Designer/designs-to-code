import { createContext, ReactNode, useContext } from 'react';

/**
 * Desktop shell tier, mirroring the side menu's shipped `SideMenuTier` scale:
 * `-1` = below the first desktop threshold (rail hidden), `0`/`1`/`2` = the
 * desktop tiers of `SHELL_TIERS`.
 */
export type ShellTier = -1 | 0 | 1 | 2;

/** Whether the app frame currently has an aside, and if so whether it is open. */
export type ShellAsideState = 'absent' | 'collapsed' | 'expanded';

/** Everything a component may ask about the app frame around it. */
export interface Shell {
  /**
   * True only when the web app frame is rendering around this subtree — i.e.
   * this viewport has a frame AND the route I am on is a framed one.
   *
   * Ask this when you want to know what is on screen right now. Do NOT ask it to
   * decide what to MOUNT below a frameless route: frameless routes are siblings
   * in the same stack, so the tree underneath them stays mounted and flipping on
   * this field would tear it down and rebuild it on every trip through a trade
   * ticket or a deposit flow. Use {@link Shell.frameWidth} for that.
   */
  isShell: boolean;
  /**
   * True when the viewport is wide enough for the frame, regardless of which
   * route is showing. Constant across a route change, so it is the safe thing to
   * branch a navigator's shape on.
   */
  frameWidth: boolean;
  tier: ShellTier;
  aside: ShellAsideState;
}

/**
 * The answer when there is no app frame: native at every size, web below the
 * frame's breakpoint, and every frameless route.
 */
export const NO_SHELL: Shell = { isShell: false, frameWidth: false, tier: -1, aside: 'absent' };

const ShellContext = createContext<Shell>(NO_SHELL);

export interface ShellProviderProps {
  value: Shell;
  children: ReactNode;
}

/**
 * Publishes the app frame's presence and geometry downward.
 *
 * Mounted by the web `(protected)` layout and by nothing else — so "is the frame
 * here?" is answered by where this provider is, never by a width read or a
 * `Platform.OS` check. Native never mounts it, so `useShell()` is off there by
 * construction, and a real iPad cannot accidentally look like a desktop.
 */
export function ShellProvider({ value, children }: ShellProviderProps) {
  return <ShellContext.Provider value={value}>{children}</ShellContext.Provider>;
}

/** The app frame around this component, or {@link NO_SHELL} when there is none. */
export function useShell(): Shell {
  return useContext(ShellContext);
}

/**
 * Whether the app frame is showing the global actions — search and notifications
 * — for this screen, so the screen should not show its own copies.
 *
 * The rule itself, named once. Four places knew it as an inline `useShell()`
 * check with the same comment copy-pasted above each; this makes it grep as a
 * concept instead of as a habit.
 */
export function useFrameOwnsGlobalActions(): boolean {
  return useShell().isShell;
}
