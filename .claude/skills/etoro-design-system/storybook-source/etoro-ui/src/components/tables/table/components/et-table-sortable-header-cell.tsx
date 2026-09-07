import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut, useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { useEtoroTheme } from '../../../../core/hooks';
import ChevronDown from '../../../../core/icons/chevron-down';
import ChevronUp from '../../../../core/icons/chevron-up';
import { X1, X2, X6 } from '../../../../core/styles/spacing';
import { EtText } from '../../../../foundations/text/et-text';
import { LEADING_TEXT_STYLE, rtlSign } from '../../../../utils/rtl';
import { EtTableColumn, EtTableSortState } from '../api';
import { getNextSortState, isEtTableColumnMarkedNonSortable, isEtTableColumnSortable, MIN_COLUMN_WIDTH } from '../utils';

export interface EtTableSortableHeaderCellProps {
  column: EtTableColumn;
  sort: EtTableSortState | null;
  alignment?: 'left' | 'center' | 'right';
  onSortChange?: (next: EtTableSortState | null) => void;
}

/**
 * Sortable header cell component for the table.
 * Handles the sorting logic for the table.
 * When the header cell is pressed, the table updates the sort state.
 * When the sort state changes, the table updates the displayed items.
 */
export function EtTableSortableHeaderCell({ column, sort, alignment = 'center', onSortChange }: EtTableSortableHeaderCellProps) {
  const { colors } = useEtoroTheme();
  const sortInteractionEnabled = onSortChange != null;
  const isSorted = sort !== null && sort.column === column.name;

  const alignmentStyle: {
    justifyContent: 'flex-start' | 'flex-end' | 'center';
  } = {
    justifyContent: alignment === 'left' ? 'flex-start' : alignment === 'right' ? 'flex-end' : 'center',
  };

  const handlePress = () => {
    if (!isEtTableColumnSortable(column, sortInteractionEnabled)) return;
    onSortChange?.(getNextSortState(sort, column.name));
  };

  const shouldAlignUnsortedLeftLabel = alignment === 'left' && !isSorted;
  const titleTextStyle = alignment === 'left' ? LEADING_TEXT_STYLE : { textAlign: alignment };
  const unsortedLeftLabelOffset = shouldAlignUnsortedLeftLabel ? -X2 * rtlSign() : 0;

  const backgroundAnimatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isSorted ? 1 : 0, { duration: 200 }),
  }));

  const labelAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(unsortedLeftLabelOffset, { duration: 200 }) }],
  }));

  if (isEtTableColumnMarkedNonSortable(column)) {
    return (
      <View style={[styles.headerColumn, { width: column.width ?? MIN_COLUMN_WIDTH }, alignmentStyle]} testID={`table-header-${column.name}`}>
        <View style={styles.headerColumnContent}>
          <EtText
            variant="body-tiny-regular"
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{ color: colors.textSecondaryNeutral, ...titleTextStyle }}
          >
            {column.title}
          </EtText>
          {/* Reserve the sort-chevron's footprint (transparent) so a non-sortable
              column's title lines up with the sortable columns' titles instead of
              sitting visibly off-center (PBD-676). */}
          <ChevronDown size={14} color={colors.transparent} />
        </View>
      </View>
    );
  }

  const columnStyle = [styles.headerColumn, { width: column.width ?? MIN_COLUMN_WIDTH }, alignmentStyle];
  const headerContent = (
    <View style={styles.headerColumnContent}>
      <Animated.View style={[styles.animatedBackground, { backgroundColor: colors.bgGreyTransparentPrimary }, backgroundAnimatedStyle]} />
      <Animated.View style={labelAnimatedStyle}>
        <EtText variant="body-tiny-regular" numberOfLines={1} ellipsizeMode="tail" style={{ color: colors.textSecondaryNeutral, ...titleTextStyle }}>
          {column.title}
        </EtText>
      </Animated.View>
      <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(200)}>
        {sort?.direction === 'asc' ? (
          <ChevronUp size={14} color={isSorted ? colors.textPrimaryNeutral : colors.transparent} />
        ) : (
          <ChevronDown size={14} color={isSorted ? colors.textPrimaryNeutral : colors.transparent} />
        )}
      </Animated.View>
    </View>
  );

  if (sortInteractionEnabled) {
    return (
      <Pressable style={columnStyle} onPress={handlePress} testID={`table-header-${column.name}`}>
        {headerContent}
      </Pressable>
    );
  }

  return <View style={columnStyle}>{headerContent}</View>;
}

const styles = StyleSheet.create({
  headerColumn: {
    position: 'relative',
    paddingVertical: X2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerColumnContent: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '100%',
    paddingVertical: X1,
    paddingHorizontal: X2,
  },
  animatedBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: X6,
  },
});
