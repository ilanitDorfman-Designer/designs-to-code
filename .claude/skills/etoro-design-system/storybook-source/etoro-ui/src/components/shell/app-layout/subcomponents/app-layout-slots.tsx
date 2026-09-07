import type { ComponentType, MemoExoticComponent } from 'react';

import { create } from '../../../../utils/create';
import type { AppLayoutSlotType, EtAppLayoutMainProps, EtAppLayoutSideMenuProps, EtAppLayoutTopPanelProps } from '../api/types';

/**
 * EtAppLayout slots are pure content carriers: the root classifies them by
 * their `__SLOT_TYPE` static (minification-safe, unlike displayName) and
 * renders them inside its own permanently-mounted skeleton Views — the
 * stable-navigator invariant. All geometry lives on the root's skeleton, so
 * the slots render nothing but their children. The exception is `Aside` —
 * the rail/panel machine in `app-layout-aside.tsx`.
 */
export type SlotComponent<Props extends object> = MemoExoticComponent<ComponentType<Props>> & { __SLOT_TYPE: AppLayoutSlotType };

function AppLayoutSideMenuBase({ children }: EtAppLayoutSideMenuProps) {
  return children;
}

export const AppLayoutSideMenu = create(AppLayoutSideMenuBase, 'EtAppLayout.SideMenu') as SlotComponent<EtAppLayoutSideMenuProps>;
AppLayoutSideMenu.__SLOT_TYPE = 'side-menu';

function AppLayoutTopPanelBase({ children }: EtAppLayoutTopPanelProps) {
  return children;
}

export const AppLayoutTopPanel = create(AppLayoutTopPanelBase, 'EtAppLayout.TopPanel') as SlotComponent<EtAppLayoutTopPanelProps>;
AppLayoutTopPanel.__SLOT_TYPE = 'top-panel';

function AppLayoutMainBase({ children }: EtAppLayoutMainProps) {
  return children;
}

export const AppLayoutMain = create(AppLayoutMainBase, 'EtAppLayout.Main') as SlotComponent<EtAppLayoutMainProps>;
AppLayoutMain.__SLOT_TYPE = 'main';
