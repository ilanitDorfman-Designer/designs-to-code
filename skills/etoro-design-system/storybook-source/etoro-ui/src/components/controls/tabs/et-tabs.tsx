import { EtTabsProps } from './api';
import { TabsContent, TabsIndicator, TabsList, TabsProvider, TabsRoot, TabsTrigger } from './subcomponents';

/**
 * EtTabs - A compound component for full-page swipeable tabbed interfaces
 *
 * Uses react-native-tab-view internally for native swipe gestures.
 * Supports both controlled and uncontrolled modes.
 *
 * This is a convenience wrapper that composes Provider + Root.
 * For advanced usage (dependency injection, external state access),
 * use EtTabs.Provider and EtTabs.Root separately.
 *
 * @example Basic usage (uncontrolled)
 * ```tsx
 * <EtTabs defaultValue="overview">
 *   <EtTabs.List>
 *     <EtTabs.Trigger value="overview">Overview</EtTabs.Trigger>
 *     <EtTabs.Trigger value="analytics">Analytics</EtTabs.Trigger>
 *     <EtTabs.Trigger value="reports">Reports</EtTabs.Trigger>
 *   </EtTabs.List>
 *   <EtTabs.Content value="overview">
 *     <OverviewContent />
 *   </EtTabs.Content>
 *   <EtTabs.Content value="analytics">
 *     <AnalyticsContent />
 *   </EtTabs.Content>
 *   <EtTabs.Content value="reports">
 *     <ReportsContent />
 *   </EtTabs.Content>
 * </EtTabs>
 * ```
 *
 * @example Controlled usage
 * ```tsx
 * const [activeTab, setActiveTab] = useState('overview');
 *
 * <EtTabs value={activeTab} onValueChange={setActiveTab}>
 *   <EtTabs.List>
 *     <EtTabs.Trigger value="overview">Overview</EtTabs.Trigger>
 *   </EtTabs.List>
 *   <EtTabs.Content value="overview">Content here</EtTabs.Content>
 * </EtTabs>
 * ```
 *
 * @example Advanced usage with external state access
 * ```tsx
 * <EtTabs.Provider defaultValue="overview">
 *   <EtTabs.Root>
 *     <EtTabs.List>
 *       <EtTabs.Trigger value="overview">Overview</EtTabs.Trigger>
 *     </EtTabs.List>
 *     <EtTabs.Content value="overview">Content</EtTabs.Content>
 *   </EtTabs.Root>
 *   <TabProgressIndicator />
 * </EtTabs.Provider>
 * ```
 *
 * @example Disable swipe gestures
 * ```tsx
 * <EtTabs defaultValue="tab1" swipeEnabled={false}>
 *   ...
 * </EtTabs>
 * ```
 */
function EtTabsBase({
  children,
  // Provider props
  defaultValue,
  value,
  onValueChange,
  animationDuration,
  // Root props (spread to TabsRoot -> TabView)
  ...rootProps
}: EtTabsProps) {
  return (
    <TabsProvider defaultValue={defaultValue} value={value} onValueChange={onValueChange} animationDuration={animationDuration}>
      <TabsRoot {...rootProps}>{children}</TabsRoot>
    </TabsProvider>
  );
}

EtTabsBase.displayName = 'EtTabs';

/**
 * Export with compound components attached
 */
export const EtTabs = Object.assign(EtTabsBase, {
  Provider: TabsProvider,
  Root: TabsRoot,
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
  Indicator: TabsIndicator,
});
