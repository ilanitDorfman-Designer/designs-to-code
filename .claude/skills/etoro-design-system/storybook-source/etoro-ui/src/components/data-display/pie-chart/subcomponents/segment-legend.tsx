import type { ReactNode } from 'react';
import { Children, isValidElement } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';

import { X2, X4 } from '../../../../core/styles/spacing';
import { create } from '../../../../utils/create';
import type { SegmentLegendProps } from '../api/types';

function chunk(items: ReactNode[], size: number): ReactNode[][] {
  const rows: ReactNode[][] = [];
  for (let index = 0; index < items.length; index += size) {
    rows.push(items.slice(index, index + size));
  }
  return rows;
}

/**
 * Dumb container that arranges `SegmentLegendItem` children.
 *
 * - `layout="grid"` (default): wraps items into rows, centered as a block.
 *   Cells hug their content (dot + label + value + chevron) with a column
 *   gap between them. When a row has fewer items than fit on a full row,
 *   those items center themselves within the row — matching the Figma
 *   allocation-card pattern where a lone "Other" row sits centered.
 * - `layout="grid"` with `columns`: builds explicit rows of `columns` items so
 *   the layout is identical no matter how many segments arrive. Every row —
 *   full or short — hugs its content and centers, so the legend reads as one
 *   centered block under the donut. Five items over two columns render
 *   2 / 2 / 1, each row centered. Explicit rows rather than wrapping, because
 *   wrapping makes the row breaks depend on label width: a long label could
 *   push a 2/2/1 legend into 1/2/2 and change the card's height.
 * - `layout="list"`: stacks items full-width.
 *
 * Legend is intentionally a sibling of the donut (not forced children) so
 * consumers can place it below or beside the chart freely.
 */
function SegmentLegendBase({ children, layout = 'grid', columns, style, testID }: SegmentLegendProps) {
  const isGrid = layout === 'grid';
  const items = Children.toArray(children);
  const columnCount = isGrid && columns && columns > 0 ? columns : 0;

  // Prefer the child's own key so reordering/insertion doesn't remount rows;
  // fall back to the index only when a child has no key.
  const cellKey = (child: ReactNode, index: number) => (isValidElement(child) && child.key != null ? child.key : index);

  const renderCell = (child: ReactNode, index: number, cellStyle: StyleProp<ViewStyle>) => (
    <View key={cellKey(child, index)} style={cellStyle} testID={testID ? `${testID}-cell-${index}` : undefined}>
      {child}
    </View>
  );

  if (columnCount > 0) {
    return (
      <View style={[styles.container, styles.rows, style]} testID={testID}>
        {chunk(items, columnCount).map((rowItems, rowIndex) => {
          const firstIndex = rowIndex * columnCount;

          return (
            <View key={`row-${rowIndex}`} style={styles.row} testID={testID ? `${testID}-row-${rowIndex}` : undefined}>
              {rowItems.map((child, columnIndex) => renderCell(child, firstIndex + columnIndex, styles.columnCell))}
            </View>
          );
        })}
      </View>
    );
  }

  return (
    <View style={[styles.container, isGrid ? styles.grid : styles.list, style]} testID={testID}>
      {items.map((child, index) => renderCell(child, index, isGrid ? styles.cell : styles.fullWidthCell))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    // Figma allocation-card spec: row-gap 16 (X4), column-gap 8 (X2).
    columnGap: X2,
    rowGap: X4,
  },
  rows: {
    flexDirection: 'column',
    rowGap: X4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: X2,
  },
  list: {
    flexDirection: 'column',
  },
  cell: {
    // Cells hug their content, so a short row centers as a block.
  },
  columnCell: {
    // Hug the content so the row centers as a block. `flexShrink` rather than a
    // fixed share: a pair too wide for the card shrinks and truncates its label
    // instead of overflowing, and a lone item still centers on its own.
    flexShrink: 1,
  },
  fullWidthCell: {
    width: '100%',
  },
});

export const SegmentLegend = create(SegmentLegendBase, 'EtPieChart.SegmentLegend');
