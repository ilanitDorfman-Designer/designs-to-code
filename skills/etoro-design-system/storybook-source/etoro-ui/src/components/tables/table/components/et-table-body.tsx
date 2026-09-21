import { FlashList, FlashListRef } from '@shopify/flash-list';
import { useMemo, useRef } from 'react';

import { EtTableBodyFlashListProps, EtTableBodyProps } from '../api';
import EtTableBodyWithFixedColumn from './et-table-body-with-fixed-column';
import { useTableConfig } from './table-config-provider';

export function EtTableBody<T extends object>({
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
  snapToColumns,
  sortable,
  showScrollHeaderFade,
  sort,
  scrollOffsetX,
  minimalSortHeader,
  flashListRef: externalFlashListRef,
}: EtTableBodyProps<T>) {
  const internalFlashListRef = useRef<FlashListRef<T>>(null);
  const flashListRef = externalFlashListRef ?? internalFlashListRef;

  const { keyExtractor, fixFirstColumn } = useTableConfig();

  // The prop bag is spread into FlashList below and forwarded to the fixed-column variant, so a
  // caller could otherwise restore Android subview clipping through it. The type omits the field,
  // making that a compile error; this covers callers that lose the type, e.g. spreading an
  // untyped object. Memoised so the forwarded reference stays stable across renders.
  const safeFlashListProps = useMemo(() => {
    if (!flashListProps) return undefined;

    const { removeClippedSubviews: _removeClippedSubviews, ...rest } = flashListProps as EtTableBodyFlashListProps<T> & {
      removeClippedSubviews?: boolean;
    };

    return rest as EtTableBodyFlashListProps<T>;
  }, [flashListProps]);

  if (fixFirstColumn) {
    return (
      <EtTableBodyWithFixedColumn<T>
        items={items}
        flashListProps={safeFlashListProps}
        glassEffect={glassEffect}
        renderItem={renderItem}
        renderHeaderColumn={renderHeaderColumn}
        onScroll={onScroll}
        footer={footer}
        shrinkToContent={shrinkToContent}
        virtualizeRows={virtualizeRows}
        snapToColumns={snapToColumns}
        sortable={sortable}
        showScrollHeaderFade={showScrollHeaderFade}
        sort={sort}
        onSortChange={onSortChange}
        scrollOffsetX={scrollOffsetX}
        minimalSortHeader={minimalSortHeader}
        flashListRef={flashListRef}
      />
    );
  }

  // The spread below carries `safeFlashListProps`, never the raw bag, so `removeClippedSubviews`
  // cannot reach the native Android ScrollView and re-open the `dispatchDraw` NPE.
  return (
    <FlashList
      ref={flashListRef}
      data={items}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      onScroll={onScroll}
      // See et-table-virtualized-fixed-column-rows.tsx for why this must be disabled:
      // FlashList v2's default scroll-anchoring misattributes rows across data changes
      // that alter item count/order (e.g. a filter toggle), producing stale/misordered
      // rows and unrequested scroll jumps.
      maintainVisibleContentPosition={{ disabled: true }}
      {...safeFlashListProps}
      ListFooterComponent={footer ? () => <>{footer}</> : undefined}
    />
  );
}
