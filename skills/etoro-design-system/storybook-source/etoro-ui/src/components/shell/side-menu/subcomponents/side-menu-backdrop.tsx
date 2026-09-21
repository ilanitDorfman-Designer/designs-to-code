export interface SideMenuBackdropProps {
  onPress: () => void;
}

/**
 * Native variant: no backdrop — the expanded overlay panel is a web-only shell
 * behavior (`position: fixed` is a web-only mechanism). See
 * `side-menu-backdrop.web.tsx` (platform-split per kit convention; no
 * `Platform.OS` branches).
 */
export function SideMenuBackdrop(_props: SideMenuBackdropProps) {
  return null;
}
