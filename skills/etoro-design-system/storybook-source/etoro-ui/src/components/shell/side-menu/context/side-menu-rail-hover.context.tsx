import { createContext, useContext } from 'react';

/**
 * Web-only: true while the pointer is anywhere over the collapsed rail. The
 * Header consumes it so the whole rail — not just the logo button — reveals
 * the expand glyph. Provided around the rail layer only; the panel layer's
 * consumers read the default `false`.
 */
export const SideMenuRailHoverContext = createContext(false);

export const useSideMenuRailHover = (): boolean => useContext(SideMenuRailHoverContext);
