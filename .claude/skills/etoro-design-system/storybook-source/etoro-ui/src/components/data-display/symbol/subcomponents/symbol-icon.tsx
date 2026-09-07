import { EtIconV2 } from '../../../et-icon-v2/et-icon-v2';
import type { SymbolIconProps } from '../api/types';
import { DEFAULT_SYMBOL_COLOR } from '../constants';
import { useSymbolContext } from '../context/symbol-context';
import { getSizeConfig } from '../utils/styles';

/**
 * EtSymbol.Icon - Renders a centered icon using EtIconV2
 */
export function SymbolIcon({ name, color = DEFAULT_SYMBOL_COLOR }: SymbolIconProps) {
  const { size } = useSymbolContext();
  const config = getSizeConfig(size);

  return <EtIconV2 name={name} size={config.iconSize} color={color} />;
}

SymbolIcon.displayName = 'EtSymbol.Icon';
