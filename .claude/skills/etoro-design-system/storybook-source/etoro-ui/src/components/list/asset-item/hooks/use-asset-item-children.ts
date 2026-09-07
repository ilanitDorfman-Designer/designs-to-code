import { Children, isValidElement, ReactNode, useMemo } from 'react';

import type { SlotType } from '../api';

interface AssetItemChildren {
  logoChild: ReactNode | undefined;
  contentChild: ReactNode | undefined;
  labelChild: ReactNode | undefined;
  priceChild: ReactNode | undefined;
  changeChild: ReactNode | undefined;
  trailingChild: ReactNode | undefined;
  dividerChild: ReactNode | undefined;
  skeletonChild: ReactNode | undefined;
  /**
   * All `EtAssetItem.RateChip` children, in JSX order. Unlike the other slots,
   * RateChip is collected as an array because the trading-view layout renders
   * a horizontal row of chips (typically 2 — a Buy and a Sell).
   */
  rateChipChildren: ReactNode[];
}

/**
 * Reads the `__SLOT_TYPE` static property from a React element's component type.
 * Static properties survive minification, unlike `displayName`.
 */
const getSlotType = (child: ReactNode): SlotType | undefined =>
  isValidElement(child) ? (child.type as { __SLOT_TYPE?: SlotType }).__SLOT_TYPE : undefined;

/**
 * Classifies `EtAssetItem` children by their `__SLOT_TYPE`.
 *
 * Render order is deterministic regardless of JSX order:
 * Logo → Content → Label → Price/Change → Trailing → Divider. RateChip siblings
 * are collected as an array (multiple are valid in the trading-view layout).
 */
export function useAssetItemChildren(children: ReactNode): AssetItemChildren {
  return useMemo(() => {
    const childrenArray = Children.toArray(children);

    const logoMatches = childrenArray.filter((child) => getSlotType(child) === 'logo');
    const contentMatches = childrenArray.filter((child) => getSlotType(child) === 'content');
    const labelMatches = childrenArray.filter((child) => getSlotType(child) === 'label');
    const priceMatches = childrenArray.filter((child) => getSlotType(child) === 'price');
    const changeMatches = childrenArray.filter((child) => getSlotType(child) === 'change');
    const trailingMatches = childrenArray.filter((child) => getSlotType(child) === 'trailing');
    const dividerMatches = childrenArray.filter((child) => getSlotType(child) === 'divider');
    const skeletonMatches = childrenArray.filter((child) => getSlotType(child) === 'skeleton');
    const rateChipMatches = childrenArray.filter((child) => getSlotType(child) === 'rate-chip');

    if (__DEV__) {
      const warn = (slot: string, count: number) => {
        if (count > 1) {
          console.warn(`EtAssetItem: Multiple EtAssetItem.${slot} children detected. Only the first will be used.`);
        }
      };
      warn('Logo', logoMatches.length);
      warn('Content', contentMatches.length);
      warn('Label', labelMatches.length);
      warn('Price', priceMatches.length);
      warn('Change', changeMatches.length);
      warn('Trailing', trailingMatches.length);
      warn('Divider', dividerMatches.length);
      warn('Skeleton', skeletonMatches.length);
    }

    return {
      logoChild: logoMatches[0],
      contentChild: contentMatches[0],
      labelChild: labelMatches[0],
      priceChild: priceMatches[0],
      changeChild: changeMatches[0],
      trailingChild: trailingMatches[0],
      dividerChild: dividerMatches[0],
      skeletonChild: skeletonMatches[0],
      rateChipChildren: rateChipMatches,
    };
  }, [children]);
}
