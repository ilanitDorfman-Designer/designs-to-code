export { EtTabs } from './et-tabs';

// Export hook for advanced usage (custom components accessing tabs state)
export { useTabsContext } from './context';

// Export all types
export type {
  // Main component props
  EtTabsProps,
  // Internal types
  TabRoute,
  TabsActions,
  TabsContentProps,
  // Context types for dependency injection
  TabsContextValue,
  TabsIndicatorProps,
  // Subcomponent props
  TabsListProps,
  // Variants
  TabsListVariant,
  TabsMeta,
  TabsProviderProps,
  TabsRootProps,
  TabsState,
  TabsTriggerProps,
  TriggerLayout,
} from './api';
