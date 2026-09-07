import { Children, isValidElement, ReactNode } from 'react';

import { EtModalContent, EtModalFooter, EtModalHeader } from '../subcomponents';

/**
 * Result of parsing EtModal children into separate sections.
 */
export interface ParseModalChildrenResult {
  /** The Header subcomponent if present */
  headerChild: ReactNode | undefined;
  /** The Content subcomponent if present */
  contentChild: ReactNode | undefined;
  /** The Footer subcomponent if present */
  footerChild: ReactNode | undefined;
  /** Title extracted from Header.Title (for accessibility announcements) */
  headerTitle: string | undefined;
}

function isHeaderComponent(child: ReactNode): boolean {
  return isValidElement(child) && child.type === EtModalHeader;
}

function isContentComponent(child: ReactNode): boolean {
  return isValidElement(child) && child.type === EtModalContent;
}

function isFooterComponent(child: ReactNode): boolean {
  return isValidElement(child) && child.type === EtModalFooter;
}

/**
 * Extracts the title string from a Header element's children.
 */
function extractHeaderTitle(headerChild: ReactNode): string | undefined {
  if (!isValidElement(headerChild)) return undefined;

  const headerChildren = Children.toArray((headerChild.props as { children?: ReactNode }).children);

  for (const child of headerChildren) {
    if (isValidElement(child) && (child.type as { displayName?: string }).displayName === 'EtModal.Header.Title') {
      const titleChildren = (child.props as { children?: ReactNode }).children;
      if (typeof titleChildren === 'string') {
        return titleChildren;
      }
    }
  }

  return undefined;
}

/**
 * Parses EtModal children into header, content, and footer sections.
 */
export function parseModalChildren(children: ReactNode): ParseModalChildrenResult {
  const childArray = Children.toArray(children);

  let headerChild: ReactNode | undefined;
  let contentChild: ReactNode | undefined;
  let footerChild: ReactNode | undefined;

  for (const child of childArray) {
    if (isHeaderComponent(child)) {
      if (headerChild && __DEV__) {
        console.warn('[EtModal] Duplicate EtModal.Header detected. Only the first Header will be rendered.');
      }
      if (!headerChild) headerChild = child;
    } else if (isContentComponent(child)) {
      if (contentChild && __DEV__) {
        console.warn('[EtModal] Duplicate EtModal.Content detected. Only the first Content will be rendered.');
      }
      if (!contentChild) contentChild = child;
    } else if (isFooterComponent(child)) {
      if (footerChild && __DEV__) {
        console.warn('[EtModal] Duplicate EtModal.Footer detected. Only the first Footer will be rendered.');
      }
      if (!footerChild) footerChild = child;
    }
  }

  const headerTitle = extractHeaderTitle(headerChild);

  return {
    headerChild,
    contentChild,
    footerChild,
    headerTitle,
  };
}
