/* eslint-disable react-native/no-unused-styles -- createStyles returns dynamic styles; rule cannot trace usage */
import { useEffect, useMemo } from 'react';
import { type LayoutChangeEvent, StyleSheet } from 'react-native';
import Reanimated from 'react-native-reanimated';

import { EtText } from '../../../../foundations/text';
import { create } from '../../../../utils';
import { unitLayoutTransition } from '../animations';
import type { AmountInputDisplayAffixProps } from '../api/types';
import { useAmountInputDisplayConfigContext, useAmountInputDisplayStateContext } from '../context';

const AFFIX_ID = 'unit';
/** The number→unit gap is owned entirely by the always-mounted caret (fixed `CARET_GAP`), so the unit adds none. */
const UNIT_GAP = 0;

function AmountInputDisplayUnitBase({ children, style }: AmountInputDisplayAffixProps) {
  const { affixColor, affixFontSize, weight } = useAmountInputDisplayConfigContext();
  const { registerAffixWidth, clearAffixWidth } = useAmountInputDisplayStateContext();
  const styles = useMemo(() => createStyles(affixColor, affixFontSize), [affixColor, affixFontSize]);

  useEffect(() => () => clearAffixWidth(AFFIX_ID), [clearAffixWidth]);

  const handleLayout = (event: LayoutChangeEvent) => {
    registerAffixWidth(AFFIX_ID, event.nativeEvent.layout.width + UNIT_GAP);
  };

  // The wrapper carries the gap + the direction-aware slide so the label glides (typing) or waits-then-
  // slides (deleting) instead of snapping. The text keeps onLayout so the measured width is unchanged.
  return (
    <Reanimated.View style={styles.wrapper} layout={unitLayoutTransition}>
      <EtText
        variant="num-l"
        weight={weight}
        numberOfLines={1}
        onLayout={handleLayout}
        style={[styles.affix, style]}
        testID="amount-input-display-unit"
      >
        {children}
      </EtText>
    </Reanimated.View>
  );
}

const createStyles = (color: string, fontSize: number) =>
  StyleSheet.create({
    wrapper: {
      marginStart: UNIT_GAP,
    },
    affix: {
      fontSize,
      lineHeight: Math.round(fontSize * 1.1875),
      letterSpacing: -0.25,
      color,
      fontVariant: ['lining-nums', 'tabular-nums'],
      // Baseline-align the unit with the hero number. The larger unit font (52px vs the currency's
      // ~40px) carries more built-in leading/descent, so it needs less bottom padding than the
      // currency's 7px to keep its baseline pinned to the digits instead of riding up (centered).
      paddingBottom: 3,
    },
  });

export const AmountInputDisplayUnit = create(AmountInputDisplayUnitBase, 'EtAmountInputDisplay.Unit');
