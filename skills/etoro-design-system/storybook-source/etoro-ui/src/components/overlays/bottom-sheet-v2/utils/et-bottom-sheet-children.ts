import { Children, ComponentType, ExoticComponent, isValidElement, ReactElement, ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

import {
  EtBottomSheetContent,
  EtBottomSheetFlashList,
  EtBottomSheetFooter,
  EtBottomSheetHeader,
  EtBottomSheetList,
  EtBottomSheetSectionList,
} from '../subcomponents';

/**
 * Props interface for virtualized list components that support contentContainerStyle.
 * Used for type-safe footer spacer injection.
 */
export interface VirtualizedListProps {
  contentContainerStyle?: StyleProp<ViewStyle>;
}

/**
 * Type for React component references used in type comparison.
 * We use a permissive type since we only compare child.type === component,
 * not actually rendering or calling these components.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ComponentReference = ComponentType<any> | ExoticComponent<any>;

/**
 * Checks if a child is a specific subcomponent type by comparing
 * the component reference directly.
 *
 * Note: We only use direct type comparison (not displayName) because
 * displayName can be stripped by minifiers in production builds.
 */
function isSubcomponent(child: ReactNode, component: ComponentReference): boolean {
  if (!isValidElement(child)) return false;
  return child.type === component;
}

/**
 * Type guard to check if a ReactNode is a virtualized list element.
 * Returns true for List, SectionList, or FlashList components.
 */
export function isVirtualizedListElement(child: ReactNode): child is ReactElement<VirtualizedListProps> {
  return (
    isValidElement(child) && (child.type === EtBottomSheetList || child.type === EtBottomSheetSectionList || child.type === EtBottomSheetFlashList)
  );
}

/**
 * Result of parsing EtBottomSheet children into separate sections.
 */
export interface ParseBottomSheetChildrenResult {
  /** The Header subcomponent if present */
  headerChild: ReactNode | undefined;
  /** The Content subcomponent if present (Content, List, SectionList, or FlashList) */
  contentChild: ReactNode | undefined;
  /** The Footer subcomponent if present */
  footerChild: ReactNode | undefined;
  /** Whether the content is scrollable (from Content's scrollable prop) */
  isScrollable: boolean;
  /** Whether the content is a virtualized list (List, SectionList, or FlashList) */
  isVirtualizedList: boolean;
  /** Whether to show the vertical scroll indicator on the scroll container. Always false by app convention. */
  showsVerticalScrollIndicator: boolean;
  /** Title extracted from Header.Title (for accessibility announcements) */
  headerTitle: string | undefined;
}

function isHeaderComponent(child: ReactNode): boolean {
  return isSubcomponent(child, EtBottomSheetHeader);
}

function isContentComponent(child: ReactNode): boolean {
  return (
    isSubcomponent(child, EtBottomSheetContent) ||
    isSubcomponent(child, EtBottomSheetList) ||
    isSubcomponent(child, EtBottomSheetSectionList) ||
    isSubcomponent(child, EtBottomSheetFlashList)
  );
}

function isVirtualizedListComponent(child: ReactNode): boolean {
  return isSubcomponent(child, EtBottomSheetList) || isSubcomponent(child, EtBottomSheetSectionList) || isSubcomponent(child, EtBottomSheetFlashList);
}

function isFooterComponent(child: ReactNode): boolean {
  return isSubcomponent(child, EtBottomSheetFooter);
}

/**
 * Extracts the title string from a Header element's children by looking for
 * a Header.Title subcomponent with string children.
 */
function extractHeaderTitle(headerChild: ReactNode): string | undefined {
  if (!isValidElement(headerChild)) return undefined;

  const headerChildren = Children.toArray((headerChild.props as { children?: ReactNode }).children);

  for (const child of headerChildren) {
    if (isValidElement(child) && child.type === EtBottomSheetHeader.Title) {
      const titleChildren = (child.props as { children?: ReactNode }).children;
      if (typeof titleChildren === 'string') {
        return titleChildren;
      }
    }
  }

  return undefined;
}

/**
 * Parses and validates EtBottomSheet children into header, content, and footer sections.
 *
 * This is a pure utility function (not a hook) that separates compound component children.
 * Validates that only one of each subcomponent type is present.
 *
 * **Error handling:**
 * - Uses `console.error` (not throw) to match React patterns - allows partial rendering
 * - In development: Also logs stack trace via `console.trace` for easier debugging
 * - Warns if sheet has no content (dev only)
 *
 * @param children - The children passed to EtBottomSheet
 * @returns Object containing separated header, content, and footer children
 */
export function parseBottomSheetChildren(children: ReactNode): ParseBottomSheetChildrenResult {
  const childArray = Children.toArray(children);

  let headerChild: ReactNode | undefined;
  let contentChild: ReactNode | undefined;
  let footerChild: ReactNode | undefined;
  let headerCount = 0;
  let contentCount = 0;
  let footerCount = 0;

  for (const child of childArray) {
    if (isHeaderComponent(child)) {
      headerCount++;
      if (!headerChild) headerChild = child;
    } else if (isContentComponent(child)) {
      contentCount++;
      if (!contentChild) contentChild = child;
    } else if (isFooterComponent(child)) {
      footerCount++;
      if (!footerChild) footerChild = child;
    }
  }

  if (__DEV__) {
    if (headerCount > 1) {
      console.error('EtBottomSheet: Only one Header component is allowed. Using first, ignoring duplicates.');
      console.trace('Component stack:');
    }
    if (contentCount > 1) {
      console.error('EtBottomSheet: Only one Content component is allowed. Using first, ignoring duplicates.');
      console.trace('Component stack:');
    }
    if (footerCount > 1) {
      console.error('EtBottomSheet: Only one Footer component is allowed. Using first, ignoring duplicates.');
      console.trace('Component stack:');
    }
    if (!headerChild && !contentChild && !footerChild) {
      console.warn('EtBottomSheet: No Header, Content, or Footer provided. ' + 'The sheet will render empty. Did you forget to add children?');
    }
  }

  const isVirtualizedList = isValidElement(contentChild) && isVirtualizedListComponent(contentChild);

  const isScrollable = !isVirtualizedList && isValidElement(contentChild) && (contentChild.props as { scrollable?: boolean })?.scrollable === true;

  const showsVerticalScrollIndicator = false;

  const headerTitle = extractHeaderTitle(headerChild);

  return {
    headerChild,
    contentChild,
    footerChild,
    isScrollable,
    isVirtualizedList,
    showsVerticalScrollIndicator,
    headerTitle,
  };
}
