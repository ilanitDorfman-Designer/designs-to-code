import { Children, ReactNode, useMemo } from 'react';

import { getSlotType, keyed } from '../../slot-children';
import type { AppLayoutChildrenSlots, AppLayoutSlotType } from '../api/types';

/**
 * Classifies EtAppLayout children into SideMenu/TopPanel/Main/Aside slots.
 * Unknown or falsy children are ignored (conditional rendering is safe);
 * every slot takes the first match.
 */
export function useAppLayoutChildren(children: ReactNode): AppLayoutChildrenSlots {
  return useMemo(() => {
    // Children.forEach, not Children.toArray: forEach hands back the ORIGINAL
    // elements, so an author key survives to `keyed` instead of being rewritten.
    const bySlot: Record<AppLayoutSlotType, ReactNode[]> = { 'side-menu': [], 'top-panel': [], main: [], aside: [] };
    Children.forEach(children, (child) => {
      const slot = getSlotType<AppLayoutSlotType>(child);
      // Optional-chained: `getSlotType` is an unchecked cast, so a child from
      // ANOTHER family (carrying its own __SLOT_TYPE, e.g. a stray
      // EtSideMenu.Header) must be ignored — not index a missing bucket.
      if (slot) bySlot[slot]?.push(child);
    });

    const sideMenuMatches = bySlot['side-menu'];
    const topPanelMatches = bySlot['top-panel'];
    const mainMatches = bySlot.main;
    const asideMatches = bySlot.aside;

    if (__DEV__) {
      const slots: ReadonlyArray<[string, ReactNode[]]> = [
        ['SideMenu', sideMenuMatches],
        ['TopPanel', topPanelMatches],
        ['Main', mainMatches],
        ['Aside', asideMatches],
      ];
      for (const [name, matches] of slots) {
        if (matches.length > 1) {
          console.warn(`EtAppLayout: Multiple EtAppLayout.${name} children detected. Only the first will be used.`);
        }
      }
    }

    return {
      sideMenuChild: keyed(sideMenuMatches[0], 'slot-side-menu'),
      topPanelChild: keyed(topPanelMatches[0], 'slot-top-panel'),
      mainChild: keyed(mainMatches[0], 'slot-main'),
      asideChild: keyed(asideMatches[0], 'slot-aside'),
    };
  }, [children]);
}
