import { useCallback } from 'react';
import { ActivityIndicator, StyleSheet, useWindowDimensions, View } from 'react-native';
import { TabView } from 'react-native-tab-view';

import { TabsRootProps } from '../api/types';
import { useTabsContext } from '../context';
import { useTabsChildren } from '../hooks';

/**
 * Default lazy placeholder component
 */
function DefaultLazyPlaceholder() {
  return (
    <View style={styles.lazyPlaceholder}>
      <ActivityIndicator />
    </View>
  );
}

/**
 * TabsRoot - Container for TabView that reads state from context
 *
 * Additional props are spread to the underlying TabView.
 * This component contains the TabView logic but does NOT manage state.
 * State is provided via context from TabsProvider.
 *
 * Must be used within an EtTabs.Provider.
 *
 * @example
 * ```tsx
 * <EtTabs.Provider defaultValue="overview">
 *   <EtTabs.Root>
 *     <EtTabs.List>
 *       <EtTabs.Trigger value="overview">Overview</EtTabs.Trigger>
 *     </EtTabs.List>
 *     <EtTabs.Content value="overview">...</EtTabs.Content>
 *   </EtTabs.Root>
 * </EtTabs.Provider>
 * ```
 *
 * @example With container style and TabView props
 * ```tsx
 * <EtTabs.Root
 *   containerStyle={{ backgroundColor: 'white' }}
 *   onSwipeStart={() => console.log('swipe started')}
 * >
 *   ...
 * </EtTabs.Root>
 * ```
 */
export function TabsRoot({
  children,
  containerStyle,
  testID,
  // Destructure renderLazyPlaceholder to wrap it, spread rest to TabView
  renderLazyPlaceholder,
  // Default lazy to true (react-native-tab-view defaults to false)
  lazy = true,
  ...tabViewProps
}: TabsRootProps) {
  const layout = useWindowDimensions();
  const { state, actions } = useTabsContext();

  // Extract routes and scene map from children
  const { routes, sceneMap, listElement, getIndexForValue, getValueForIndex } = useTabsChildren(children);

  // Convert active value to index for TabView
  const currentIndex = getIndexForValue(state.activeValue);

  // Handle index change from TabView (swipe or programmatic)
  const handleIndexChange = useCallback(
    (index: number) => {
      const newValue = getValueForIndex(index);
      actions.setActiveValue(newValue);
    },
    [getValueForIndex, actions],
  );

  // Render scene for TabView
  const renderScene = useCallback(
    ({ route }: { route: { key: string } }) => {
      const content = sceneMap.get(route.key);
      return <View style={styles.scene}>{content}</View>;
    },
    [sceneMap],
  );

  // Custom tab bar that renders our EtTabs.List
  const renderTabBar = useCallback(() => {
    return <>{listElement}</>;
  }, [listElement]);

  // Lazy placeholder - receives route from TabView
  const lazyPlaceholderComponent = useCallback(
    (props: { route: { key: string } }) => {
      if (renderLazyPlaceholder) {
        return <>{renderLazyPlaceholder(props)}</>;
      }
      return <DefaultLazyPlaceholder />;
    },
    [renderLazyPlaceholder],
  );

  // If no routes, render nothing
  if (routes.length === 0) {
    return null;
  }

  return (
    <View style={[styles.container, containerStyle]} testID={testID}>
      <TabView
        navigationState={{ index: currentIndex, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={handleIndexChange}
        initialLayout={{ width: layout.width }}
        renderLazyPlaceholder={lazyPlaceholderComponent}
        lazy={lazy}
        {...tabViewProps}
      />
    </View>
  );
}

TabsRoot.displayName = 'EtTabs.Root';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scene: {
    flex: 1,
  },
  lazyPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
