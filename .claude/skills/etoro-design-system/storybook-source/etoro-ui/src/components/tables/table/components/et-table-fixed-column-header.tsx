// NATIVE TWIN: the advanced watchlist table renders the advanced table header band and sortable header cells natively on iOS (SwiftUI) and
// Android (Compose) — apps/etoro-mobile/modules/advanced-table/ios/AdvancedTableView.swift (AdvancedTableHeaderBar / AdvancedTableHeaderCell) and
// apps/etoro-mobile/modules/advanced-table/android/.../AdvancedTableView.kt (AdvancedTableHeaderBar / AdvancedTableHeaderCell). A change here must be mirrored in both;
// see apps/etoro-mobile/modules/advanced-table/AGENTS.md for the full map.
import { Fragment, ReactNode, useCallback, useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut, SharedValue, useAnimatedStyle } from 'react-native-reanimated';

import { useEtoroTheme } from '../../../../core/hooks';
import ChevronDown from '../../../../core/icons/chevron-down';
import ChevronUp from '../../../../core/icons/chevron-up';
import { HALF, X1, X2, X3, X6 } from '../../../../core/styles/spacing';
import { EtText } from '../../../../foundations/text/et-text';
import { LEADING_TEXT_STYLE } from '../../../../utils/rtl';
import { EtScrollHeaderFade } from '../../../data-display/scroll-header-fade';
import { EtTableColumn, EtTableGlassEffect, EtTableSortState } from '../api';
import { tableStyles } from '../styles';
import { computeColumnsTotalWidth, getNextSortState, isEtTableColumnMarkedNonSortable, isEtTableColumnSortable, MIN_COLUMN_WIDTH } from '../utils';
import GlassOverlay from './glass-overlay';

export interface EtTableFixedColumnHeaderProps {
  firstColumn: EtTableColumn;
  movingColumns: EtTableColumn[];
  scrollOffsetX: SharedValue<number>;
  renderHeaderColumn?: (column: EtTableColumn) => ReactNode;
  glassEffect?: EtTableGlassEffect;
  sort?: EtTableSortState | null;
  onSortChange?: (next: EtTableSortState | null) => void;
  /** Adds the same scroll-linked edge fade used by sticky list headers. */
  showScrollHeaderFade?: boolean;
  /** Overrides the fade start color. Defaults to EtScrollHeaderFade's themed page background. */
  scrollHeaderFadeColor?: string;
  /** Uses the stable, compact watchlist header treatment for sortable columns. */
  minimalSortHeader?: boolean;
}

export function EtTableFixedColumnHeader({
  firstColumn,
  movingColumns,
  scrollOffsetX,
  glassEffect,
  sort,
  renderHeaderColumn,
  onSortChange,
  showScrollHeaderFade = false,
  scrollHeaderFadeColor,
  minimalSortHeader = false,
}: EtTableFixedColumnHeaderProps) {
  const { colors } = useEtoroTheme();

  const activeSort: EtTableSortState | null = sort ?? null;

  const headerTranslateStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -scrollOffsetX.value }],
  }));

  const sortEnabled = onSortChange != null;

  const onHeaderColumnPress = useCallback(
    (column: EtTableColumn) => {
      if (!isEtTableColumnSortable(column, sortEnabled)) return;
      onSortChange?.(getNextSortState(activeSort, column.name));
    },
    [activeSort, onSortChange, sortEnabled],
  );

  const renderDefaultHeaderColumn = useCallback(
    (column: EtTableColumn, onPress: (column: EtTableColumn) => void, alignment: 'left' | 'center' | 'right' = 'center') => {
      const isSorted = activeSort !== null && activeSort.column === column.name;

      const alignmentStyle: {
        justifyContent: 'flex-start' | 'flex-end' | 'center';
      } = {
        justifyContent: alignment === 'left' ? 'flex-start' : alignment === 'right' ? 'flex-end' : 'center',
      };

      const headerColumnStyle = minimalSortHeader ? [styles.headerColumn, styles.headerColumnMinimal] : styles.headerColumn;
      const headerColumnContentStyle = minimalSortHeader
        ? [styles.headerColumnContent, styles.headerColumnContentMinimal]
        : styles.headerColumnContent;
      const flushLeftContentStyle =
        minimalSortHeader && alignment === 'left'
          ? [styles.headerColumnContent, styles.headerColumnContentMinimal, styles.headerColumnContentFlushLeft]
          : headerColumnContentStyle;

      // Keep the same typography metrics in every state so changing the sort
      // never changes the row height or the title's vertical position.
      const titleVariant = 'body-tiny-regular';
      const titleTextStyle = alignment === 'left' ? LEADING_TEXT_STYLE : { textAlign: alignment };
      const columnBoundaryStyle = column.isFirstColumn ? undefined : styles.headerColumnClip;

      // A non-sortable column has no chevron, so its title centres on its own —
      // which lines up with the centred cell values below it (PBD-676).
      if (isEtTableColumnMarkedNonSortable(column)) {
        return (
          <View
            style={[headerColumnStyle, columnBoundaryStyle, { width: column.width ?? MIN_COLUMN_WIDTH }, alignmentStyle]}
            testID={`table-header-${column.name}`}
          >
            <View style={flushLeftContentStyle}>
              <EtText
                variant={titleVariant}
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[styles.headerTitle, { color: colors.textSecondaryNeutral }, titleTextStyle]}
                testID={`table-header-${column.name}-title`}
              >
                {column.title}
              </EtText>
            </View>
          </View>
        );
      }

      const columnStyle = [headerColumnStyle, columnBoundaryStyle, { width: column.width ?? MIN_COLUMN_WIDTH }, alignmentStyle];
      const titleColor = colors.textSecondaryNeutral;

      // For a centred, in-flow header the chevron sits to the title's right and
      // would otherwise pull the title left of the column centre — so the title
      // no longer lines up with the centred cell value below it. A matching
      // transparent spacer on the left re-centres the title (PBD-676). Minimal
      // mode intentionally centres the complete title + arrow chip, matching
      // the simple watchlist header.
      const needsChevronBalanceSpacer = alignment === 'center' && !minimalSortHeader;
      const shouldRenderChevron = !minimalSortHeader || isSorted;

      const titleAndArrow = (
        <>
          {needsChevronBalanceSpacer && <View style={styles.headerSortChevronSpacer} />}
          <EtText
            variant={titleVariant}
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[styles.headerTitle, { color: titleColor }, titleTextStyle]}
            testID={`table-header-${column.name}-title`}
          >
            {column.title}
          </EtText>

          {shouldRenderChevron && (
            <Animated.View
              style={styles.headerSortChevron}
              entering={FadeIn.duration(200)}
              exiting={FadeOut.duration(200)}
              testID={`table-header-${column.name}-sort-icon`}
            >
              {activeSort?.direction === 'asc' ? (
                <ChevronUp size={minimalSortHeader ? 16 : 14} color={isSorted ? colors.textPrimaryNeutral : colors.transparent} />
              ) : (
                <ChevronDown size={minimalSortHeader ? 16 : 14} color={isSorted ? colors.textPrimaryNeutral : colors.transparent} />
              )}
            </Animated.View>
          )}
        </>
      );

      // Standard headers keep the transparent chevron footprint for stable
      // centring. Compact headers release that space while idle so the title
      // gets the full column width, then shrink the title around the visible
      // chevron when sorted.
      const headerContent = (
        <View style={flushLeftContentStyle}>
          <Animated.View
            style={[styles.animatedBackground, { backgroundColor: isSorted ? colors.bgGreyTransparentPrimary : colors.transparent }]}
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
          />
          {titleAndArrow}
        </View>
      );

      if (sortEnabled) {
        return (
          <Pressable style={columnStyle} onPress={() => onPress(column)} testID={`table-header-${column.name}`}>
            {headerContent}
          </Pressable>
        );
      }

      return <View style={columnStyle}>{headerContent}</View>;
    },
    [
      activeSort,
      colors.textSecondaryNeutral,
      colors.textPrimaryNeutral,
      colors.bgGreyTransparentPrimary,
      colors.transparent,
      sortEnabled,
      minimalSortHeader,
    ],
  );

  const scrollableWidth = useMemo(() => computeColumnsTotalWidth(movingColumns), [movingColumns]);
  const headerStyle = [tableStyles.header, { backgroundColor: colors.backgroundBase }];

  return (
    <View>
      <View
        style={[
          tableStyles.glassContainer,
          {
            width: firstColumn.width ?? 'auto',
          },
        ]}
      >
        {!glassEffect?.disabled && (
          <GlassOverlay
            scrollOffsetX={scrollOffsetX}
            glassEffect={{
              blurIntensity: 10,
            }}
          />
        )}
      </View>
      <View style={headerStyle}>
        <View style={[tableStyles.fixedColumnSection, { width: firstColumn.width ?? 'auto' }]}>
          {renderHeaderColumn ? renderHeaderColumn(firstColumn) : renderDefaultHeaderColumn(firstColumn, onHeaderColumnPress, 'left')}
        </View>
        <View style={styles.headerScrollClip}>
          <Animated.View style={[styles.headerColumnsRow, headerTranslateStyle, { width: scrollableWidth }]}>
            {movingColumns.map((column) => {
              return (
                <Fragment key={column.name}>
                  {renderHeaderColumn ? renderHeaderColumn(column) : renderDefaultHeaderColumn(column, onHeaderColumnPress, column.align ?? 'center')}
                </Fragment>
              );
            })}
          </Animated.View>
        </View>
      </View>
      {showScrollHeaderFade && <EtScrollHeaderFade color={scrollHeaderFadeColor} />}
    </View>
  );
}

const styles = StyleSheet.create({
  headerColumn: {
    position: 'relative',
    paddingVertical: X2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerColumnMinimal: {
    paddingTop: X3,
    paddingBottom: HALF,
  },
  headerColumnClip: {
    overflow: 'hidden',
  },
  headerColumnContent: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    minWidth: 0,
    maxWidth: '100%',
    paddingVertical: X1,
    paddingHorizontal: X2,
  },
  headerColumnContentMinimal: {
    gap: X1,
  },
  // Let the selected chip extend into the outer gutter while preserving the
  // title's original x-position, matching the simple watchlist header.
  headerColumnContentFlushLeft: {
    marginStart: -X2,
    paddingStart: X2,
  },
  // Same footprint as the 14px sort chevron, placed before the title so the
  // title stays centred in the column (see needsChevronBalanceSpacer).
  headerSortChevronSpacer: {
    width: 14,
  },
  headerSortChevron: {
    flexShrink: 0,
  },
  headerTitle: {
    flexShrink: 1,
    minWidth: 0,
  },
  headerScrollClip: {
    flex: 1,
    overflow: 'hidden',
  },
  headerColumnsRow: {
    flexDirection: 'row',
    marginLeft: X1,
    // Locked LTR to match the scrolling body's `scrollableWrapper`/`scrollableContent`
    // (both locked for the same reason) — otherwise this row's column order and the
    // body's would mirror independently under RTL and desync (PAH-676).
    direction: 'ltr',
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
