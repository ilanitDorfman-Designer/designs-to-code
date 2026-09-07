import { Children, isValidElement, ReactElement, ReactNode, useMemo } from 'react';

import { SplitLayoutAside, SplitLayoutMain, SplitLayoutTopBar } from '../subcomponents';

interface SplitLayoutChildren {
  topBar?: ReactNode;
  main?: ReactNode;
  aside?: ReactNode;
}

function getDisplayName(type: ReactElement['type']): string | undefined {
  return typeof type === 'string' ? undefined : (type as { displayName?: string }).displayName;
}

function isSlot(child: ReactElement, component: unknown, displayName: string): boolean {
  return child.type === component || getDisplayName(child.type) === displayName;
}

/**
 * Separates compound children into their render locations: the TopBar must
 * render INSIDE the main pane (so its absolute overlay spans that pane only,
 * never the aside), so the root cannot render children positionally.
 */
export function useSplitLayoutChildren(children: ReactNode): SplitLayoutChildren {
  return useMemo(() => {
    const separated: SplitLayoutChildren = {};

    Children.forEach(children, (child) => {
      if (!isValidElement(child)) return;

      if (isSlot(child, SplitLayoutTopBar, 'EtSplitLayout.TopBar')) {
        separated.topBar = child;
      } else if (isSlot(child, SplitLayoutMain, 'EtSplitLayout.Main')) {
        separated.main = child;
      } else if (isSlot(child, SplitLayoutAside, 'EtSplitLayout.Aside')) {
        separated.aside = child;
      } else if (__DEV__) {
        console.warn('EtSplitLayout: unrecognized child ignored — use EtSplitLayout.Main / EtSplitLayout.Aside / EtSplitLayout.TopBar.');
      }
    });

    return separated;
  }, [children]);
}
