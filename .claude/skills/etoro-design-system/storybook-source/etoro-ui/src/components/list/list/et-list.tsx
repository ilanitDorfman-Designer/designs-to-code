import { FlashList, type FlashListProps, type FlashListRef, type ListRenderItem } from '@shopify/flash-list';
import React, { type ComponentType, isValidElement, ReactElement, useCallback, useEffect, useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';

import type { EtListProps } from './api';
import { ListContext, type ListContextValue } from './context';
import { useListChildren } from './hooks';
import { ListColumn, ListEmpty, ListError, ListFooter, ListHeader, ListSkeleton } from './subcomponents';

const DEFAULT_END_REACHED_THRESHOLD = 0.5;

/**
 * Picks the active render path from the public flag triplet.
 *
 * Order of precedence is intentionally `loading > error > empty > data`:
 * the spec treats an in-flight initial fetch as authoritative even when
 * a stale error or empty array is still in scope.
 */
function resolveRenderPath(isLoading: boolean | undefined, hasError: boolean, dataLength: number): 'skeleton' | 'error' | 'empty' | 'data' {
  if (isLoading && dataLength === 0) return 'skeleton';
  if (hasError && dataLength === 0) return 'error';
  if (dataLength === 0) return 'empty';
  return 'data';
}

/**
 * `EtList` - Generic, virtualized list primitive.
 *
 * Owns four render paths derived from `data`, `isLoading`, and `error`:
 *
 * 1. `isLoading && data.length === 0`  → `Header` + `Skeleton` slot.
 * 2. `error && data.length === 0`      → `Header` + `Error` slot.
 * 3. `data.length === 0`               → `Header` + `Empty` slot.
 * 4. otherwise                         → `Header` + virtualized list (with `Footer` slot).
 *
 * `Header` is rendered as a sibling above the FlashList so it stays pinned
 * at the top of the list area regardless of scroll position.
 *
 * @see ../et-asset-item.tsx — for the slot-detection pattern this component mirrors.
 */
function EtListBase<T>({
  children,
  data,
  keyExtractor,
  renderItem,
  isLoading = false,
  error = null,
  onEndReached,
  onEndReachedThreshold = DEFAULT_END_REACHED_THRESHOLD,
  style,
  contentContainerStyle,
  registerScrollToTop,
  testID,
  accessibilityLabel,
}: EtListProps<T>) {
  const { headerChild, skeletonChild, emptyChild, errorChild, footerChild } = useListChildren(children);

  const dataLength = data.length;
  const renderPath = resolveRenderPath(isLoading, error != null, dataLength);

  const contextValue = useMemo<ListContextValue>(() => ({ isEmpty: dataLength === 0 }), [dataLength]);

  // FlashList passes its own `info` shape; we narrow it to our public `ListRenderItemInfo<T>`.
  const flashRenderItem = useCallback<ListRenderItem<T>>(({ item, index }) => renderItem({ item, index }), [renderItem]);

  const flashKeyExtractor = useCallback((item: T, index: number) => keyExtractor(item, index), [keyExtractor]);

  // FlashList re-creates the footer container whenever `ListFooterComponent`'s
  // identity changes. Wrapping the slot in a memoized component keeps the
  // identity stable across renders that don't change the footer node.
  const FooterComponent = useMemo<ComponentType | undefined>(() => {
    if (!isValidElement(footerChild)) return undefined;
    return function EtListFooter() {
      return footerChild as ReactElement;
    };
  }, [footerChild]);

  const body = renderBody({
    renderPath,
    skeletonChild,
    errorChild,
    emptyChild,
    FooterComponent,
    data,
    flashRenderItem,
    flashKeyExtractor,
    onEndReached,
    onEndReachedThreshold,
    contentContainerStyle,
    registerScrollToTop,
  });

  return (
    <ListContext.Provider value={contextValue}>
      <View style={[styles.container, style]} testID={testID} accessibilityLabel={accessibilityLabel}>
        {headerChild}
        <View style={styles.body}>{body}</View>
      </View>
    </ListContext.Provider>
  );
}

EtListBase.displayName = 'EtList';

interface RenderBodyParams<T> {
  renderPath: 'skeleton' | 'error' | 'empty' | 'data';
  skeletonChild: React.ReactNode;
  errorChild: React.ReactNode;
  emptyChild: React.ReactNode;
  FooterComponent: ComponentType | undefined;
  data: ReadonlyArray<T>;
  flashRenderItem: ListRenderItem<T>;
  flashKeyExtractor: (item: T, index: number) => string;
  onEndReached?: () => void;
  onEndReachedThreshold: FlashListProps<T>['onEndReachedThreshold'];
  contentContainerStyle?: FlashListProps<T>['contentContainerStyle'];
  registerScrollToTop?: (scrollToTop: (() => void) | null) => void;
}

function renderBody<T>({
  renderPath,
  skeletonChild,
  errorChild,
  emptyChild,
  FooterComponent,
  data,
  flashRenderItem,
  flashKeyExtractor,
  onEndReached,
  onEndReachedThreshold,
  contentContainerStyle,
  registerScrollToTop,
}: RenderBodyParams<T>): ReactElement | null {
  if (renderPath === 'skeleton') {
    return isValidElement(skeletonChild) ? skeletonChild : null;
  }

  if (renderPath === 'error') {
    return isValidElement(errorChild) ? errorChild : null;
  }

  if (data.length === 0) {
    return isValidElement(emptyChild) ? emptyChild : null;
  }

  return (
    <EtListDataBody
      data={data as T[]}
      renderItem={flashRenderItem}
      keyExtractor={flashKeyExtractor}
      onEndReached={onEndReached}
      onEndReachedThreshold={onEndReachedThreshold}
      ListFooterComponent={FooterComponent}
      contentContainerStyle={contentContainerStyle}
      registerScrollToTop={registerScrollToTop}
    />
  );
}

function EtListDataBody<T>({
  data,
  renderItem,
  keyExtractor,
  onEndReached,
  onEndReachedThreshold,
  ListFooterComponent,
  contentContainerStyle,
  registerScrollToTop,
}: {
  data: T[];
  renderItem: ListRenderItem<T>;
  keyExtractor: (item: T, index: number) => string;
  onEndReached?: () => void;
  onEndReachedThreshold: FlashListProps<T>['onEndReachedThreshold'];
  ListFooterComponent: ComponentType | undefined;
  contentContainerStyle?: FlashListProps<T>['contentContainerStyle'];
  registerScrollToTop?: (scrollToTop: (() => void) | null) => void;
}): ReactElement {
  const flashListRef = useRef<FlashListRef<T>>(null);

  useEffect(() => {
    registerScrollToTop?.(() => flashListRef.current?.scrollToTop({ animated: true }));
    return () => registerScrollToTop?.(null);
  }, [registerScrollToTop]);

  return (
    <FlashList<T>
      ref={flashListRef}
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      onEndReached={onEndReached}
      onEndReachedThreshold={onEndReachedThreshold}
      ListFooterComponent={ListFooterComponent}
      contentContainerStyle={contentContainerStyle}
      showsVerticalScrollIndicator={false}
    />
  );
}

/**
 * `EtList` compound component with subcomponents.
 *
 * **Subcomponents:**
 * - `EtList.Header` - Pinned column-header row
 * - `EtList.Column` - Single header cell (sortable optional)
 * - `EtList.Skeleton` - Initial-loading placeholder rows
 * - `EtList.Empty` - Empty-state slot
 * - `EtList.Error` - Initial-load error slot
 * - `EtList.Footer` - Inline footer rendered at the bottom of the data
 */
export const EtList = Object.assign(React.memo(EtListBase) as <T>(props: EtListProps<T>) => ReactElement, {
  Header: ListHeader,
  Column: ListColumn,
  Skeleton: ListSkeleton,
  Empty: ListEmpty,
  Error: ListError,
  Footer: ListFooter,
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
  },
});
