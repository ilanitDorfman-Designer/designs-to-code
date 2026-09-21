import { Children, isValidElement, ReactNode, useMemo } from 'react';

import type { SlotType } from '../api';

interface ListChildren {
  headerChild: ReactNode | undefined;
  skeletonChild: ReactNode | undefined;
  emptyChild: ReactNode | undefined;
  errorChild: ReactNode | undefined;
  footerChild: ReactNode | undefined;
}

/**
 * Reads the `__SLOT_TYPE` static property from a React element's component type.
 * Static properties survive minification, unlike `displayName`.
 */
const getSlotType = (child: ReactNode): SlotType | undefined =>
  isValidElement(child) ? (child.type as { __SLOT_TYPE?: SlotType }).__SLOT_TYPE : undefined;

/**
 * Classifies `EtList` children by their `__SLOT_TYPE`.
 *
 * Each slot returns the first matching child. Multiple children for the same
 * slot are warned about in development and the first one wins.
 */
export function useListChildren(children: ReactNode): ListChildren {
  return useMemo(() => {
    const childrenArray = Children.toArray(children);

    const headerMatches = childrenArray.filter((child) => getSlotType(child) === 'header');
    const skeletonMatches = childrenArray.filter((child) => getSlotType(child) === 'skeleton');
    const emptyMatches = childrenArray.filter((child) => getSlotType(child) === 'empty');
    const errorMatches = childrenArray.filter((child) => getSlotType(child) === 'error');
    const footerMatches = childrenArray.filter((child) => getSlotType(child) === 'footer');

    if (__DEV__) {
      const warn = (slot: string, count: number) => {
        if (count > 1) {
          console.warn(`EtList: Multiple EtList.${slot} children detected. Only the first will be used.`);
        }
      };
      warn('Header', headerMatches.length);
      warn('Skeleton', skeletonMatches.length);
      warn('Empty', emptyMatches.length);
      warn('Error', errorMatches.length);
      warn('Footer', footerMatches.length);
    }

    return {
      headerChild: headerMatches[0],
      skeletonChild: skeletonMatches[0],
      emptyChild: emptyMatches[0],
      errorChild: errorMatches[0],
      footerChild: footerMatches[0],
    };
  }, [children]);
}
