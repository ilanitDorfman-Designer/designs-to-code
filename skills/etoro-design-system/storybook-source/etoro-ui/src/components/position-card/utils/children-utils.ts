import { Children, Fragment, isValidElement, ReactNode } from 'react';

/**
 * Flatten children, unwrapping React Fragments.
 * This allows components to handle Fragment-wrapped children transparently.
 */
export function flattenChildren(children: ReactNode): ReactNode[] {
  const result: ReactNode[] = [];

  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === Fragment) {
      // Recurse into fragment children
      result.push(...flattenChildren((child.props as { children: ReactNode }).children));
    } else {
      result.push(child);
    }
  });

  return result;
}

/**
 * Check if a child is an EtPositionCard.ExpandedContent component.
 * Used to identify which children need special animation treatment.
 */
export function isExpandedContent(child: ReactNode): boolean {
  return isValidElement(child) && (child.type as { displayName?: string })?.displayName === 'EtPositionCard.ExpandedContent';
}
