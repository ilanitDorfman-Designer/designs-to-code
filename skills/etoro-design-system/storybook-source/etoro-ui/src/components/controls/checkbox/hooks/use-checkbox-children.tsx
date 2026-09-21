import React, { ReactNode, useMemo } from 'react';

import { CheckboxLabelProps } from '../api/types';
import { CheckboxLabel } from '../subcomponents/checkbox-label';

/**
 * Processes checkbox children and applies disabled prop to CheckboxLabel components.
 * Handles string shorthand (wraps in CheckboxLabel) and clones CheckboxLabel elements.
 *
 * @param children - The children to process
 * @param disabled - The disabled state to pass to CheckboxLabel components
 * @returns Processed children ready for rendering
 */
export function useCheckboxChildren(children: ReactNode | undefined, disabled: boolean): ReactNode {
  return useMemo(() => {
    if (!children) return null;

    return React.Children.map(children, (child) => {
      // Handle CheckboxLabel elements - clone with disabled prop
      if (
        React.isValidElement(child) &&
        (child.type === CheckboxLabel || (child.type as { displayName?: string }).displayName === 'EtCheckbox.Label')
      ) {
        return React.cloneElement(child, {
          disabled,
        } as Partial<CheckboxLabelProps>);
      }

      // Pass through other valid React elements
      return child;
    });
  }, [children, disabled]);
}
