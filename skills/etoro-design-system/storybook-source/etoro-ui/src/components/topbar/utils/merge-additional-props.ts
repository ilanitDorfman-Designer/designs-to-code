import type { SlotData } from '../api';

export function mergeAdditionalProps(additionalProps: SlotData['additionalProps']): SlotData['additionalProps'][number] {
  return additionalProps.reduce((acc, props) => ({ ...acc, ...props }), {});
}
