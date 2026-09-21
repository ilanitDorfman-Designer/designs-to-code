import React, { Children } from 'react';
import { StyleSheet, View } from 'react-native';

import { X2 } from '../../../../core/styles/spacing';
import { create } from '../../../../utils/create';
import type { EtTopPanelLeadingProps, TopPanelSlotType } from '../api/types';
import { LEADING_SLOT_SIZE } from '../constants';

/**
 * EtTopPanel.Leading — the leading slot. Hosts `EtSideMenuTrigger` at tier -1 and
 * whatever the screen on top handed up (its back control and its title); with no
 * children it renders nothing — the search group centers in the flexible zone, so
 * there is no geometry for an empty slot to hold.
 *
 * The slot has no minimum width for the same reason: handed-up content may render
 * null under the frame (Home's superseded capsules do), and a floor would hold a
 * phantom box open where the design has nothing. Content sizes the slot, only.
 *
 * Emptiness is detected via `Children.toArray`, which strips `null`/`undefined`
 * and booleans — so both `{cond ? <Trigger/> : null}` and `{cond && <Trigger/>}`
 * register as empty when the condition is false (`Children.count(false)` is 1
 * and would silently render an empty box).
 */
function TopPanelLeadingBase({ children, testID }: EtTopPanelLeadingProps) {
  if (Children.toArray(children).length === 0) {
    return null;
  }

  return (
    <View style={styles.slot} testID={testID}>
      {children}
    </View>
  );
}

export const TopPanelLeading = create(TopPanelLeadingBase, 'EtTopPanel.Leading') as React.MemoExoticComponent<
  React.ComponentType<EtTopPanelLeadingProps>
> & { __SLOT_TYPE: TopPanelSlotType };

TopPanelLeading.__SLOT_TYPE = 'leading';

const styles = StyleSheet.create({
  slot: {
    height: LEADING_SLOT_SIZE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 1,
    gap: X2,
  },
});
