import { StyleSheet, View } from 'react-native';

import { TabsContentProps } from '../api/types';

/**
 * TabsContent - Content panel for a tab
 *
 * Extends ViewProps for full extensibility.
 * This is a "marker" component used to define tab content.
 * The actual rendering is handled by TabView in the parent EtTabs component.
 *
 * The children of this component are extracted by useTabsChildren hook
 * and rendered through TabView's renderScene.
 *
 * Note: forceMount prop is deprecated as TabView handles lazy loading
 * through the `lazy` and `lazyPreloadDistance` props on EtTabs.
 *
 * @example
 * ```tsx
 * <EtTabs.Content value="overview">
 *   <View style={{ flex: 1 }}>
 *     <Text>Overview content here</Text>
 *   </View>
 * </EtTabs.Content>
 * ```
 *
 * @example With additional View props
 * ```tsx
 * <EtTabs.Content
 *   value="overview"
 *   onLayout={handleLayout}
 *   accessibilityLabel="Overview tab content"
 * >
 *   <Text>Content</Text>
 * </EtTabs.Content>
 * ```
 */
export function TabsContent({ children, value: _value, forceMount: _forceMount, style, ...viewProps }: TabsContentProps) {
  // This component's children are extracted and rendered by TabView.
  // This render path is only used if TabsContent is rendered directly
  // (which shouldn't happen in normal usage).
  // value and forceMount are used by useTabsChildren, not passed to View.
  return (
    <View style={[styles.content, style]} accessible accessibilityLabel="Tab content" {...viewProps}>
      {children}
    </View>
  );
}

TabsContent.displayName = 'EtTabs.Content';

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
});
