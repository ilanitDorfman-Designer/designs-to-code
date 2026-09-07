import { createContext, useContext } from 'react';
import type { SharedValue } from 'react-native-reanimated';

/**
 * Context value for sharing chip state with subcomponents
 */
export interface ChipContextValue {
  selected: boolean;
  disabled: boolean;
  selectedProgress: SharedValue<number>;
}

/**
 * Context for sharing chip state with subcomponents
 */
export const ChipContext = createContext<ChipContextValue | null>(null);

/**
 * Hook to access chip context from subcomponents
 * @throws Error if used outside of EtChip
 */
export function useChipContext(): ChipContextValue {
  const context = useContext(ChipContext);
  if (!context) {
    throw new Error('EtChip compound components must be used within an EtChip component');
  }
  return context;
}
