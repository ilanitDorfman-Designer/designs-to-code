import { createContext, ReactNode, useContext, useMemo } from 'react';

import { CardContextValue } from './types';

/**
 * Internal context for EtCard compound component.
 */
export const CardContext = createContext<CardContextValue | null>(null);

/**
 * Hook to access Card context.
 * Must be used within an EtCard component.
 *
 * @throws Error if used outside of EtCard
 */
export function useCardContext(): CardContextValue {
  const context = useContext(CardContext);
  if (!context) {
    throw new Error(
      'useCardContext must be used within an EtCard component. ' + 'Make sure EtCard.Header, EtCard.Content, etc. ' + 'are children of EtCard.',
    );
  }
  return context;
}

// ============================================================================
// Context Provider
// ============================================================================

interface CardProviderProps {
  isPositive?: boolean;
  children: ReactNode;
}

/**
 * Provider component that shares data with subcomponents.
 */
export function CardProvider({ isPositive, children }: CardProviderProps) {
  const contextValue: CardContextValue = useMemo(
    () => ({
      isPositive,
    }),
    [isPositive],
  );

  return <CardContext.Provider value={contextValue}>{children}</CardContext.Provider>;
}
