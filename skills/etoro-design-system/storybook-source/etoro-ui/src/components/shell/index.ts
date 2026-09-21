/**
 * The web app frame: the layout skeleton, the side menu and the top panel.
 *
 * Deliberately NOT re-exported from the `etoro-ui` root barrel. The root barrel
 * is not tree-shaken and has ~1,600 importers, so anything in it ships to
 * native. This family is web-only, so it is reached through its own subpath —
 * `import { EtAppLayout } from 'etoro-ui/shell'` — and leaves the native module
 * graph entirely.
 */
export { EtAppLayout } from './app-layout';
export type {
  AppLayoutAsideTrigger,
  EtAppLayoutAsideProps,
  EtAppLayoutMainProps,
  EtAppLayoutProps,
  EtAppLayoutSideMenuProps,
  EtAppLayoutTopPanelProps,
} from './app-layout/api';
export { ASIDE_WIDTH_TIERS, frameOccupiedWidth, panelWidthForTier } from './app-layout/constants';
export { EtSideMenu, EtSideMenuTrigger, PANEL_WIDTH, RAIL_WIDTH_BY_TIER, railWidthForTier, WORDMARK_GLYPH_HEIGHT } from './side-menu';
export type {
  EtSideMenuFooterProps,
  EtSideMenuHeaderProps,
  EtSideMenuItemProps,
  EtSideMenuProfileProps,
  EtSideMenuProps,
  EtSideMenuSectionProps,
  EtSideMenuTileProps,
  EtSideMenuTriggerProps,
  SideMenuCloseReason,
  SideMenuTier,
} from './side-menu/api';
export { EtTopPanel, TOP_PANEL_HEIGHT_REGULAR, TOP_PANEL_HEIGHT_TALL } from './top-panel';
export type {
  EtTopPanelActionsProps,
  EtTopPanelLeadingProps,
  EtTopPanelProps,
  EtTopPanelSearchProps,
  EtTopPanelToriBadgeProps,
} from './top-panel/api';
