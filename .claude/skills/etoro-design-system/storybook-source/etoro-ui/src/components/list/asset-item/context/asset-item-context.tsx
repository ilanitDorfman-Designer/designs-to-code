import { createContext, useContext } from 'react';

import type { AssetItemLayout, AssetItemSize } from '../api';

/**
 * Context value shared between `EtAssetItem` and its compound subcomponents.
 */
export interface AssetItemContextValue {
  /** Active size variant */
  size: AssetItemSize;
  /** Active layout variant */
  layout: AssetItemLayout;
  /** Whether the row is disabled */
  disabled: boolean;
}

/** Context provider for `EtAssetItem` subcomponents. */
export const AssetItemContext = createContext<AssetItemContextValue | null>(null);

/**
 * Hook for subcomponents to read the parent `EtAssetItem` context.
 *
 * @throws if used outside of `EtAssetItem`.
 */
export function useAssetItemContext(): AssetItemContextValue {
  const context = useContext(AssetItemContext);
  if (!context) {
    throw new Error('EtAssetItem subcomponents must be used within an <EtAssetItem> component');
  }
  return context;
}
