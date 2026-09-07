import { forwardRef, type ReactElement, type Ref } from 'react';
import { SectionList, type SectionListProps } from 'react-native';

export type EtSectionListProps<ItemT, SectionT> = SectionListProps<ItemT, SectionT>;

/**
 * Drop-in replacement for React Native's `SectionList` that pins `removeClippedSubviews` off.
 *
 * Unlike `FlatList`, `SectionList` does *not* default the flag on for Android — it only declares
 * the prop, and `VirtualizedList` passes it straight through. So this is preventative rather than
 * a behaviour change: it makes the safe value explicit and keeps one list API across the app, so a
 * future call site cannot quietly opt into the `dispatchDraw` crash. See `et-flat-list.tsx`.
 */
function EtSectionListInner<ItemT, SectionT>(
  { removeClippedSubviews, ...props }: EtSectionListProps<ItemT, SectionT>,
  ref: Ref<SectionList<ItemT, SectionT>>,
): ReactElement {
  return <SectionList<ItemT, SectionT> {...props} removeClippedSubviews={removeClippedSubviews ?? false} ref={ref} />;
}

export const EtSectionList = forwardRef(EtSectionListInner) as <ItemT, SectionT>(
  props: EtSectionListProps<ItemT, SectionT> & { ref?: Ref<SectionList<ItemT, SectionT>> },
) => ReactElement;
