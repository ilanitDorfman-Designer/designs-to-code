import type { ReactNode } from 'react';

import { useInfoSlots } from '../../_info-base/hooks';

const ASSET_DISPLAY_NAMES = {
  avatar: 'EtAssetInfo.Avatar',
  title: 'EtAssetInfo.Title',
  subtitle: 'EtAssetInfo.Subtitle',
} as const;

/**
 * Splits EtAssetInfo children into slots by displayName.
 */
export function useSlots(children: ReactNode) {
  return useInfoSlots(children, ASSET_DISPLAY_NAMES);
}
