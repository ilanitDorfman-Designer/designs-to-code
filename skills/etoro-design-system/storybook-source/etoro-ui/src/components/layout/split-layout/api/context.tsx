import { createContext, ReactNode, useContext, useMemo } from 'react';

import { SplitLayoutContextValue } from './types';

const SplitLayoutContext = createContext<SplitLayoutContextValue | null>(null);

interface SplitLayoutActions {
  setTopBarHeight: (height: number) => void;
}

const SplitLayoutActionsContext = createContext<SplitLayoutActions | null>(null);

/**
 * Read the split layout's mode and metrics.
 * Must be used within an EtSplitLayout component.
 *
 * @throws Error if used outside of EtSplitLayout
 */
export function useSplitLayoutContext(): SplitLayoutContextValue {
  const context = useContext(SplitLayoutContext);
  if (!context) {
    throw new Error('useSplitLayoutContext must be used within an EtSplitLayout component.');
  }
  return context;
}

/**
 * Internal — actions for subcomponents (separate context so the TopBar does
 * not re-render when layout values change).
 *
 * @throws Error if used outside of EtSplitLayout
 */
export function useSplitLayoutActions(): SplitLayoutActions {
  const context = useContext(SplitLayoutActionsContext);
  if (!context) {
    throw new Error('EtSplitLayout subcomponents must be rendered inside <EtSplitLayout>.');
  }
  return context;
}

interface SplitLayoutProviderProps extends SplitLayoutContextValue, SplitLayoutActions {
  children: ReactNode;
}

/**
 * Provider component that shares layout mode and metrics with subcomponents.
 */
export function SplitLayoutProvider({ isSplit, ratio, asidePosition, topBarHeight, setTopBarHeight, children }: SplitLayoutProviderProps) {
  const value: SplitLayoutContextValue = useMemo(
    () => ({ isSplit, ratio, asidePosition, topBarHeight }),
    [isSplit, ratio, asidePosition, topBarHeight],
  );
  const actions: SplitLayoutActions = useMemo(() => ({ setTopBarHeight }), [setTopBarHeight]);

  return (
    <SplitLayoutActionsContext.Provider value={actions}>
      <SplitLayoutContext.Provider value={value}>{children}</SplitLayoutContext.Provider>
    </SplitLayoutActionsContext.Provider>
  );
}
