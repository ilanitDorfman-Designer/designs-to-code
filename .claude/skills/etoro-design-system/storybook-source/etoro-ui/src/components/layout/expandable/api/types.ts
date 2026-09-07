import { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

export interface EtExpandableProps {
  /**
   * Content to display inside the expandable container
   */
  children: ReactNode;

  /**
   * Maximum height when collapsed (in pixels)
   * If not provided, will use `collapsedItems` to calculate
   */
  collapsedHeight?: number;

  /**
   * Number of items to show when collapsed (for list-based content)
   * @default undefined (uses collapsedHeight instead)
   */
  collapsedItems?: number;

  /**
   * Estimated height per item (used with collapsedItems)
   * @default 50
   */
  itemHeight?: number;

  /**
   * Whether the content is initially expanded
   * @default false
   */
  initialExpanded?: boolean;

  /**
   * Callback when expanded state changes
   */
  onExpandedChange?: (expanded: boolean) => void;

  /**
   * Animation duration in milliseconds
   * @default 300
   */
  animationDuration?: number;

  /**
   * Text to show on the expand button
   * @default 'Show More'
   */
  showMoreText?: string;

  /**
   * Text to show on the collapse button
   * @default 'Show Less'
   */
  showLessText?: string;

  /**
   * Whether to show the toggle button
   * @default true
   */
  showToggleButton?: boolean;

  /**
   * Custom style for the container
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Custom style for the default toggle button
   */
  toggleButtonStyle?: StyleProp<ViewStyle>;

  /**
   * Custom render function for the toggle button
   */
  renderToggleButton?: (props: { expanded: boolean; onToggle: () => void; showMoreText: string; showLessText: string }) => ReactNode;

  /**
   * Whether to show a gradient fade at the bottom when collapsed
   * @default true
   */
  showGradient?: boolean;

  /**
   * When true, always show the toggle button regardless of whether
   * content exceeds collapsedHeight. Useful when children change
   * dynamically between collapsed/expanded states.
   * @default false
   */
  forceNeedsExpansion?: boolean;

  /**
   * Test ID for the toggle button (for E2E testing)
   */
  testID?: string;
}
