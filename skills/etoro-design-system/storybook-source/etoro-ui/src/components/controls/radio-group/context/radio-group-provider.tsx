import { PropsWithChildren, useMemo } from 'react';

import { RadioGroupContextValue } from '../api/types';
import { RadioGroupContext } from './radio-group-context';

export interface RadioGroupProviderProps extends PropsWithChildren {
  value: string | null;
  onSelect: (value: string) => void;
  disabled: boolean;
  error: boolean;
}

export function RadioGroupProvider({ children, value, onSelect, disabled, error }: RadioGroupProviderProps) {
  const contextValue = useMemo<RadioGroupContextValue>(
    () => ({
      value,
      onSelect,
      disabled,
      error,
    }),
    [value, onSelect, disabled, error],
  );

  return <RadioGroupContext.Provider value={contextValue}>{children}</RadioGroupContext.Provider>;
}
