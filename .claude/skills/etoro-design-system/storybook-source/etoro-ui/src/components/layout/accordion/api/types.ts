import { ReactElement, ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

import { EtTextProps } from '../../../../foundations/text/api/types';

/**
 * Type for children that must be EtText components.
 * Used by EtAccordion.Header and EtAccordion.Content.
 */
export type EtTextChildren = ReactElement<EtTextProps> | ReactElement<EtTextProps>[];

/**
 * Props for EtAccordion.Item component
 */
export interface EtAccordionItemProps {
  /**
   * Unique identifier for this accordion item
   */
  id: string;

  /**
   * Item content (EtAccordion.Header and EtAccordion.Content)
   */
  children: ReactNode;

  /**
   * Whether this item is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Custom style for the item container
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Test ID for testing
   */
  testID?: string;
}

/**
 * Props for EtAccordion.Header component
 */
export interface EtAccordionHeaderProps {
  /**
   * Header content - must be EtText component(s) only.
   * This constraint ensures consistent typography and styling.
   *
   * @example
   * ```tsx
   * <EtAccordion.Header>
   *   <EtText variant="body-base-semibold">Question text</EtText>
   * </EtAccordion.Header>
   * ```
   */
  children: EtTextChildren;

  /**
   * Custom style for the header container
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Whether to show the chevron icon
   * @default true
   */
  showChevron?: boolean;

  /**
   * Test ID for testing
   */
  testID?: string;
}

/**
 * Props for EtAccordion.Content component
 */
export interface EtAccordionContentProps {
  /**
   * Content to show when expanded - must be EtText component(s) only.
   * This constraint ensures consistent typography and styling.
   *
   * @example
   * ```tsx
   * <EtAccordion.Content>
   *   <EtText variant="body-base-regular">Answer text</EtText>
   * </EtAccordion.Content>
   * ```
   */
  children: EtTextChildren;

  /**
   * Custom style for the content container
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Test ID for testing
   */
  testID?: string;
}

/**
 * Props for the main EtAccordion component
 *
 * @example
 * <EtAccordion defaultExpandedIds={['faq-1']} allowMultiple>
 *   <EtAccordion.Item id="faq-1">
 *     <EtAccordion.Header>Question 1</EtAccordion.Header>
 *     <EtAccordion.Content>Answer 1</EtAccordion.Content>
 *   </EtAccordion.Item>
 * </EtAccordion>
 *
 * @example
 * const handleExpandedChange = (ids: string[]) => setExpandedIds(ids);
 * <EtAccordion expandedIds={expandedIds} onExpandedChange={handleExpandedChange}>
 *   ...
 * </EtAccordion>
 */
export interface EtAccordionProps {
  /**
   * Accordion items (EtAccordion.Item components)
   */
  children: ReactNode;

  /**
   * Allow multiple items to be expanded simultaneously
   * @default false
   */
  allowMultiple?: boolean;

  /**
   * IDs of items that should be expanded by default
   */
  defaultExpandedIds?: string[];

  /**
   * Controlled expanded state - array of expanded item IDs
   */
  expandedIds?: string[];

  /**
   * Callback when expanded items change
   */
  onExpandedChange?: (ids: string[]) => void;

  /**
   * Custom style for the accordion container
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Test ID for testing
   */
  testID?: string;
}
