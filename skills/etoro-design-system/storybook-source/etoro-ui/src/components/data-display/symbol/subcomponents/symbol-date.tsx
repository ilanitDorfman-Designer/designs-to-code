import { StyleSheet } from 'react-native';

import { EtText } from '../../../../foundations/text/et-text';
import type { SymbolDateProps } from '../api/types';
import { DEFAULT_SYMBOL_COLOR } from '../constants';
import { useSymbolContext } from '../context/symbol-context';
import { getSizeConfig } from '../utils/styles';

/**
 * EtSymbol.Date - Renders a two-line date display (day + month)
 */
export function SymbolDate({ day, month, color = DEFAULT_SYMBOL_COLOR }: SymbolDateProps) {
  const { size } = useSymbolContext();
  const config = getSizeConfig(size);

  return (
    <>
      <EtText variant={config.dateDay} style={[styles.text, { color }]}>
        {day}
      </EtText>
      <EtText variant={config.dateMonth} style={[styles.text, { color }]}>
        {month}
      </EtText>
    </>
  );
}

SymbolDate.displayName = 'EtSymbol.Date';

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
  },
});
