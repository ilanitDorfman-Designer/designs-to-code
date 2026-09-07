import { forwardRef, type ReactElement, type Ref } from 'react';
import { FlatList, type FlatListProps } from 'react-native';

export type EtFlatListProps<ItemT> = FlatListProps<ItemT>;

/**
 * Drop-in replacement for React Native's `FlatList` that disables Android subview clipping.
 *
 * RN defaults `removeClippedSubviews` to `true` on Android (`FlatList.js`,
 * `removeClippedSubviewsOrDefault`). That flag is forwarded to the ScrollView's content
 * container, whose clipped child slots are nullable; when a child is removed between the
 * child-count check and the child lookup, the null reaches `ViewGroup.dispatchDraw` and
 * throws `NullPointerException` on `View.mViewFlags`. RN 0.81's `ReactViewGroup.dispatchDraw`
 * has no null guard (later versions added one), and we consume a prebuilt AAR so it cannot
 * be patched locally. Fabric plus edge-to-edge — both enabled here — widen the race.
 *
 * `FlatList` already windows its cells, so clipping is an incremental native optimisation
 * rather than the thing keeping memory bounded. The default is overridable for a list that
 * genuinely needs it, but doing so re-opens the crash.
 *
 * The default is resolved with `??` rather than placed before a prop spread: RN reads the flag
 * as `removeClippedSubviews ?? Platform.OS === 'android'`, so an explicit `undefined` — routine
 * when a call site merges props conditionally — would land back on the Android default of `true`.
 *
 * Deliberately not wrapped in `React.memo`: a bare `FlatList` re-renders whenever its parent
 * does, and memoizing here would silently change that for every call site.
 */
function EtFlatListInner<ItemT>({ removeClippedSubviews, ...props }: EtFlatListProps<ItemT>, ref: Ref<FlatList<ItemT>>): ReactElement {
  return <FlatList<ItemT> {...props} removeClippedSubviews={removeClippedSubviews ?? false} ref={ref} />;
}

export const EtFlatList = forwardRef(EtFlatListInner) as <ItemT>(props: EtFlatListProps<ItemT> & { ref?: Ref<FlatList<ItemT>> }) => ReactElement;
