import type { ReactNode } from 'react';

import { useInfoSlots } from '../../_info-base/hooks';

const USER_DISPLAY_NAMES = {
  avatar: 'EtUserInfo.Avatar',
  title: 'EtUserInfo.Title',
  subtitle: 'EtUserInfo.Subtitle',
} as const;

/**
 * Splits EtUserInfo children into slots by displayName.
 */
export function useSlots(children: ReactNode) {
  return useInfoSlots(children, USER_DISPLAY_NAMES);
}
