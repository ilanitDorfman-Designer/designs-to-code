import { useCallback, useEffect, useRef, useState } from 'react';

import { EtTableColumn, EtTableSortDirection, EtTableSortState } from '../api';
import { compareValues, getNextSortState, isEtTableColumnSortable } from '../utils';

type InternalSort<T> = { column: keyof T; direction: EtTableSortDirection } | null;

interface UseEtTableSortOptions<T> {
  items: T[];
  sort?: EtTableSortState | null;
  onSortChange?: (next: EtTableSortState | null) => void;
}

interface UseEtTableSortResult<T> {
  activeSort: EtTableSortState | null;
  displayedItems: T[];
  /** Pass to `EtTableFixedColumnHeader.onSortChange` — handles both controlled and uncontrolled modes. */
  handleSortChange: (next: EtTableSortState | null) => void;
  /** @deprecated Use `handleSortChange` when wiring to `EtTableFixedColumnHeader`. Kept for back-compat with column-press callbacks. */
  onHeaderColumnPress: (column: EtTableColumn) => void;
}

/**
 * Manages sort state and logic for the table.
 *
 * **Controlled** (`onSortChange` provided): sort state is owned by the consumer;
 * the hook forwards header-press events via `onSortChange` and
 * returns `items` unchanged (no internal sorting).
 *
 * **Uncontrolled** (`onSortChange` omitted): the hook manages sort state
 * internally and returns a sorted copy of `items` as `displayedItems`.
 */
export default function useEtTableSort<T>({ items, sort, onSortChange }: UseEtTableSortOptions<T>): UseEtTableSortResult<T> {
  const isControlled = onSortChange !== undefined;

  const currentSort = useRef<InternalSort<T>>(null);
  const [filteredItems, setFilteredItems] = useState<T[]>(() => [...items]);

  useEffect(() => {
    if (isControlled) return;

    const sortPref = currentSort.current;
    if (sortPref === null) {
      setFilteredItems([...items]);
      return;
    }

    const sorted = [...items].sort((a, b) => compareWithDirection(a, b, sortPref.column, sortPref.direction));
    setFilteredItems(sorted);
  }, [items, isControlled]);

  const activeSort: EtTableSortState | null = isControlled
    ? (sort ?? null)
    : currentSort.current
      ? { column: currentSort.current.column as string, direction: currentSort.current.direction }
      : null;

  const displayedItems = isControlled ? items : filteredItems;

  const applyLocalSort = useCallback(
    (nextState: EtTableSortState | null) => {
      if (nextState === null) {
        currentSort.current = null;
        setFilteredItems([...items]);
        return;
      }

      const typedColumn = nextState.column as keyof T;
      currentSort.current = { column: typedColumn, direction: nextState.direction };
      const sorted = [...items].sort((a, b) => compareWithDirection(a, b, typedColumn, nextState.direction));
      setFilteredItems(sorted);
    },
    [items],
  );

  const handleSortChange = useCallback(
    (nextState: EtTableSortState | null) => {
      if (onSortChange) {
        onSortChange(nextState);
        return;
      }
      applyLocalSort(nextState);
    },
    [onSortChange, applyLocalSort],
  );

  const onHeaderColumnPress = useCallback(
    (column: EtTableColumn) => {
      const sortEnabled = isControlled ? onSortChange != null : true;
      if (!isEtTableColumnSortable(column, sortEnabled)) return;

      const currentValue: EtTableSortState | null = isControlled
        ? (sort ?? null)
        : currentSort.current
          ? { column: currentSort.current.column as string, direction: currentSort.current.direction }
          : null;

      const nextState = getNextSortState(currentValue, column.name);
      handleSortChange(nextState);
    },
    [isControlled, sort, handleSortChange],
  );

  return { activeSort, displayedItems, handleSortChange, onHeaderColumnPress };
}

function compareWithDirection<T>(rowA: T, rowB: T, column: keyof T, direction: EtTableSortDirection): number {
  const comparison = compareValues(rowA[column], rowB[column]);
  return direction === 'asc' ? comparison : -comparison;
}
