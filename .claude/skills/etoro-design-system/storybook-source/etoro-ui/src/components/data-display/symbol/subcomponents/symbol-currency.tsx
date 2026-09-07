import { EtText } from '../../../../foundations/text/et-text';
import type { SymbolCurrencyProps } from '../api/types';
import { DEFAULT_SYMBOL_COLOR } from '../constants';
import { useSymbolContext } from '../context/symbol-context';
import { getSizeConfig } from '../utils/styles';

export function SymbolCurrency({ children, color = DEFAULT_SYMBOL_COLOR }: SymbolCurrencyProps) {
  const { size } = useSymbolContext();
  const config = getSizeConfig(size);

  return (
    <EtText variant={config.currencyVariant} style={{ color }}>
      {children}
    </EtText>
  );
}

SymbolCurrency.displayName = 'EtSymbol.Currency';
