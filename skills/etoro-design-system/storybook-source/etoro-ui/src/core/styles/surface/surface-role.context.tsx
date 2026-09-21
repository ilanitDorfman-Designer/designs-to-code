import { createContext, ReactNode, useContext } from 'react';

// The hook FILE, not the hooks barrel: the barrel also carries liquid glass and the Skia canvas and
// runtime, and this module is imported by painters all over the kit.
import { useEtoroTheme } from '../../hooks/use-etoro-theme';
import { resolveSurface, SurfaceRole } from './resolve-surface';

/**
 * The surface role of the region a component renders in.
 *
 * Defaults to `base`, so every painter that reads it keeps its current colour
 * unless something above it says otherwise. Only the web app frame provides a
 * different role — native never mounts a provider, so native output is
 * unchanged by construction (no width read, no `Platform.OS`).
 */
const SurfaceRoleContext = createContext<SurfaceRole>('base');

export interface SurfaceRoleProviderProps {
  role: SurfaceRole;
  children: ReactNode;
}

/** Declares the surface role for everything rendered below it. */
export function SurfaceRoleProvider({ role, children }: SurfaceRoleProviderProps) {
  return <SurfaceRoleContext.Provider value={role}>{children}</SurfaceRoleContext.Provider>;
}

/** The role of the current region, without resolving it to a colour. */
export function useSurfaceRole(): SurfaceRole {
  return useContext(SurfaceRoleContext);
}

/**
 * The background colour of the current region.
 *
 * Pass `role` to paint a fixed role regardless of the region (e.g. a menu
 * surface inside an elevated one); omit it to follow the region.
 */
export function useSurfaceColor(role?: SurfaceRole): string {
  const regionRole = useContext(SurfaceRoleContext);
  const { colors } = useEtoroTheme();
  return resolveSurface(role ?? regionRole, colors);
}
