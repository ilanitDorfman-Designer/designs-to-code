import { Children, cloneElement, isValidElement, ReactElement, ReactNode, useMemo } from 'react';

import type { EtSwipeableActionInternalProps, EtSwipeableActionProps } from '../api/types';
import { SwipeableAction } from '../subcomponents/swipeable-action';

interface SwipeableRowChildren {
  /** Action elements cloned with internal `_index` and `_actionsCount` props. */
  actionElements: ReactElement<EtSwipeableActionProps & EtSwipeableActionInternalProps>[];
  /** Non-action children, rendered inside the sliding content wrapper. */
  contentChildren: ReactNode[];
  /** Per-action declared widths (used by `useTotalSwipeWidth` to size the actions container). */
  actionWidths: Array<{ width?: number }>;
}

function isActionElement(child: ReactNode): child is ReactElement<EtSwipeableActionProps> {
  if (isValidElement(child)) {
    return child.type === SwipeableAction;
  }
  return false;
}

/**
 * Separates EtSwipeableRow.Action children from content children.
 *
 * Each action element is cloned with two internal props the action subcomponent needs:
 * - `_index`: 0-based position of this action among siblings
 * - `_actionsCount`: total number of action siblings (used to identify the LAST action,
 *   which is the auto-triggered "full-swipe" target)
 *
 * Also extracts each action's declared width for swipe-distance calculations upstream.
 */
export function useSwipeableRowChildren(children: ReactNode): SwipeableRowChildren {
  return useMemo(() => {
    const childrenArray = Children.toArray(children);

    const rawActions: ReactElement<EtSwipeableActionProps>[] = [];
    const contentChildren: ReactNode[] = [];

    childrenArray.forEach((child) => {
      if (isActionElement(child)) {
        rawActions.push(child);
      } else {
        contentChildren.push(child);
      }
    });

    const actionsCount = rawActions.length;
    const actionWidths = rawActions.map((el) => ({ width: el.props.width }));

    const actionElements = rawActions.map((el, index) =>
      cloneElement<EtSwipeableActionProps & EtSwipeableActionInternalProps>(el, {
        _index: index,
        _actionsCount: actionsCount,
      }),
    );

    return { actionElements, contentChildren, actionWidths };
  }, [children]);
}
