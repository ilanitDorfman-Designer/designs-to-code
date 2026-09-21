import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

import { EtTableColumn } from '../api';

type TableConfig<T> = {
  fixFirstColumn?: boolean;
  firstColumn?: EtTableColumn;
  movingColumns?: EtTableColumn[];
  visibleColumns: EtTableColumn[];
  isScrolled: boolean;
  onHorizontalScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  keyExtractor: (item: T, index: number) => string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TableConfigContext = createContext<TableConfig<any>>({
  visibleColumns: [],
  isScrolled: false,
  onHorizontalScroll: () => {},
  keyExtractor: () => '',
});

type TableConfigProviderProps<T> = {
  children: ReactNode | ReactNode[];
  visibleColumns: EtTableColumn[];
  fixFirstColumn?: boolean;
  keyExtractor: (item: T, index: number) => string;
};

export function TableConfigProvider<T>({ children, visibleColumns, fixFirstColumn, keyExtractor }: TableConfigProviderProps<T>) {
  const [isScrolled, setIsScrolled] = useState(false);

  const onHorizontalScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    // Updating with same state (true/true or false/false) will not cause re-render
    setIsScrolled(scrollX > 0);
  }, []);

  const configValue = useMemo(
    () => ({
      fixFirstColumn,
      firstColumn: fixFirstColumn ? visibleColumns[0] : undefined,
      movingColumns: fixFirstColumn ? visibleColumns.slice(1) : undefined,
      visibleColumns,
      isScrolled,
      onHorizontalScroll,
      keyExtractor,
    }),
    [fixFirstColumn, visibleColumns, isScrolled, onHorizontalScroll, keyExtractor],
  );

  return <TableConfigContext value={configValue}>{children}</TableConfigContext>;
}

export const useTableConfig = () => useContext(TableConfigContext);
