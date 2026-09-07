import { Children, isValidElement, ReactElement, ReactNode, useMemo } from 'react';

import { TabRoute, TabsContentProps, TabsListProps } from '../api/types';

interface ExtractedTabsChildren {
  /** Routes array for TabView navigationState */
  routes: TabRoute[];

  /** Map of route key to content ReactNode */
  sceneMap: Map<string, ReactNode>;

  /** The EtTabs.List element to render as custom tab bar */
  listElement: ReactElement<TabsListProps> | null;

  /** Find index of a value in routes */
  getIndexForValue: (value: string) => number;

  /** Find value at a given index */
  getValueForIndex: (index: number) => string;
}

/**
 * Hook to extract and process children for TabView integration
 *
 * Transforms compound component children into TabView-compatible data structures:
 * - Extracts EtTabs.Content children into routes and sceneMap
 * - Extracts EtTabs.List to render as custom tab bar
 * - Provides mapping between string values and numeric indices
 */
export function useTabsChildren(children: ReactNode): ExtractedTabsChildren {
  return useMemo(() => {
    const routes: TabRoute[] = [];
    const sceneMap = new Map<string, ReactNode>();
    let listElement: ReactElement<TabsListProps> | null = null;

    // Process children to extract routes and list
    Children.forEach(children, (child) => {
      if (!isValidElement(child)) {
        return;
      }

      const displayName = (child.type as { displayName?: string })?.displayName;

      // Extract EtTabs.List
      if (displayName === 'EtTabs.List') {
        listElement = child as ReactElement<TabsListProps>;
        return;
      }

      // Extract EtTabs.Content
      if (displayName === 'EtTabs.Content') {
        const contentProps = child.props as TabsContentProps;
        const { value, children: contentChildren } = contentProps;

        // Add to routes
        routes.push({ key: value });

        // Add to scene map
        sceneMap.set(value, contentChildren);
      }
    });

    // Helper to find index for a value
    const getIndexForValue = (value: string): number => {
      const index = routes.findIndex((route) => route.key === value);
      return index >= 0 ? index : 0;
    };

    // Helper to find value for an index
    const getValueForIndex = (index: number): string => {
      return routes[index]?.key ?? routes[0]?.key ?? '';
    };

    return {
      routes,
      sceneMap,
      listElement,
      getIndexForValue,
      getValueForIndex,
    };
  }, [children]);
}
