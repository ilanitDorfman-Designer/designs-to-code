import React, { Children, cloneElement, createContext, isValidElement, ReactElement, useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { useEtoroTheme } from '../../../../core/hooks/use-etoro-theme';
import { EtText } from '../../../../foundations/text/et-text';
import { create } from '../../../../utils/create';
import type { EtSideMenuSectionProps, SideMenuSlotType } from '../api/types';
import { DIVIDER_PADDING_BOTTOM, DIVIDER_PADDING_TOP, MENU_HORIZONTAL_PADDING } from '../constants';
import { useSideMenuLayer } from '../context';
import { SECONDARY_BLOCK_EXPAND_WINDOW, useSideMenuBlockRevealStyle } from '../hooks/use-side-menu-animation';

interface SectionMeta {
  secondary: boolean;
}

const PRIMARY_META: SectionMeta = { secondary: false };
const SECONDARY_META: SectionMeta = { secondary: true };

/** Internal: lets Item know its row size without prop drilling (Footer items use the default). */
const SectionMetaContext = createContext<SectionMeta>(PRIMARY_META);

export const useSectionMeta = (): SectionMeta => useContext(SectionMetaContext);

/**
 * EtSideMenu.Section — primary: rail cells / staggered 48px panel rows.
 * Secondary: hidden in rail; in the panel a "More" divider row (text only, no
 * rule line) plus 40px text rows, revealed as one grouped block (items get no
 * per-row stagger — the group animates).
 *
 * Renders in both layers — `testID` is layer-suffixed (`-rail`/`-panel`).
 */
function SideMenuSectionBase({ label, secondary = false, children, testID }: EtSideMenuSectionProps) {
  const layer = useSideMenuLayer();
  const { colors } = useEtoroTheme();
  const revealStyle = useSideMenuBlockRevealStyle(SECONDARY_BLOCK_EXPAND_WINDOW);

  if (layer === 'rail') {
    if (secondary) {
      return null;
    }
    return (
      <SectionMetaContext.Provider value={PRIMARY_META}>
        <View testID={testID ? `${testID}-rail` : undefined}>{children}</View>
      </SectionMetaContext.Provider>
    );
  }

  if (secondary) {
    return (
      <SectionMetaContext.Provider value={SECONDARY_META}>
        <Animated.View style={revealStyle} testID={testID ? `${testID}-panel` : undefined}>
          {label ? (
            <View style={styles.dividerRow}>
              <EtText style={[styles.dividerLabel, { color: colors.carbon700 }]} variant="label-secondary-semibold">
                {label}
              </EtText>
            </View>
          ) : null}
          {children}
        </Animated.View>
      </SectionMetaContext.Provider>
    );
  }

  // Primary panel rows animate individually — inject the stagger index (0–4).
  const staggeredChildren = Children.toArray(children).map((child, index) =>
    isValidElement(child) ? cloneElement(child as ReactElement<{ staggerIndex?: number }>, { staggerIndex: index }) : child,
  );

  return (
    <SectionMetaContext.Provider value={PRIMARY_META}>
      <View testID={testID ? `${testID}-panel` : undefined}>{staggeredChildren}</View>
    </SectionMetaContext.Provider>
  );
}

export const SideMenuSection = create(SideMenuSectionBase, 'EtSideMenu.Section') as React.MemoExoticComponent<
  React.ComponentType<EtSideMenuSectionProps>
> & { __SLOT_TYPE: SideMenuSlotType };

SideMenuSection.__SLOT_TYPE = 'section';

const styles = StyleSheet.create({
  dividerRow: {
    paddingTop: DIVIDER_PADDING_TOP,
    paddingBottom: DIVIDER_PADDING_BOTTOM,
    paddingHorizontal: MENU_HORIZONTAL_PADDING,
  },
  dividerLabel: {
    letterSpacing: 0,
  },
});
