import { EtText } from '../../../../foundations/text/et-text';
import type { SymbolTextProps } from '../api/types';
import { DEFAULT_SYMBOL_COLOR } from '../constants';
import { useSymbolContext } from '../context/symbol-context';
import { getSizeConfig } from '../utils/styles';

/**
 * EtSymbol.Text - Renders centered text inside the symbol box
 *
 * Useful for short labels like file types (PNG, JPG), codes, or abbreviations
 * Text size automatically adjusts based on symbol size
 */
export function SymbolText({ children, color = DEFAULT_SYMBOL_COLOR }: SymbolTextProps) {
  const { size } = useSymbolContext();
  const config = getSizeConfig(size);

  return (
    <EtText variant={config.textVariant} style={{ color }}>
      {children}
    </EtText>
  );
}

SymbolText.displayName = 'EtSymbol.Text';
