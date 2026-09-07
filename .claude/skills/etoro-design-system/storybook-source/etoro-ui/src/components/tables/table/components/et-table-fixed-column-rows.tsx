import { RefObject, useMemo } from 'react';
import { View } from 'react-native';
import Animated, { type ScrollHandlerProcessed, type SharedValue } from 'react-native-reanimated';

import { EtTableColumn, EtTableGlassEffect, EtTableRowProps } from '../api';
import { tableStyles } from '../styles';
import { computeColumnSnapOffsets, computeColumnsTotalWidth } from '../utils';
import { EtTableRow } from './et-table-row';
import GlassOverlay from './glass-overlay';

interface EtTableFixedColumnRowsProps<T> {
  items: T[];
  firstColumn: EtTableColumn;
  movingColumns: EtTableColumn[];
  renderColumn: EtTableRowProps<T>['renderColumn'];
  onRowClick?: EtTableRowProps<T>['onRowClick'];
  /** Forwarded from the row element's `style` prop; lets a screen override the row container (e.g. minHeight). */
  rowStyle?: EtTableRowProps<T>['style'];
  keyExtractor: (item: T, index: number) => string;
  onHorizontalScroll: ScrollHandlerProcessed;
  bodyScrollViewRef: RefObject<Animated.ScrollView | null>;
  scrollOffsetX: SharedValue<number>;
  glassEffect?: EtTableGlassEffect;
  /** Snap horizontal flings to column boundaries. @default true */
  snapToColumns?: boolean;
}

export default function EtTableFixedColumnRows<T extends object>({
  items,
  firstColumn,
  movingColumns,
  renderColumn,
  onRowClick,
  rowStyle,
  keyExtractor,
  onHorizontalScroll,
  bodyScrollViewRef,
  scrollOffsetX,
  glassEffect,
  snapToColumns = true,
}: EtTableFixedColumnRowsProps<T>) {
  const scrollableWidth = useMemo(() => computeColumnsTotalWidth(movingColumns), [movingColumns]);
  const columnSnapOffsets = useMemo(() => computeColumnSnapOffsets(movingColumns), [movingColumns]);

  return (
    <View style={tableStyles.fixedColumnContainer}>
      <View style={[tableStyles.glassContainer, { width: firstColumn.width ?? 'auto' }]} testID="et-table-fixed-column-body-glass">
        {!glassEffect?.disabled && (
          <GlassOverlay
            scrollOffsetX={scrollOffsetX}
            glassEffect={{
              blurIntensity: 10,
              ...glassEffect,
            }}
          />
        )}
      </View>
      <View style={[tableStyles.fixedColumnSection, { width: firstColumn.width ?? 'auto' }]}>
        <View>
          {items.map((item, index) => (
            <EtTableRow
              key={keyExtractor(item, index)}
              item={item}
              renderColumn={renderColumn}
              onRowClick={onRowClick}
              style={rowStyle}
              columnsOverride={[firstColumn]}
            />
          ))}
        </View>
      </View>
      <View style={tableStyles.scrollableSection}>
        <Animated.ScrollView
          horizontal
          ref={bodyScrollViewRef}
          style={tableStyles.scrollableScrollView}
          showsHorizontalScrollIndicator={false}
          onScroll={onHorizontalScroll}
          snapToOffsets={snapToColumns ? columnSnapOffsets : undefined}
          decelerationRate="fast"
          contentContainerStyle={tableStyles.scrollableContent}
        >
          <View style={[tableStyles.scrollableWrapper, { width: scrollableWidth }]}>
            <View>
              {items.map((item, index) => (
                <EtTableRow
                  key={keyExtractor(item, index)}
                  item={item}
                  renderColumn={renderColumn}
                  onRowClick={onRowClick}
                  style={rowStyle}
                  columnsOverride={movingColumns}
                />
              ))}
            </View>
          </View>
        </Animated.ScrollView>
      </View>
    </View>
  );
}
