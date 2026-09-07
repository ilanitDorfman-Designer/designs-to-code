import { PropsWithChildren, useMemo } from 'react';
import type { SharedValue } from 'react-native-reanimated';

import { ChipContext } from './chip-context';

export interface ChipProviderProps extends PropsWithChildren {
  selected: boolean;
  disabled: boolean;
  selectedProgress: SharedValue<number>;
}

export function ChipProvider({ children, selected, disabled, selectedProgress }: ChipProviderProps) {
  const contextValue = useMemo(
    () => ({
      selected,
      disabled,
      selectedProgress,
    }),
    [selected, disabled, selectedProgress],
  );

  return <ChipContext.Provider value={contextValue}>{children}</ChipContext.Provider>;
}
