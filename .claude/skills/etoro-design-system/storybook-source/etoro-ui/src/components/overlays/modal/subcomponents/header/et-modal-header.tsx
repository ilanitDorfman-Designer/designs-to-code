import React, { isValidElement, memo, ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { EtModalHeaderProps } from '../../api';
import { ACTIONS_AREA_MARGIN_LEFT, HEADER_MIN_HEIGHT, HEADER_PADDING_HORIZONTAL, HEADER_PADDING_VERTICAL } from '../../constants';
import { useModalConfig } from '../../context';
import { EtModalHeaderAction } from './et-modal-header-action';
import { EtModalHeaderTitle } from './et-modal-header-title';

function isTitle(child: ReactNode): boolean {
  return isValidElement(child) && (child.type as { displayName?: string }).displayName === 'EtModal.Header.Title';
}

function isAction(child: ReactNode): boolean {
  return isValidElement(child) && (child.type as { displayName?: string }).displayName === 'EtModal.Header.Action';
}

function hasCompoundChildren(children: ReactNode): boolean {
  const childArray = React.Children.toArray(children);
  return childArray.some((child) => isTitle(child) || isAction(child));
}

function EtModalHeaderRoot({ children, style, testID }: EtModalHeaderProps) {
  const { colors } = useModalConfig();

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

const MemoizedRoot = memo(EtModalHeaderRoot);
MemoizedRoot.displayName = 'EtModal.Header';

export const EtModalHeader = Object.assign(MemoizedRoot, {
  Title: EtModalHeaderTitle,
  Action: EtModalHeaderAction,
});

const styles = StyleSheet.create({
  compoundHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: HEADER_MIN_HEIGHT,
    paddingHorizontal: HEADER_PADDING_HORIZONTAL,
    paddingVertical: HEADER_PADDING_VERTICAL,
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
    minHeight: HEADER_MIN_HEIGHT,
    paddingHorizontal: HEADER_PADDING_HORIZONTAL,
    paddingVertical: HEADER_PADDING_VERTICAL,
  },
});
