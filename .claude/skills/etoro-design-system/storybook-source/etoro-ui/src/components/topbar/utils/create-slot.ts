import type { SlotData } from '../api';

export function createSlot(): SlotData {
  return { children: [], styles: [], testID: undefined, additionalProps: [] };
}
