import { Children, Fragment, isValidElement, ReactElement, ReactNode, useMemo } from 'react';

import type { MediaCardLogoProps, MediaCardSlotType } from '../api';

interface MediaCardChildren {
  headerChild: ReactNode | undefined;
  contentChild: ReactNode | undefined;
  footerChild: ReactNode | undefined;
  logoChild: ReactNode | undefined;
  titleChild: ReactNode | undefined;
  subtitleChild: ReactNode | undefined;
  /** True when logo uses `placement="background"`. */
  hasBackgroundLogo: boolean;
}

function isFragmentElement(child: ReactElement): boolean {
  return child.type === Fragment;
}

/**
 * Flattens children and unwraps Fragments so compound slots still resolve
 * when callers wrap them in `<>...</>` (otherwise they are unknown nodes and
 * silently dropped in production).
 */
function flattenSlotChildren(children: ReactNode): ReactNode[] {
  const result: ReactNode[] = [];

  Children.forEach(children, (child) => {
    if (isValidElement(child) && isFragmentElement(child)) {
      result.push(...flattenSlotChildren((child.props as { children?: ReactNode }).children));
      return;
    }
    result.push(child);
  });

  return result;
}

const getSlotType = (child: ReactNode): MediaCardSlotType | undefined =>
  isValidElement(child) ? (child.type as { __SLOT_TYPE?: MediaCardSlotType }).__SLOT_TYPE : undefined;

/**
 * Resolves compound slot children via `__SLOT_TYPE`. First match wins;
 * duplicates / unknown children warn in `__DEV__`.
 */
export function useMediaCardChildren(children: ReactNode): MediaCardChildren {
  return useMemo(() => {
    const childrenArray = flattenSlotChildren(children);

    const pick = (slot: MediaCardSlotType) => childrenArray.filter((child) => getSlotType(child) === slot);

    const headerMatches = pick('header');
    const contentMatches = pick('content');
    const footerMatches = pick('footer');
    const logoMatches = pick('logo');
    const titleMatches = pick('title');
    const subtitleMatches = pick('subtitle');

    if (__DEV__) {
      const warnDup = (name: string, matches: ReactNode[]) => {
        if (matches.length > 1) {
          console.warn(`EtMediaCard: Multiple EtMediaCard.${name} children detected. Only the first will be used.`);
        }
      };
      warnDup('Header', headerMatches);
      warnDup('Content', contentMatches);
      warnDup('Footer', footerMatches);
      warnDup('Logo', logoMatches);
      warnDup('Title', titleMatches);
      warnDup('Subtitle', subtitleMatches);

      const recognised = new Set<ReactNode>([
        ...headerMatches,
        ...contentMatches,
        ...footerMatches,
        ...logoMatches,
        ...titleMatches,
        ...subtitleMatches,
      ]);
      const unknown = childrenArray.filter((child) => !recognised.has(child) && child != null && typeof child !== 'boolean');
      if (unknown.length > 0) {
        console.warn(
          `EtMediaCard: ${unknown.length} unknown child${unknown.length > 1 ? 'ren were' : ' was'} dropped. ` +
            'Only EtMediaCard.{Header, Content, Footer, Logo, Title, Subtitle} are valid children.',
        );
      }
    }

    const logoChild = logoMatches[0];
    const hasBackgroundLogo = isValidElement(logoChild) && (logoChild as ReactElement<MediaCardLogoProps>).props.placement === 'background';

    return {
      headerChild: headerMatches[0],
      contentChild: contentMatches[0],
      footerChild: footerMatches[0],
      logoChild,
      titleChild: titleMatches[0],
      subtitleChild: subtitleMatches[0],
      hasBackgroundLogo,
    };
  }, [children]);
}
