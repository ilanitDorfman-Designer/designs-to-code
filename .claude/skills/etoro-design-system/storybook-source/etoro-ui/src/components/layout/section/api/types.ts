import { ReactNode } from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';

import { EtChipsGroupV2Props } from '../../../controls/chips-group-v2/api';
import { EtPaginationProps } from '../../../navigation/pagination/api';

// =============================================================================
// Subcomponent Props
// =============================================================================

/**
 * Props for SectionTitle subcomponent
 */
export interface SectionTitleProps {
  /** Title text content */
  children: ReactNode;
  /** Custom text style */
  style?: StyleProp<TextStyle>;
  /** Test ID */
  testID?: string;
}

/**
 * Props for SectionSelectTitle subcomponent
 * Uses EtSelect compact variant internally for pressable title with chevron
 */
export interface SectionSelectTitleProps {
  /** Title text */
  text: string;
  /** Callback when title is pressed */
  onPress: () => void;
  /** Enable haptic feedback - default: true */
  haptics?: boolean;
  /** Custom container style */
  style?: StyleProp<ViewStyle>;
  /** Accessibility label */
  accessibilityLabel?: string;
  /** Accessibility hint */
  accessibilityHint?: string;
  /** Test ID */
  testID?: string;
}

/**
 * Props for SectionChips subcomponent
 * Wraps EtChipsGroupV2 with consistent section styling
 */
export type SectionChipsProps = EtChipsGroupV2Props;

/**
 * Props for SectionPagination subcomponent
 * Wraps EtPagination with section defaults (size="small", color="neutral")
 */
export type SectionPaginationProps = EtPaginationProps;

/**
 * Props for SectionContent subcomponent
 */
export interface SectionContentProps {
  /** Content to render */
  children: ReactNode;
  /** Custom container style */
  style?: StyleProp<ViewStyle>;
  /** Test ID */
  testID?: string;
}

// =============================================================================
// Main Component Types
// =============================================================================

/**
 * Valid children for EtSection compound component
 * Uses ReactNode for flexibility - allows any valid React children
 */
export type EtSectionChildren = ReactNode;

/**
 * Props for EtSection component
 *
 * A flexible section container with title and content areas.
 * Supports static title, pressable select title, and flexible content.
 *
 * @example Basic usage with compound children
 * ```tsx
 * <EtSection>
 *   <EtSection.Title>My Watchlist</EtSection.Title>
 *   <EtSection.Chips
 *     items={chips}
 *     selectionMode="single"
 *     value={selected}
 *     onChange={setSelected}
 *   />
 * </EtSection>
 * ```
 *
 * @example With select title (pressable with chevron)
 * ```tsx
 * <EtSection>
 *   <EtSection.SelectTitle text="Selected Option" onPress={openPicker} />
 *   <EtSection.Chips items={chips} ... />
 * </EtSection>
 * ```
 *
 * @example With custom content
 * ```tsx
 * <EtSection>
 *   <EtSection.Title>Settings</EtSection.Title>
 *   <EtSection.Content>
 *     {customContent}
 *   </EtSection.Content>
 * </EtSection>
 * ```
 *
 * @example Shorthand with title prop
 * ```tsx
 * <EtSection title="Quick Section">
 *   {anyContent}
 * </EtSection>
 * ```
 */
export interface EtSectionProps {
  // State (required)
  /** Section children (compound components or any content) */
  children: EtSectionChildren;

  // Appearance
  /** Shorthand: static title text (alternative to EtSection.Title) */
  title?: string;
  /** Custom container style */
  style?: StyleProp<ViewStyle>;

  // Accessibility
  /** Test ID */
  testID?: string;
}
