import type { ReactElement, ReactNode, Ref } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

// ============================================================================
// Imperative Handle
// ============================================================================

/**
 * Imperative handle exposed by EtTooltip via ref.
 * Consumers call `present()` / `dismiss()` without knowing
 * the underlying BottomSheetModal implementation.
 */
export interface EtTooltipRef {
  /** Show the tooltip bottom sheet */
  present: () => void;
  /** Dismiss the tooltip bottom sheet */
  dismiss: () => void;
}

// ============================================================================
// Subcomponent Props
// ============================================================================

/**
 * Props for EtTooltip.Title subcomponent
 */
export interface TooltipTitleProps {
  /** Title text content */
  children: string;
  /** Test ID */
  testID?: string;
}

/**
 * Props for EtTooltip.Body subcomponent
 *
 * String children are auto-wrapped in EtText with body-base-regular variant.
 * ReactNode children are rendered as-is for custom content.
 */
export interface TooltipBodyProps {
  /** Body content - string or custom ReactNode */
  children: ReactNode;
  /** Style override for the body container */
  style?: StyleProp<ViewStyle>;
  /** Test ID */
  testID?: string;
}

// ============================================================================
// Children Union Types
// ============================================================================

/** Valid child element types for EtTooltip */
export type TooltipChild = ReactElement<TooltipTitleProps> | ReactElement<TooltipBodyProps> | string | null | false | undefined;

/** Valid children for EtTooltip */
export type EtTooltipChildren = TooltipChild | TooltipChild[];

// ============================================================================
// Main Component Props
// ============================================================================

/**
 * Props for EtTooltip component
 *
 * A convenience wrapper around EtBottomSheetV2 for displaying informational
 * tooltip-style bottom sheets with a title, close button, and body text.
 *
 * @example Simple props-based usage
 * ```tsx
 * const tooltipRef = useRef<EtTooltipRef>(null);
 *
 * <EtTooltip ref={tooltipRef} title="Recently Traded">
 *   {t('recentlyTraded.disclaimer')}
 * </EtTooltip>
 * ```
 *
 * @example Compound children usage
 * ```tsx
 * <EtTooltip ref={tooltipRef}>
 *   <EtTooltip.Title>Recently Traded</EtTooltip.Title>
 *   <EtTooltip.Body>
 *     {t('recentlyTraded.disclaimer')}
 *   </EtTooltip.Body>
 * </EtTooltip>
 * ```
 */
export interface EtTooltipProps {
  /** Imperative handle ref (present / dismiss) */
  ref?: Ref<EtTooltipRef>;

  /** Shorthand: title text (alternative to EtTooltip.Title) */
  title?: string;

  /** Content - string body text, or compound children (EtTooltip.Title + EtTooltip.Body) */
  children: EtTooltipChildren;

  /** Called when the tooltip is closed */
  onClose?: () => void;

  /** Called synchronously when the header dismiss control is pressed, before the dismiss animation */
  onClosePress?: () => void;

  /**
   * Behavior when presenting this tooltip while another bottom sheet is already presented.
   * Use 'push' when opening tooltip content from inside another sheet so the parent remains mounted.
   */
  stackBehavior?: 'replace' | 'push' | 'switch';

  /** Test ID */
  testID?: string;

  /** Accessibility label for the bottom sheet (defaults to resolved title) */
  accessibilityLabel?: string;

  /** Accessibility label for the close button (defaults to 'Close') */
  closeButtonAccessibilityLabel?: string;

  /**
   * Header dismiss control icon. Use `back` for nested sheets that return to a parent
   * (chevron on the leading edge); default `close` keeps the trailing X.
   */
  closeButtonIcon?: 'close' | 'back';
}
