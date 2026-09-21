import React, { Children, isValidElement, ReactNode, useMemo } from 'react';

import { BadgeSize } from '../api/types';

interface InjectedBadgeProps {
  /** Text color for label and icon subcomponents */
  textColor: string;
  /** Badge size, drives label typography and icon sizing */
  size: BadgeSize;
}

/**
 * Injects badge props into compound children.
 * Only injects textColor into BadgeLabel and BadgeIcon (identified by displayName).
 * Other elements are passed through unchanged.
 *
 * @param children - Badge children (EtBadge.Label, EtBadge.Icon)
 * @param props - Props to inject into each child
 * @returns Children with injected props
 */
export function useComponentChildren(children: ReactNode, props: InjectedBadgeProps): ReactNode {
  return useMemo(() => {
    return Children.map(children, (child) => {
      if (!isValidElement(child)) {
        return child;
      }

      const displayName = (child.type as { displayName?: string }).displayName;
      if (displayName === 'EtBadge.Label' || displayName === 'EtBadge.Icon') {
        return React.cloneElement(child, props);
      }

      return child;
    });
  }, [children, props]);
}
