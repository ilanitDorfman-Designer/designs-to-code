import { ReactNode } from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';

import { IconName } from '../../../foundations/icon-assets/api/types';

// ============================================================================
// Root Component Types
// ============================================================================

/**
 * Direction in which the expanded content reveals.
 * - 'down': Content reveals from top to bottom (default)
 * - 'center': Content reveals from center outward (bidirectional)
 */
export type ExpandDirection = 'down' | 'center';

/**
 * Visual variant for the card's sentiment/state.
 * - 'positive': Green background and halo
 * - 'negative': Red background and halo
 * - 'neutral': Default grey background, no halo
 */
export type PositionCardVariant = 'positive' | 'negative' | 'neutral';

/**
 * Props for the EtPositionCard root component.
 */
export interface EtPositionCardProps {
  /**
   * Controlled expanded state. If provided, the component becomes controlled.
   */
  isExpanded?: boolean;

  /**
   * Initial expanded state for uncontrolled mode.
   * @default false
   */
  defaultExpanded?: boolean;

  /**
   * Callback when expanded state changes.
   */
  onExpandedChange?: (expanded: boolean) => void;

  /**
   * Whether the card is in loading state.
   * Subcomponents will show skeleton placeholders when true.
   * @default false
   */
  isLoading?: boolean;

  /**
   * Direction in which the expanded content reveals.
   * - 'down': Content reveals from top to bottom (default)
   * - 'center': Content reveals from center outward (bidirectional)
   * @default 'down'
   */
  expandDirection?: ExpandDirection;

  /**
   * Background color for the handle notch area.
   * This should match the screen/parent background color to create
   * the visual effect of a curved notch cut into the card's bottom.
   */
  handleBackgroundColor?: string;

  /**
   * Visual variant controlling the card's background color and halo.
   * - 'positive': Green background (for gains)
   * - 'negative': Red background (for losses)
   * - 'neutral': Default grey background, no halo (sentiment-agnostic)
   * @default 'positive'
   *
   * Note: CardChange indicators determine their own direction from their
   * percentage prop. To keep them in sync, derive variant from the same value:
   * `variant={percentage >= 0 ? 'positive' : 'negative'}`
   */
  variant?: PositionCardVariant;

  /**
   * Optional style overrides for the card container.
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Optional test ID for testing.
   */
  testID?: string;

  /**
   * Skip the expand/collapse animation; render expanded content in flow.
   * Use for cards mounted already-expanded inside virtualized lists
   * where measure-then-animate can leave the subtree blank on first paint.
   * @default false
   */
  disableExpandAnimation?: boolean;

  /**
   * Hide the bottom handle notch entirely.
   * Use for always-expanded cards where collapse is disabled.
   * @default false
   */
  hideHandle?: boolean;

  /**
   * Compound component children.
   */
  children: ReactNode;
}

// ============================================================================
// Header Subcomponent Props
// ============================================================================

/**
 * Props for EtPositionCard.Header container.
 */
export interface CardHeaderProps {
  children: ReactNode;
}

/**
 * Props for EtPositionCard.Symbol.
 */
export interface CardSymbolProps {
  children: ReactNode;
}

/**
 * Props for EtPositionCard.Name.
 */
export interface CardNameProps {
  children: ReactNode;
  style?: StyleProp<TextStyle>;
}

/**
 * Props for EtPositionCard.Price.
 */
export interface CardPriceProps {
  children: ReactNode;
}

/**
 * Props for EtPositionCard.Change.
 */
export interface CardChangeProps {
  /** When true, the dollar change is masked; percentage remains visible. */
  isMasked?: boolean;
  /**
   * The change value (e.g., 1.95)
   */
  value: number;

  /**
   * The percentage change (e.g., -1.03).
   * Direction (up/down arrow, color) is automatically determined from this value:
   * - Positive or zero: up arrow (green)
   * - Negative: down arrow (red)
   */
  percentage: number;
}

// ============================================================================
// Expanded Content Subcomponent Props
// ============================================================================

/**
 * Props for EtPositionCard.ExpandedContent.
 * This section animates in/out when the card expands/collapses.
 */
export interface CardExpandedContentProps {
  children: ReactNode;
}

/**
 * Props for EtPositionCard.CollapsedContent.
 * Inverse of ExpandedContent — this section is visible while collapsed and
 * animates out (height → 0) as the card expands. Use for collapsed-only chrome
 * such as a divider or a "Net Value" label.
 */
export interface CardCollapsedContentProps {
  children: ReactNode;
}

/**
 * Props for EtPositionCard.StatRow.
 */
export interface CardStatRowProps {
  /**
   * Label text (e.g., "Today's Return")
   */
  label: string;

  /**
   * Value to display (can be string or ReactNode for custom formatting)
   */
  value: ReactNode;
}

// ============================================================================
// Footer Subcomponent Props
// ============================================================================

/**
 * Props for EtPositionCard.Footer container.
 */
export interface CardFooterProps {
  children: ReactNode;
}

/**
 * Props for EtPositionCard.Label.
 */
export interface CardLabelProps {
  children: ReactNode;
}

/**
 * Props for EtPositionCard.Value.
 */
export interface CardValueProps {
  children: ReactNode;
}

/**
 * Props for EtPositionCard.SecondaryInfo.
 */
export interface CardSecondaryInfoProps {
  /**
   * Start side content (e.g., change indicator).
   * In LTR: left side. In RTL: right side.
   */
  start?: ReactNode;

  /**
   * End side content (e.g., "6.921 shares").
   * In LTR: right side. In RTL: left side.
   */
  end?: ReactNode;
}

/**
 * Props for EtPositionCard.Action.
 */
export interface CardActionProps {
  /**
   * Icon name to display
   */
  icon: IconName;

  /**
   * Callback when action is pressed
   */
  onPress?: () => void;

  /**
   * Accessibility label
   */
  accessibilityLabel?: string;
}

// ============================================================================
// Context Types
// ============================================================================

/**
 * Internal context value for PositionCard compound component.
 */
export interface PositionCardContextValue {
  /** Whether the card is expanded */
  isExpanded: boolean;

  /** Whether the card is in loading state */
  isLoading: boolean;

  /** Direction of expansion animation */
  expandDirection: ExpandDirection;

  /** Background color for the handle notch */
  handleBackgroundColor: string | undefined;

  /** Toggle the expanded state */
  onToggle: () => void;

  /** Visual variant of the card */
  variant: PositionCardVariant;

  /** When true, expand/collapse animations are skipped (immediate show/hide). */
  disableExpandAnimation: boolean;

  /** When true, the bottom handle notch is hidden. */
  hideHandle: boolean;
}
