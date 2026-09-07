import { PropsWithChildren, useMemo } from 'react';

import { ButtonGroupContext } from './button-group-context';

export interface ButtonGroupProviderProps extends PropsWithChildren {
  /** Whether this item is the first in the group */
  isFirst: boolean;
  /** Whether this item is the last in the group */
  isLast: boolean;
}

/**
 * Provider component for button group context
 * Wraps each button item to provide position information
 */
export function ButtonGroupProvider({ children, isFirst, isLast }: ButtonGroupProviderProps) {
  const contextValue = useMemo(
    () => ({
      isFirst,
      isLast,
    }),
    [isFirst, isLast],
  );

  return <ButtonGroupContext.Provider value={contextValue}>{children}</ButtonGroupContext.Provider>;
}
