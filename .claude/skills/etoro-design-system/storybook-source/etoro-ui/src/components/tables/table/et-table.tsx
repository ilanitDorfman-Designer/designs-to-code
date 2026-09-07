import { useCallback, useMemo } from 'react';
import { ScrollView, View } from 'react-native';

import { EtTableProps } from './api/types';
import { TableConfigProvider } from './components';
import { tableStyles } from './styles';
import { calculateVisibleColumns, generateKeyExtractor } from './utils';

export function EtTable<T extends object>({
  id,
  columns,
  fixFirstColumn = false,
  fullHeight = false,
  style,
  bounces = true,
  children,
  keyExtractor,
}: EtTableProps<T>) {
  const visibleColumns = useMemo(() => calculateVisibleColumns(columns), [columns]);

  const getKeyExtractor = useCallback(
    (item: T, index: number) => {
      return keyExtractor ? keyExtractor(item, index) : generateKeyExtractor(item, index);
    },
    [keyExtractor],
  );

  let content = (
    <View id={id} testID={id} style={[tableStyles.container, style, fullHeight && tableStyles.fullHeight]}>
      {children}
    </View>
  );
  if (!fixFirstColumn) {
    content = (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} bounces={bounces}>
        {content}
      </ScrollView>
    );
  }
  return (
    <TableConfigProvider<T> keyExtractor={getKeyExtractor} visibleColumns={visibleColumns} fixFirstColumn={fixFirstColumn}>
      {content}
    </TableConfigProvider>
  );
}
