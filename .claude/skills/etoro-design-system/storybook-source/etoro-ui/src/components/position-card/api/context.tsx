import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

import { ExpandDirection, PositionCardContextValue, PositionCardVariant } from './types';

/**
 * Internal context for EtPositionCard compound component.
 */
export const PositionCardContext = createContext<PositionCardContextValue | null>(null);

/**
 * Hook to access PositionCard context.
 * Must be used within an EtPositionCard component.
 *
 * @throws Error if used outside of EtPositionCard
 */
export function usePositionCardContext(): PositionCardContextValue {
  const context = useContext(PositionCardContext);
  if (!context) {
    throw new Error(
      'usePositionCardContext must be used within an EtPositionCard component. ' + 'Make sure subcomponents are children of EtPositionCard.',
    );
  }
  return context;
}

// ============================================================================
// Context Provider
// ============================================================================

interface PositionCardProviderProps {
  isExpanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  isLoading?: boolean;
  expandDirection?: ExpandDirection;
  variant?: PositionCardVariant;
  handleBackgroundColor?: string;
  disableExpandAnimation?: boolean;
  hideHandle?: boolean;
  children: ReactNode;
}

/**
 * Provider component that manages PositionCard state.
 */
export function PositionCardProvider({
  isExpanded: controlledExpanded,
  defaultExpanded = false,
  onExpandedChange,
  isLoading = false,
  expandDirection = 'down',
  variant = 'positive',
  handleBackgroundColor,
  disableExpandAnimation = false,
  hideHandle = false,
  children,
}: PositionCardProviderProps) {
  // Internal state for uncontrolled mode
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);

  // Determine if controlled or uncontrolled
  const isControlled = controlledExpanded !== undefined;
  const isExpanded = isControlled ? controlledExpanded : internalExpanded;

  const onToggle = useCallback(() => {
    const newValue = !isExpanded;

    if (!isControlled) {
      setInternalExpanded(newValue);
    }

    onExpandedChange?.(newValue);
  }, [isExpanded, isControlled, onExpandedChange]);

  const contextValue: PositionCardContextValue = useMemo(
    () => ({
      isExpanded,
      isLoading,
      expandDirection,
      handleBackgroundColor,
      variant,
      onToggle,
      disableExpandAnimation,
      hideHandle,
    }),
    [isExpanded, isLoading, expandDirection, handleBackgroundColor, variant, onToggle, disableExpandAnimation, hideHandle],
  );

  return <PositionCardContext.Provider value={contextValue}>{children}</PositionCardContext.Provider>;
}
