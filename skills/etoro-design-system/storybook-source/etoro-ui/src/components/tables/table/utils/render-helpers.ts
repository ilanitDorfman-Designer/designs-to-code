import { StyleProp, ViewStyle } from 'react-native';

import { EtTableColumn } from '../api';
import { tableStyles } from '../styles';

interface TableColors {
  background: string;
  text: string;
  card?: string;
  border?: string;
  textSecondaryNeutral?: string;
  textTertiaryNeutral?: string;
}

export const getHeaderStyle = (colors: TableColors, headerStyle?: StyleProp<ViewStyle>) => [
  tableStyles.header,
  {
    backgroundColor: colors.card ?? colors.background,
    borderBottomColor: colors.border ?? colors.background,
  },
  headerStyle,
];

export const getContainerStyle = (colors: TableColors, style?: StyleProp<ViewStyle>, fullHeight?: boolean) => [
  tableStyles.container,
  { backgroundColor: colors.background },
  style,
  fullHeight && tableStyles.fullHeight,
];

interface GetCellInputType {
  style: StyleProp<ViewStyle>;
  column: EtTableColumn;
  columnCount: number;
  tableWidth: number;
}

export const getCellStyle = ({ style, column, columnCount, tableWidth }: GetCellInputType) => {
  const minColumnPercent = tableWidth / columnCount;
  const percentAbsWidth = tableWidth / 100;
  const columnWidthPercent = column.width ?? minColumnPercent;
  const columnWidth = columnWidthPercent * percentAbsWidth;

  return [style, { width: columnWidth }];
};

export const getHeaderTextStyle = (colors: TableColors) => [{ color: colors.text }];
