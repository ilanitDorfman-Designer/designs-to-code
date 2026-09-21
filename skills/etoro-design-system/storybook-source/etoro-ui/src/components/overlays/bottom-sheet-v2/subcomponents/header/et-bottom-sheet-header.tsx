import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { useBottomSheetConfig } from '../../context';
import { ACTIONS_AREA_MARGIN_LEFT, HEADER_PADDING_BOTTOM, HEADER_PADDING_HORIZONTAL } from './et-bottom-sheet-header.const';
import type { EtBottomSheetHeaderProps } from './et-bottom-sheet-header.types';
import { EtBottomSheetHeaderAction } from './et-bottom-sheet-header-action';
import { EtBottomSheetHeaderTitle } from './et-bottom-sheet-header-title';
import { hasCompoundChildren, isAction, isTitle } from './utils';

/**
 * EtBottomSheet.Header - Compound component for bottom sheet headers.
 *
 * Provides Title and Action subcomponents for building headers.
 * Action children are always positioned at the trailing edge.
 *
 * Also accepts arbitrary children for fully custom header layouts.
 */
function EtBottomSheetHeaderRoot({ children, style, testID }: EtBottomSheetHeaderProps) {
  const { colors } = useBottomSheetConfig();

  const headerBackgroundStyle = {
    backgroundColor: colors.background,
    zIndex: 1,
  };

  if (hasCompoundChildren(children)) {
    const childArray = React.Children.toArray(children);
    const actionChildren = childArray.filter(isAction);
    const titleChildren = childArray.filter(isTitle);
    const otherChildren = childArray.filter((child) => !isAction(child) && !isTitle(child));

    const hasTitle = titleChildren.length > 0;
    const hasActions = actionChildren.length > 0;

    return (
      <View style={[styles.compoundHeader, headerBackgroundStyle, style]} testID={testID}>
        {hasTitle ? (
          <>
            <View style={styles.sideColumn}>{otherChildren}</View>
            <View style={styles.centerColumn}>{titleChildren}</View>
            <View style={styles.sideColumnEnd}>{hasActions && actionChildren}</View>
          </>
        ) : (
          <>
            <View style={styles.contentArea}>{otherChildren}</View>
            {hasActions && <View style={styles.actionsArea}>{actionChildren}</View>}
          </>
        )}
      </View>
    );
  }

  return (
    <View style={[styles.customHeader, headerBackgroundStyle, style]} testID={testID}>
      {children}
    </View>
  );
}

const MemoizedRoot = memo(EtBottomSheetHeaderRoot);
MemoizedRoot.displayName = 'EtBottomSheet.Header';

export const EtBottomSheetHeader = Object.assign(MemoizedRoot, {
  Title: EtBottomSheetHeaderTitle,
  Action: EtBottomSheetHeaderAction,
});

const styles = StyleSheet.create({
  compoundHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: HEADER_PADDING_BOTTOM,
    paddingHorizontal: HEADER_PADDING_HORIZONTAL,
  },
  sideColumn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  centerColumn: {
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sideColumnEnd: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  contentArea: {
    flex: 1,
    justifyContent: 'center',
  },
  actionsArea: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: ACTIONS_AREA_MARGIN_LEFT,
  },
  customHeader: {
    paddingHorizontal: HEADER_PADDING_HORIZONTAL,
  },
});
