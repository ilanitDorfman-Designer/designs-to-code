import { Children, isValidElement, type ReactNode, useMemo } from 'react';

export interface BannerChildren {
  title: ReactNode | undefined;
  description: ReactNode | undefined;
  actions: ReactNode | undefined;
  illustration: ReactNode | undefined;
}

function getDisplayName(child: ReactNode): string | undefined {
  if (!isValidElement(child)) {
    return undefined;
  }
  return (child.type as { displayName?: string }).displayName;
}

/**
 * Separates EtBanner compound children into layout slots via displayName.
 */
export function useBannerChildren(children: ReactNode): BannerChildren {
  return useMemo(() => {
    const childrenArray = Children.toArray(children);

    const titleMatches: ReactNode[] = [];
    const descriptionMatches: ReactNode[] = [];
    const actionsMatches: ReactNode[] = [];
    const illustrationMatches: ReactNode[] = [];

    for (const child of childrenArray) {
      const name = getDisplayName(child);
      if (name === 'EtBanner.Title') {
        titleMatches.push(child);
      } else if (name === 'EtBanner.Description') {
        descriptionMatches.push(child);
      } else if (name === 'EtBanner.Actions') {
        actionsMatches.push(child);
      } else if (name === 'EtBanner.Illustration') {
        illustrationMatches.push(child);
      }
    }

    if (__DEV__) {
      if (titleMatches.length > 1) {
        console.warn('EtBanner: Multiple EtBanner.Title children detected. Only the first will be used.');
      }
      if (descriptionMatches.length > 1) {
        console.warn('EtBanner: Multiple EtBanner.Description children detected. Only the first will be used.');
      }
      if (actionsMatches.length > 1) {
        console.warn('EtBanner: Multiple EtBanner.Actions children detected. Only the first will be used.');
      }
      if (illustrationMatches.length > 1) {
        console.warn('EtBanner: Multiple EtBanner.Illustration children detected. Only the first will be used.');
      }
    }

    return {
      title: titleMatches[0],
      description: descriptionMatches[0],
      actions: actionsMatches[0],
      illustration: illustrationMatches[0],
    };
  }, [children]);
}
