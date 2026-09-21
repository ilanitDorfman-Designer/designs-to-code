import React from 'react';

/**
 * Creates a memoized component with a display name.
 *
 * This utility wraps a component with React.memo for performance optimization
 * and sets a descriptive display name for React DevTools.
 *
 * Used in the compound component pattern where:
 * - Screen is "smart" (owns facade subscription)
 * - Children are "dumb" (receive props, memoized)
 *
 * @param Component - The component to memoize
 * @param displayName - Display name for React DevTools (e.g., 'Watchlist.Header')
 * @returns Memoized component with display name
 *
 * @example
 * ```tsx
 * function WatchlistHeaderBase({ title }: WatchlistHeaderProps) {
 *   return <Text>{title}</Text>;
 * }
 *
 * export const WatchlistHeader = create(WatchlistHeaderBase, 'Watchlist.Header');
 *
 * // Export as compound component
 * export const Watchlist = {
 *   Header: create(WatchlistHeaderBase, 'Watchlist.Header'),
 *   List: create(WatchlistListBase, 'Watchlist.List'),
 * };
 * ```
 */
export const create = <Props extends object>(
  Component: React.ComponentType<Props>,
  displayName: string,
): React.MemoExoticComponent<React.ComponentType<Props>> => {
  const MemoizedComponent = React.memo(Component);
  MemoizedComponent.displayName = displayName;
  return MemoizedComponent;
};
