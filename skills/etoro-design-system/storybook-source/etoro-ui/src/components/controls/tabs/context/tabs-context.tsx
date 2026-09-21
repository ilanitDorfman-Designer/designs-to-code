import { createContext, use } from 'react';

import { TabsContextValue } from '../api/types';

/**
 * Context for sharing Tabs state with subcomponents
 * Uses state/actions/meta pattern for dependency injection
 */
export const TabsContext = createContext<TabsContextValue | null>(null);

/**
 * Hook to access Tabs context from subcomponents
 * Uses React 19's use() instead of useContext()
 *
 * @throws Error if used outside of EtTabs
 */
export function useTabsContext(): TabsContextValue {
  const context = use(TabsContext);
  if (!context) {
    throw new Error('EtTabs compound components must be used within an EtTabs component');
  }
  return context;
}
