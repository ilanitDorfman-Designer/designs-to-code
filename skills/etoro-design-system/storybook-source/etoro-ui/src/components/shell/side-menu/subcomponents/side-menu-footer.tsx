import React from 'react';
import { StyleSheet, View } from 'react-native';

import { create } from '../../../../utils/create';
import type { EtSideMenuFooterProps, SideMenuSlotType } from '../api/types';
import { useSideMenuLayer } from '../context';

/**
 * EtSideMenu.Footer — rail-only bottom group (e.g. the kebab "More" cell);
 * renders nothing in the expanded panel (strict Figma parity). Children are
 * `EtSideMenu.Item`s that render as rail cells.
 */
function SideMenuFooterBase({ children, testID }: EtSideMenuFooterProps) {
  const layer = useSideMenuLayer();

  if (layer === 'panel') {
    return null;
  }

  return (
    <View style={styles.footer} testID={testID}>
      {children}
    </View>
  );
}

export const SideMenuFooter = create(SideMenuFooterBase, 'EtSideMenu.Footer') as React.MemoExoticComponent<
  React.ComponentType<EtSideMenuFooterProps>
> & { __SLOT_TYPE: SideMenuSlotType };

SideMenuFooter.__SLOT_TYPE = 'footer';

const styles = StyleSheet.create({
  footer: {
    alignItems: 'center',
  },
});
