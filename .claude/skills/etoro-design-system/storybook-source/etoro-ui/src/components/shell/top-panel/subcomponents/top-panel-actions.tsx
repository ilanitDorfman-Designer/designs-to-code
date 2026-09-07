import React from 'react';
import { StyleSheet, View } from 'react-native';

import { create } from '../../../../utils/create';
import type { EtTopPanelActionsProps, TopPanelSlotType } from '../api/types';
import { ACTION_SLOT_SIZE, ACTIONS_PADDING } from '../constants';

/**
 * EtTopPanel.Actions — the trailing cluster: padding 4 around the bell's 36×36
 * slot, so a lone bell is the mock's 44×44 icon button. The cluster hugs its
 * content: `children` is the bell; `leading` is the screen's handed-up action,
 * rendered RAW before it — not boxed. A screen may hand up content that renders
 * null under the frame (Home's superseded capsules do), and a fixed slot around
 * it would re-create phantom geometry that shifts the centered search group.
 */
function TopPanelActionsBase({ children, leading, testID }: EtTopPanelActionsProps) {
  return (
    <View style={styles.cluster} testID={testID}>
      {leading}
      <View style={styles.slot}>{children}</View>
    </View>
  );
}

export const TopPanelActions = create(TopPanelActionsBase, 'EtTopPanel.Actions') as React.MemoExoticComponent<
  React.ComponentType<EtTopPanelActionsProps>
> & { __SLOT_TYPE: TopPanelSlotType };

TopPanelActions.__SLOT_TYPE = 'actions';

const styles = StyleSheet.create({
  cluster: {
    padding: ACTIONS_PADDING,
    flexDirection: 'row',
    alignItems: 'center',
  },
  slot: {
    width: ACTION_SLOT_SIZE,
    height: ACTION_SLOT_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
