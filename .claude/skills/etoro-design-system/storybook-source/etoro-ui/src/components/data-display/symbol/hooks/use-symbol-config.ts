import type { SymbolContextValue, SymbolShape, SymbolSize } from '../api/types';
import { getBorderRadius, getSizeValue } from '../utils/styles';

export interface SymbolConfig {
  sizeValue: number;
  borderRadius: number;
  contextValue: SymbolContextValue;
}

export function useSymbolConfig({ size, shape }: { size: SymbolSize; shape: SymbolShape }): SymbolConfig {
  const sizeValue = getSizeValue(size);
  const borderRadius = getBorderRadius(size, shape);

  const contextValue: SymbolContextValue = {
    size,
    sizeValue,
  };

  return {
    sizeValue,
    borderRadius,
    contextValue,
  };
}
