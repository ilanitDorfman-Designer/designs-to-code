import type { ReactNode } from 'react';
import { isValidElement } from 'react';

import type { SlotComponent, SlotName } from '../api';

export function getSlotName(child: ReactNode): SlotName | null {
  if (!isValidElement(child)) return null;
  return (child.type as SlotComponent).etTopbarSlot ?? null;
}
