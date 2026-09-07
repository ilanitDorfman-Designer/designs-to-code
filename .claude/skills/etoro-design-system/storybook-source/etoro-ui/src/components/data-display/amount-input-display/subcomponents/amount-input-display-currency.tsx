/* eslint-disable react-native/no-unused-styles -- createStyles returns dynamic styles; rule cannot trace usage */
import { useEffect, useMemo } from 'react';
import { type LayoutChangeEvent, StyleSheet } from 'react-native';

import { EtText } from '../../../../foundations/text';
import { create } from '../../../../utils';
import type { AmountInputDisplayAffixProps } from '../api/types';
import { useAmountInputDisplayConfigContext, useAmountInputDisplayStateContext } from '../context';

const AFFIX_ID = 'currency';

function AmountInputDisplayCurrencyBase({ children, style }: AmountInputDisplayAffixProps) {
  const { currencyColor, currencyFontSize, weight } = useAmountInputDisplayConfigContext();
  const { registerAffixWidth, clearAffixWidth } = useAmountInputDisplayStateContext();
  const styles = useMemo(() => createStyles(currencyColor, currencyFontSize), [currencyColor, currencyFontSize]);

  useEffect(() => () => clearAffixWidth(AFFIX_ID), [clearAffixWidth]);

  const handleLayout = (event: LayoutChangeEvent) => {
    registerAffixWidth(AFFIX_ID, event.nativeEvent.layout.width);
  };

  return (
    <EtText
      variant="num-l"
      weight={weight}
      numberOfLines={1}
      onLayout={handleLayout}
      style={[styles.affix, style]}
      testID="amount-input-display-currency"
    >
      {children}
    </EtText>
  );
}

const createStyles = (color: string, fontSize: number) =>
  StyleSheet.create({
    affix: {
      fontSize,
      lineHeight: Math.round(fontSize * 1.1875),
      letterSpacing: -0.25,
      color,
      fontVariant: ['lining-nums', 'tabular-nums'],
      paddingBottom: 7,
    },
  });

export const AmountInputDisplayCurrency = create(AmountInputDisplayCurrencyBase, 'EtAmountInputDisplay.Currency');
