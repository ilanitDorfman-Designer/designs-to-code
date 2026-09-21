/* eslint-disable react-native/no-unused-styles -- createStyles returns dynamic styles; rule cannot trace usage */
import { useEffect, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import Reanimated, { useAnimatedStyle } from 'react-native-reanimated';

import { X1, X3 } from '../../../../core/styles/spacing';
import { create } from '../../../../utils';
import { useAmountInputDisplayConfigContext, useAmountInputDisplayStateContext } from '../context';

const AFFIX_ID = 'caret';
/** Bar thickness of the caret. */
const CARET_WIDTH = 2;
/**
 * Fixed number→unit gap (design spec). The always-mounted caret owns this whole gap so it stays constant
 * whether the caret is visible (focused) or hidden (blurred). The bar is centered in the gap (equal
 * breathing room on each side) so it reads as sitting between the number and the unit.
 */
const CARET_GAP = X3;
/** Equal side margins so the bar sits centered in `CARET_GAP`. */
const CARET_SIDE_MARGIN = (CARET_GAP - CARET_WIDTH) / 2;
/** Reserved width for the caret (bar + both side margins) so the scale math accounts for it. */
const CARET_RESERVED_WIDTH = CARET_GAP;

function AmountInputDisplayCaretBase() {
  const { caretColor } = useAmountInputDisplayConfigContext();
  const { caretOpacity, registerAffixWidth, clearAffixWidth } = useAmountInputDisplayStateContext();
  const styles = useMemo(() => createStyles(caretColor), [caretColor]);
  const caretStyle = useAnimatedStyle(() => ({ opacity: caretOpacity.get() }));

  useEffect(() => {
    registerAffixWidth(AFFIX_ID, CARET_RESERVED_WIDTH);
    return () => clearAffixWidth(AFFIX_ID);
  }, [registerAffixWidth, clearAffixWidth]);

  return <Reanimated.View style={[styles.cursor, caretStyle]} testID="amount-input-display-caret" />;
}

const createStyles = (color: string) =>
  StyleSheet.create({
    cursor: {
      width: CARET_WIDTH,
      height: 48,
      backgroundColor: color,
      marginStart: CARET_SIDE_MARGIN,
      marginEnd: CARET_SIDE_MARGIN,
      alignSelf: 'center',
      borderRadius: X1 / 4,
    },
  });

export const AmountInputDisplayCaret = create(AmountInputDisplayCaretBase, 'EtAmountInputDisplay.Caret');
