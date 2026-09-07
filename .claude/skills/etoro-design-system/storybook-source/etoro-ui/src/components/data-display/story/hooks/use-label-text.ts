import React, { Children, isValidElement, ReactNode, useMemo } from 'react';

import { StoryLabel } from '../subcomponents/story-label';

/**
 * Validates EtStory children and extracts label text for accessibility.
 *
 * @param children - EtStory children (must be EtStory.Label)
 * @returns Label text if string, null otherwise
 * @throws Error if no children, invalid children, or no EtStory.Label found
 */
export function useLabelText(children: ReactNode): string | null {
  return useMemo(() => {
    const childArray = Children.toArray(children);

    // Children are required
    if (childArray.length === 0) {
      throw new Error('EtStory: Children are required. Use <EtStory.Label> to provide a label.');
    }

    let labelText: string | null = null;
    let foundLabel = false;

    childArray.forEach((child) => {
      // Allow EtStory.Label only
      if (
        isValidElement<{ children?: ReactNode }>(child) &&
        (child.type === StoryLabel || (child.type as React.ComponentType).displayName === 'EtStory.Label')
      ) {
        // Enforce single label
        if (foundLabel) {
          throw new Error('EtStory: Multiple <EtStory.Label> children found. Only one is allowed.');
        }
        foundLabel = true;
        const labelChildren = child.props.children;
        if (typeof labelChildren === 'string') {
          labelText = labelChildren;
        }
        return;
      }

      // Reject any other children
      throw new Error('EtStory: Invalid child passed. Only <EtStory.Label> is a valid child.');
    });

    return labelText;
  }, [children]);
}
