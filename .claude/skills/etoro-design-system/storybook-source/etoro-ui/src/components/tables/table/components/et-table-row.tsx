import { memo, useCallback } from 'react';
import { Pressable, View } from 'react-native';

import { EtTableColumn, EtTableRowProps } from '../api/types';
import { tableRowStyles } from '../styles';
import { MIN_COLUMN_WIDTH } from '../utils';
import { useTableConfig } from './table-config-provider';

function EtTableRowComponent<T extends object>({ item, style, onRowClick, renderColumn, columnsOverride, testID }: EtTableRowProps<T>) {
  const { visibleColumns } = useTableConfig();

  const handleRowPress = useCallback(() => {
    onRowClick?.(item);
  }, [item, onRowClick]);

  const columnsToRender = columnsOverride ?? visibleColumns;

  return (
    <View style={[tableRowStyles.container, style]}>
      <Pressable accessibilityHint="TableRow" onPress={handleRowPress} style={tableRowStyles.touchable} testID={testID}>
        <View style={tableRowStyles.row}>
          {columnsToRender.map((column: EtTableColumn) => (
            <View
              key={column.name}
              style={[tableRowStyles.cell, { width: column.width ?? MIN_COLUMN_WIDTH }, !column.isFirstColumn && tableRowStyles.cellCentered]}
            >
              {renderColumn(item, column)}
            </View>
          ))}
        </View>
      </Pressable>
    </View>
  );
}

export const EtTableRow = memo(EtTableRowComponent) as typeof EtTableRowComponent;
