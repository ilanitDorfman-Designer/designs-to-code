import { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

export interface EtExpandableCardProps {
  /** Content to display when collapsed */
  collapsedContent: ReactNode;
  /** Content to display when expanded */
  expandedContent: ReactNode;
  /** Whether the card starts expanded */
  defaultExpanded?: boolean;
  /** Callback when expansion state changes */
  onExpansionChange?: (expanded: boolean) => void;
  /** Custom container style */
  style?: StyleProp<ViewStyle>;
  /** Custom style for collapsed state */
  collapsedStyle?: StyleProp<ViewStyle>;
  /** Custom style for expanded state */
  expandedStyle?: StyleProp<ViewStyle>;
  /** Test ID for testing */
  testID?: string;
  /** Whether the card is allowed to expand/collapse */
  canExpand?: boolean;
  /** Optional fill color for the collapsed SVG background */
  collapsedFillColor?: string;
}
