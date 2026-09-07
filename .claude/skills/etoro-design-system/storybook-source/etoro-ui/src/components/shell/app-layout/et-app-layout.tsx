import { isValidElement } from 'react';
import { StyleSheet, View } from 'react-native';

import { useEtoroTheme } from '../../../core/hooks/use-etoro-theme';
import { Z_SHELL_ASIDE, Z_SHELL_CONTENT, Z_SHELL_MENU } from '../../../core/styles/z-index';
import { create } from '../../../utils/create';
import type { EtAppLayoutProps, EtAppLayoutSideMenuProps } from './api/types';
import { DEFAULT_SIDE_MENU_LANDMARK_LABEL } from './constants';
import { useAppLayoutChildren } from './hooks/use-app-layout-children';
import { AppLayoutAside, AppLayoutMain, AppLayoutSideMenu, AppLayoutTopPanel } from './subcomponents';

/**
 * EtAppLayout — the web shell's app-layout skeleton: left menu + top panel +
 * main content + optional right-side aside, composed as slots. A PURE slotted
 * shell: the app composes `EtSideMenu`/`EtTopPanel` into the slots (their
 * wiring is app logic) — the kit owns only the three-column geometry, the
 * `backgroundBase` page canvas, and sibling-scoped z-placement.
 *
 * The skeleton also stamps the page landmarks — navigation / banner / main —
 * so assistive tech can jump between the frame's regions. The aside stamps its
 * own `complementary` inside `EtAppLayout.Aside`. The navigation landmark
 * lives HERE and only here (`EtSideMenu` carries none — nesting two doubles
 * the entry in the AT landmark list), labelled from the SideMenu slot's
 * `accessibilityLabel` (default 'Main navigation').
 *
 * Stable-navigator invariant (hard): the full skeleton below renders
 * UNCONDITIONALLY — slot presence toggles content INSIDE stable Views, so
 * crossing 768 / full-bleed routes / aside presence never remounts `Main`'s
 * children (the navigator keeps its state). Never make a skeleton View
 * conditional.
 *
 * @example
 * ```tsx
 * <EtAppLayout>
 *   <EtAppLayout.SideMenu>{composedSideMenu}</EtAppLayout.SideMenu>
 *   <EtAppLayout.TopPanel>{composedTopPanel}</EtAppLayout.TopPanel>
 *   <EtAppLayout.Main>{navigator}</EtAppLayout.Main>
 *   <EtAppLayout.Aside expanded={asideExpanded} onExpandedChange={setAsideExpanded}>
 *     {asideContent}
 *   </EtAppLayout.Aside>
 * </EtAppLayout>
 * ```
 */
function EtAppLayoutBase({ children, style, testID }: EtAppLayoutProps) {
  const { colors } = useEtoroTheme();
  const { sideMenuChild, topPanelChild, mainChild, asideChild } = useAppLayoutChildren(children);

  // The slot View IS the navigation landmark (EtSideMenu carries none — one
  // landmark, not two nested), so its label comes off the slot element.
  const sideMenuLabel = isValidElement<EtAppLayoutSideMenuProps>(sideMenuChild)
    ? (sideMenuChild.props.accessibilityLabel ?? DEFAULT_SIDE_MENU_LANDMARK_LABEL)
    : undefined;

  return (
    <View style={[styles.row, { backgroundColor: colors.backgroundBase }, style]} testID={testID}>
      {/* Z_SHELL_MENU vs Z_SHELL_CONTENT — sibling-scoped among the row's children only. */}
      {/* The role follows the CONTENT, not the View. The skeleton Views are unconditional (the
          stable-navigator invariant needs that), but at phone width and on frameless routes their
          slots are empty — and an empty `navigation` / `banner` landmark on every page is noise in
          the landmark list. */}
      <View
        accessibilityLabel={sideMenuLabel}
        role={sideMenuChild ? 'navigation' : undefined}
        style={styles.sideMenuSlot}
        testID="et-app-layout-side-menu"
      >
        {sideMenuChild}
      </View>
      <View style={styles.contentColumn} testID="et-app-layout-content">
        <View role={topPanelChild ? 'banner' : undefined} testID="et-app-layout-top-panel">
          {topPanelChild}
        </View>
        <View style={styles.bodyRow} testID="et-app-layout-body">
          <View role="main" style={styles.main} testID="et-app-layout-main">
            {mainChild}
          </View>
          {/* Z_SHELL_ASIDE — a DIFFERENT sibling scope: competes only with Main among Body-row children. */}
          <View style={styles.asideSlot} testID="et-app-layout-aside">
            {asideChild}
          </View>
        </View>
      </View>
    </View>
  );
}

export const EtAppLayout = Object.assign(create(EtAppLayoutBase, 'EtAppLayout'), {
  SideMenu: AppLayoutSideMenu,
  TopPanel: AppLayoutTopPanel,
  Main: AppLayoutMain,
  Aside: AppLayoutAside,
});

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  sideMenuSlot: {
    zIndex: Z_SHELL_MENU,
  },
  contentColumn: {
    flex: 1,
    zIndex: Z_SHELL_CONTENT,
  },
  bodyRow: {
    flex: 1,
    flexDirection: 'row',
  },
  main: {
    flex: 1,
  },
  asideSlot: {
    zIndex: Z_SHELL_ASIDE,
  },
});
