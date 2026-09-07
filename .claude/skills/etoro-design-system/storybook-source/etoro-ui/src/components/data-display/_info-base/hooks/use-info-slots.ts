import { Children, isValidElement, ReactNode, useMemo } from 'react';

import type { InfoDisplayNames, InfoSlots } from '../types';

function getDisplayName(child: ReactNode): string | undefined {
  if (!isValidElement(child)) return undefined;
  return (child.type as { displayName?: string })?.displayName;
}

/**
 * Splits info children into slots by displayName.
 * Used by the root to render Avatar → Content (Title ± Subtitle).
 *
 * @param children - Compound children (Avatar, Title, Subtitle)
 * @param displayNames - Display names to match for each slot
 */
export function useInfoSlots(children: ReactNode, displayNames: InfoDisplayNames): InfoSlots {
  return useMemo(() => {
    let avatar: ReactNode = null;
    let title: ReactNode = null;
    let subtitle: ReactNode = null;

    Children.forEach(children, (child) => {
      const name = getDisplayName(child);
      if (name === displayNames.avatar) avatar = child;
      else if (name === displayNames.title) title = child;
      else if (name === displayNames.subtitle) subtitle = child;
    });

    return {
      avatar,
      title,
      subtitle,
    };
  }, [children, displayNames.avatar, displayNames.title, displayNames.subtitle]);
}
