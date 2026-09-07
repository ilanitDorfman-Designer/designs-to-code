import { Children, isValidElement, ReactNode, useMemo } from 'react';

import type { ListItemLayoutMode, SlotType } from '../api';

interface ListItemChildren {
  startChild: ReactNode | undefined;
  middleChild: ReactNode | undefined;
  endChild: ReactNode | undefined;
  dividerChild: ReactNode | undefined;
  skeletonChild: ReactNode | undefined;
  layoutMode: ListItemLayoutMode;
}

/**
 * Reads the __SLOT_TYPE static property from a React element's component type.
 * Static properties survive minification, unlike displayName.
 */
const getSlotType = (child: ReactNode): SlotType | undefined =>
  isValidElement(child) ? (child.type as { __SLOT_TYPE?: SlotType }).__SLOT_TYPE : undefined;

/**
 * Separates children into Start, Middle, End slots using __SLOT_TYPE.
 * Determines the layout mode based on which slots are present.
 */
export function useListItemChildren(children: ReactNode): ListItemChildren {
  return useMemo(() => {
    const childrenArray = Children.toArray(children);

    const startMatches = childrenArray.filter((child) => getSlotType(child) === 'start');
    const middleMatches = childrenArray.filter((child) => getSlotType(child) === 'middle');
    const endMatches = childrenArray.filter((child) => getSlotType(child) === 'end');
    const dividerMatches = childrenArray.filter((child) => getSlotType(child) === 'divider');
    const skeletonMatches = childrenArray.filter((child) => getSlotType(child) === 'skeleton');

    if (__DEV__) {
      if (startMatches.length > 1) {
        console.warn('EtListItem: Multiple EtListItem.Start children detected. Only the first will be used.');
      }
      if (middleMatches.length > 1) {
        console.warn('EtListItem: Multiple EtListItem.Middle children detected. Only the first will be used.');
      }
      if (endMatches.length > 1) {
        console.warn('EtListItem: Multiple EtListItem.End children detected. Only the first will be used.');
      }
      if (dividerMatches.length > 1) {
        console.warn('EtListItem: Multiple EtListItem.Divider children detected. Only the first will be used.');
      }
      if (skeletonMatches.length > 1) {
        console.warn('EtListItem: Multiple EtListItem.Skeleton children detected. Only the first will be used.');
      }
    }

    const startChild = startMatches[0];
    const middleChild = middleMatches[0];
    const endChild = endMatches[0];
    const dividerChild = dividerMatches[0];
    const skeletonChild = skeletonMatches[0];

    let layoutMode: ListItemLayoutMode = 'start-only';
    if (startChild && middleChild && endChild) {
      layoutMode = 'start-middle-end';
    } else if (startChild && endChild) {
      layoutMode = 'start-end';
    }

    return {
      startChild,
      middleChild,
      endChild,
      dividerChild,
      skeletonChild,
      layoutMode,
    };
  }, [children]);
}
