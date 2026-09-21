import { useEffect, useMemo } from 'react';

import { TabsProviderProps } from '../api/types';
import { TabsContext } from '../context';
import { useTabIndicator, useTabsState } from '../hooks';

/**
 * TabsProvider - Context provider for tabs state management
 *
 * This is the only component that knows how state is managed.
 * UI components consume the context interface without knowing
 * the implementation details.
 *
 * Supports both controlled and uncontrolled modes.
 *
 * @example Uncontrolled usage
 * ```tsx
 * <EtTabs.Provider defaultValue="overview">
 *   <EtTabs.Root>
 *     <EtTabs.List>...</EtTabs.List>
 *     <EtTabs.Content value="overview">...</EtTabs.Content>
 *   </EtTabs.Root>
 *   <MyCustomTabIndicator />
 * </EtTabs.Provider>
 * ```
 *
 * @example Controlled usage
 * ```tsx
 * const [activeTab, setActiveTab] = useState('overview');
 * <EtTabs.Provider value={activeTab} onValueChange={setActiveTab}>
 *   ...
 * </EtTabs.Provider>
 * ```
 */
export function TabsProvider({ children, defaultValue = '', value, onValueChange, animationDuration }: TabsProviderProps) {
  // Get state management (controlled/uncontrolled)
  const { state, actions } = useTabsState({
    defaultValue,
    value,
    onValueChange,
  });

  // Get indicator animation helpers
  const { meta } = useTabIndicator({
    activeValue: state.activeValue,
    animationDuration,
  });

  // Update indicator position when active value changes
  useEffect(() => {
    meta.animateToValue(state.activeValue);
  }, [state.activeValue, meta]);

  // Create context value
  const contextValue = useMemo(
    () => ({
      state,
      actions,
      meta,
    }),
    [state, actions, meta],
  );

  return <TabsContext.Provider value={contextValue}>{children}</TabsContext.Provider>;
}

TabsProvider.displayName = 'EtTabs.Provider';
