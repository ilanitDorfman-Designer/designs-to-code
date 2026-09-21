import { View } from 'react-native';

import { EtText } from '../../../../foundations/text/et-text';
import { EtTableColumn, EtTableHeadProps } from '../api';
import { tableHeadStyles } from '../styles/table-head-styles';
import { useTableConfig } from './table-config-provider';

export function EtTableHead({ style, renderColumn }: EtTableHeadProps) {
  const { fixFirstColumn, visibleColumns } = useTableConfig();

  if (fixFirstColumn) {
    throw new Error('EtTableHead should not be used when "fixFirstColumn" is true. Headers are handled by EtTableBody.');
  }

  // Regular header layout - render all columns
  return (
    <View style={[tableHeadStyles.container, style]}>
      {visibleColumns.map((column: EtTableColumn) => (
        <View key={column.name} style={[tableHeadStyles.headCell, { width: column.width ?? 'auto' }]}>
          {renderColumn ? (
            renderColumn(column)
          ) : (
            <EtText variant="body-secondary-semibold" style={tableHeadStyles.headText}>
              {column.title}
            </EtText>
          )}
        </View>
      ))}
    </View>
  );
}
