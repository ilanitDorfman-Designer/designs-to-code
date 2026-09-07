/**
 * Viewport-width breakpoint tokens — tablet/desktop flip points plus the
 * desktop shell-tier scale (`SHELL_TIERS`).
 * Decision: responsive layouts branch on window width via these tokens (never
 * on Platform.OS), and web-only adoption happens in per-screen .web.tsx
 * layout shells so native stays untouched.
 */

/**
 * Content columns stop stretching and become fixed-width & centered; also the
 * flip point for desktop chrome (shell, route modals, dialogs). Matches the
 * eToro-Plus-Web-Temp fork's `WEB_DESKTOP_MIN_WIDTH` so its desktop-UX systems
 * port onto this token unchanged.
 */
export const BREAKPOINT_TABLET = 768;

/**
 * Split layouts (`EtSplitLayout`) activate: aside panes mount and the screen
 * divides into columns.
 */
export const BREAKPOINT_DESKTOP = 1024;

/**
 * Top-panel height flip point: `EtTopPanel` is 76px below, 84px at/above
 * (PO-specified within Figma's (1060, 1280] frame gap). Consumed via
 * `useBreakpoint(BREAKPOINT_DESKTOP_S)`.
 *
 * This is NOT a shell tier and must NOT be added to `SHELL_TIERS`: the tier
 * array index-couples to `RAIL_WIDTH_BY_TIER` and the shipped
 * `SideMenuTier = -1 | 0 | 1 | 2` API, so inserting 1280 there would renumber
 * SideMenuTier across the side-menu surface for a threshold only the panel
 * height cares about.
 */
export const BREAKPOINT_DESKTOP_S = 1280;

/**
 * Mid desktop shell tier: the side-menu rail widens (72px → 80px).
 */
export const BREAKPOINT_DESKTOP_M = 1366;

/**
 * The app-layout aside flips overlay → inline: below, the open panel floats
 * over main content; at/above, it sits in-flow (main shrinks) and defaults to
 * open. Consumed via `useBreakpoint(BREAKPOINT_ASIDE_INLINE)`.
 *
 * Purpose-named like `BREAKPOINT_DESKTOP_S` and equally NOT a shell tier —
 * do not add it to `SHELL_TIERS` (see that token's docblock).
 */
export const BREAKPOINT_ASIDE_INLINE = 1440;

/**
 * Large desktop shell tier: the side-menu rail widens (80px → 84px).
 */
export const BREAKPOINT_DESKTOP_L = 1720;

/**
 * Canonical ascending thresholds for the desktop shell chrome (side menu +
 * top panel), consumed via `useBreakpointTier(SHELL_TIERS)`: tier `-1` is
 * below `BREAKPOINT_DESKTOP` (rail hidden), `0`/`1`/`2` are the desktop
 * tiers. Single source of truth so shell features can't diverge on the
 * hidden boundary.
 */
export const SHELL_TIERS = [BREAKPOINT_DESKTOP, BREAKPOINT_DESKTOP_M, BREAKPOINT_DESKTOP_L] as const;
