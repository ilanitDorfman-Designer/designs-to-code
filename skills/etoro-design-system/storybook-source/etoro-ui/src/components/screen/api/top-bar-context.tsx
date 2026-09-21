import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

import { TopBarActionsContextValue, TopBarStateContextValue } from './top-bar-types';

/**
 * Context for TopBar state (start, middle, end slots).
 * Separated from actions to prevent unnecessary re-renders.
 */
export const TopBarStateContext = createContext<TopBarStateContextValue | null>(null);

/**
 * Context for TopBar actions (register/unregister functions).
 * Stable functions that don't change, preventing re-renders for components that only register.
 */
export const TopBarActionsContext = createContext<TopBarActionsContextValue | null>(null);

/**
 * Hook to access TopBar context.
 * Must be used within EtScreen.TopBar component.
 *
 * @throws Error if used outside of EtScreen.TopBar
 */
export function useTopBarContext() {
  const state = useContext(TopBarStateContext);
  const actions = useContext(TopBarActionsContext);

  if (!state || !actions) {
    throw new Error(
      'useTopBarContext must be used within EtScreen.TopBar. ' + 'Make sure EtScreen.TopBar.Start, End, etc. ' + 'are children of EtScreen.TopBar.',
    );
  }

  return { state, actions };
}

// ============================================================================
// TopBar Context Provider
// ============================================================================

interface TopBarContextProviderProps {
  children: ReactNode;
}

/**
 * Provider component that manages TopBar subcomponent registration.
 * Splits state and actions into separate contexts to prevent unnecessary re-renders.
 */
export function TopBarContextProvider({ children }: TopBarContextProviderProps) {
  const [start, setStart] = useState<ReactNode | null>(null);
  const [middle, setMiddle] = useState<ReactNode | null>(null);
  const [end, setEnd] = useState<ReactNode | null>(null);

  const registerStart = useCallback((component: ReactNode) => {
    setStart(component);
  }, []);

  const registerMiddle = useCallback((component: ReactNode) => {
    setMiddle(component);
  }, []);

  const registerEnd = useCallback((component: ReactNode) => {
    setEnd(component);
  }, []);

  const unregisterStart = useCallback(() => {
    setStart(null);
  }, []);

  const unregisterMiddle = useCallback(() => {
    setMiddle(null);
  }, []);

  const unregisterEnd = useCallback(() => {
    setEnd(null);
  }, []);

  const stateValue: TopBarStateContextValue = useMemo(() => ({ start, middle, end }), [start, middle, end]);

  const actionsValue: TopBarActionsContextValue = useMemo(
    () => ({
      registerStart,
      registerMiddle,
      registerEnd,
      unregisterStart,
      unregisterMiddle,
      unregisterEnd,
    }),
    // All callbacks are stable (useCallback with empty deps)
    [registerStart, registerMiddle, registerEnd, unregisterStart, unregisterMiddle, unregisterEnd],
  );

  return (
    <TopBarActionsContext.Provider value={actionsValue}>
      <TopBarStateContext.Provider value={stateValue}>{children}</TopBarStateContext.Provider>
    </TopBarActionsContext.Provider>
  );
}
