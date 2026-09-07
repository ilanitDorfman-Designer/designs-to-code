import { Children, ReactNode, useMemo } from 'react';

import { getSlotType, keyed } from '../../slot-children';
import type { SideMenuChildrenSlots, SideMenuSlotType } from '../api/types';

/**
 * Classifies EtSideMenu children into Header/Profile/Section/Footer slots.
 * Unknown or falsy children are ignored (conditional rendering is safe);
 * multiple sections are allowed, other slots take the first match.
 */
export function useSideMenuChildren(children: ReactNode): SideMenuChildrenSlots {
  return useMemo(() => {
    const sectionChildren: ReactNode[] = [];
    let headerChild: ReactNode | undefined;
    let profileChild: ReactNode | undefined;
    let tileChild: ReactNode | undefined;
    let footerChild: ReactNode | undefined;

    let headerCount = 0;
    let profileCount = 0;
    let tileCount = 0;
    let footerCount = 0;

    // Children.forEach, not Children.toArray: forEach hands back the ORIGINAL
    // elements, so an author key survives to `keyed` instead of being rewritten.
    Children.forEach(children, (child) => {
      switch (getSlotType<SideMenuSlotType>(child)) {
        case 'header':
          headerCount++;
          headerChild ??= child;
          break;
        case 'profile':
          profileCount++;
          profileChild ??= child;
          break;
        case 'tile':
          tileCount++;
          tileChild ??= child;
          break;
        case 'section':
          // Unkeyed sections get an index pin — stable while the list keeps its
          // relative order. Author-keyed sections keep their own identity, so a
          // dynamic/reordered keyed list moves instead of remounting.
          sectionChildren.push(keyed(child, `section-${sectionChildren.length}`));
          break;
        case 'footer':
          footerCount++;
          footerChild ??= child;
          break;
      }
    });

    if (__DEV__) {
      if (headerCount > 1) {
        console.warn('EtSideMenu: Multiple EtSideMenu.Header children detected. Only the first will be used.');
      }
      if (profileCount > 1) {
        console.warn('EtSideMenu: Multiple EtSideMenu.Profile children detected. Only the first will be used.');
      }
      if (tileCount > 1) {
        console.warn('EtSideMenu: Multiple EtSideMenu.Tile children detected. Only the first will be used.');
      }
      if (footerCount > 1) {
        console.warn('EtSideMenu: Multiple EtSideMenu.Footer children detected. Only the first will be used.');
      }
    }

    return {
      headerChild: keyed(headerChild, 'slot-header'),
      profileChild: keyed(profileChild, 'slot-profile'),
      tileChild: keyed(tileChild, 'slot-tile'),
      sectionChildren,
      footerChild: keyed(footerChild, 'slot-footer'),
    };
  }, [children]);
}
