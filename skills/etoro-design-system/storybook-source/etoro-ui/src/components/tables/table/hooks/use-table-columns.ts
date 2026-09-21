import { useMemo } from 'react';

import { EtTableColumn } from '../api/types';
import { calculateVisibleColumns } from '../utils/column-utils';

interface InputType {
  columns: EtTableColumn[];
}

/**
 * Main hook for managing table columns with responsive calculations
 */
export function useTableColumns({ columns }: InputType): EtTableColumn[] {
  return useMemo(() => calculateVisibleColumns(columns), [columns]);
}
