import { useRef } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { EtTableBodyProps } from '../api';
import { useEtTableHorizontalScroll, useEtTableSort, useMemoizedTableRowCallbacks } from '../hooks';
import { EtTableFixedColumnHeader } from './et-table-fixed-column-header';
import EtTableFixedColumnRows from './et-table-fixed-column-rows';
import EtTableVirtualizedFixedColumnRows from './et-table-virtualized-fixed-column-rows';
import { useTableConfig } from './table-config-provider';

const NOOP_SORT_CHANGE = () => {};

export default function EtTableBodyWithFixedColumn<T extends object>({
  items,
  flashListProps,
  glassEffect,
  renderItem,
  renderHeaderColumn,
  onScroll,
  onSortChange,
  footer,
  shrinkToContent,
  virtualizeRows,
  snapToColumns = true,
  sortable = true,
  showScrollHeaderFade,
  sort,
  scrollOffsetX: externalScrollOffsetX,
  minimalSortHeader,
  flashListRef,
}: EtTableBodyProps<T>) {
  const { fixFirstColumn, firstColumn, movingColumns, keyExtractor } = useTableConfig();

  if (!fixFirstColumn) {
    throw new Error('EtTableBodyWithFixedColumn used without fixFirstColumn=true');
  }
  if (!firstColumn || !movingColumns) {
    throw new Error('"firstColumn" or "movingColumns" is missing in EtTableBodyWithFixedColumn');
  }

  // `sortable=false` must also bypass the sort MACHINERY, not just the header: in
  // uncontrolled mode (no `onSortChange`) the hook mirrors `items` into state via an
  // effect, so every data emission commits one frame of the previous items and renders
  // twice. A stable noop keeps the hook in controlled mode — `displayedItems` is `items`
  // itself and no internal state exists. The header stays inert regardless (below).
  const { activeSort, displayedItems, handleSortChange } = useEtTableSort<T>({
    items,
    sort: sortable ? sort : null,
    onSortChange: sortable ? onSortChange : NOOP_SORT_CHANGE,
  });
  const { scrollOffsetX, animatedBodyScrollHandler } = useEtTableHorizontalScroll(externalScrollOffsetX);
  const { renderColumn, onRowClick, rowStyle } = useMemoizedTableRowCallbacks({ fixFirstColumn, items: displayedItems as T[], renderItem });
  const bodyScrollViewRef = useRef<Animated.ScrollView>(null);

  // shrinkToContent renders every row inline by design, so virtualization is moot.
  const useVirtualizedBody = virtualizeRows && !shrinkToContent;

  const rows = (
    <EtTableFixedColumnRows<T>
      items={displayedItems as T[]}
      firstColumn={firstColumn}
      movingColumns={movingColumns}
      renderColumn={renderColumn}
      onRowClick={onRowClick}
      rowStyle={rowStyle}
      keyExtractor={keyExtractor}
      onHorizontalScroll={animatedBodyScrollHandler}
      bodyScrollViewRef={bodyScrollViewRef}
      scrollOffsetX={scrollOffsetX}
      glassEffect={glassEffect}
      snapToColumns={snapToColumns}
    />
  );

  return (
    <>
      {!shrinkToContent && (
        <EtTableFixedColumnHeader
          firstColumn={firstColumn}
          movingColumns={movingColumns}
          scrollOffsetX={scrollOffsetX}
          glassEffect={glassEffect}
          showScrollHeaderFade={showScrollHeaderFade}
          sort={activeSort}
          // `undefined` renders the header cells inert (`sortEnabled = onSortChange != null`) —
          // the consumer said sorting is off, so the uncontrolled local-sort fallback must not
          // resurrect it (it did for non-reorderable watchlists — PAH-936 review).
          onSortChange={sortable ? handleSortChange : undefined}
          renderHeaderColumn={renderHeaderColumn}
          minimalSortHeader={minimalSortHeader}
        />
      )}
      {useVirtualizedBody ? (
        <EtTableVirtualizedFixedColumnRows<T>
          items={displayedItems as T[]}
          firstColumn={firstColumn}
          movingColumns={movingColumns}
          renderColumn={renderColumn}
          onRowClick={onRowClick}
          rowStyle={rowStyle}
          keyExtractor={keyExtractor}
          scrollOffsetX={scrollOffsetX}
          snapToColumns={snapToColumns}
          onVerticalScroll={onScroll}
          footer={footer}
          flashListProps={flashListProps}
          flashListRef={flashListRef}
          glassEffect={glassEffect}
        />
      ) : shrinkToContent ? (
        <View>
          {rows}
          {footer != null && footer}
        </View>
      ) : (
        <ScrollView style={styles.mainScrollContainer} showsVerticalScrollIndicator={false} onScroll={onScroll}>
          {rows}
          {footer != null && footer}
        </ScrollView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  mainScrollContainer: {
    flex: 1,
  },
});
