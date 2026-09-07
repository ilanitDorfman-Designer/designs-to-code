import { PropsWithChildren, useMemo } from 'react';

import { SelectionTileGroupContextValue, SelectionTileSelectionMode, SelectionTileSize, SelectionTileVariant } from '../api/types';
import { SelectionTileGroupContext } from './selection-tile-group-context';

export interface SelectionTileGroupProviderProps extends PropsWithChildren {
  value: string | null | string[];
  onSelect: (value: string) => void;
  disabled: boolean;
  variant: SelectionTileVariant;
  selectionMode: SelectionTileSelectionMode;
  size: SelectionTileSize;
}

export function SelectionTileGroupProvider({ children, value, onSelect, disabled, variant, selectionMode, size }: SelectionTileGroupProviderProps) {
  const contextValue = useMemo<SelectionTileGroupContextValue>(
    () => ({
      value,
      onSelect,
      disabled,
      variant,
      selectionMode,
      size,
    }),
    [value, onSelect, disabled, variant, selectionMode, size],
  );

  return <SelectionTileGroupContext.Provider value={contextValue}>{children}</SelectionTileGroupContext.Provider>;
}
