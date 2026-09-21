import { useMemo } from 'react';

import { EtTableBodyProps, EtTableRowProps } from '../api';

type InputType<T> = Pick<EtTableBodyProps<T>, 'items' | 'renderItem'> & {
  fixFirstColumn?: boolean;
};

/**
 * Memoize callbacks passed to <EtTableRow /> to avoid recalculation on every render
 */
export default function useMemoizedTableRowCallbacks<T>({ fixFirstColumn, items, renderItem }: InputType<T>) {
  const { renderColumn, onRowClick, style } = useMemo<EtTableRowProps<T>>(() => {
    if (fixFirstColumn && items.length > 0) {
      const sampleElement = renderItem({
        item: items[0],
        index: 0,
        target: 'Cell',
      });
      return (sampleElement?.props ?? {}) as EtTableRowProps<T>;
    }
    return {} as EtTableRowProps<T>;
  }, [items, renderItem, fixFirstColumn]);

  return { renderColumn, onRowClick, rowStyle: style };
}
