import { EtTableColumn, EtTableSortState } from '../api';

/** Column is excluded from sort UI (e.g. live book prices). */
export function isEtTableColumnMarkedNonSortable(column: EtTableColumn): boolean {
  return column.sortable === false;
}

/** Whether the header may be pressed to change sort (requires handler and a sortable column). */
export function isEtTableColumnSortable(column: EtTableColumn, sortEnabled: boolean): boolean {
  return sortEnabled && !isEtTableColumnMarkedNonSortable(column);
}

/** Three-state header press cycle: null -> desc -> asc -> null. */
export function getNextSortState(current: EtTableSortState | null, columnName: string): EtTableSortState | null {
  if (current?.column !== columnName) return { column: columnName, direction: 'desc' };
  if (current.direction === 'desc') return { column: columnName, direction: 'asc' };
  return null;
}
