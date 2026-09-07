import type { ReactElement, ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import type { EtoroIconProps } from '../../../../foundations/icon-assets/api/types';

// ============================================================================
// Enums & Type Aliases
// ============================================================================

/**
 * Popover direction - where the popover appears relative to the target
 * - "above": popover above target, arrow at bottom pointing down
 * - "below": popover below target, arrow at top pointing up
 * - "left": popover to left of target, arrow on right pointing right
 * - "right": popover to right of target, arrow on left pointing left
 */
export type PopoverDirection = 'above' | 'below' | 'left' | 'right';

/**
 * Arrow alignment - where on the edge the arrow is positioned
 */
export type PopoverArrowAlignment = 'start' | 'center' | 'end';

/**
 * How the popover content is anchored to the target.
 *
 * - `"modal"` (default): the bubble is rendered in a full-screen native
 *   `Modal` and positioned from absolute window coordinates obtained via
 *   `measureInWindow`. Best for popovers that must escape clipping ancestors
 *   (e.g. inside a `ScrollView` with `overflow: hidden`).
 * - `"inline"`: the bubble is rendered as an absolutely-positioned child of
 *   the (relatively-positioned) target wrapper, anchored with pure relative
 *   layout (`bottom: '100%'`, etc.). It needs NO `measureInWindow` and no
 *   `Modal`, so it shares the target's exact coordinate space and stays
 *   correctly placed even inside nested native modals (`fullScreenModal`),
 *   where window coordinates and the popover `Modal`'s coordinate space
 *   diverge by the safe-area / presentation offset. Touches pass through to
 *   the target underneath (the bubble does not block the target the way the
 *   modal scrim does). Use when the target lives in a non-clipping container
 *   such as a sticky footer.
 */
export type PopoverAnchorMode = 'modal' | 'inline';

/**
 * Internal arrow position derived from popover direction
 */
export type ArrowPosition = 'top' | 'bottom' | 'left' | 'right';

// ============================================================================
// Context Interface
// ============================================================================

/**
 * Popover context value shared with subcomponents
 */
export interface PopoverContextValue {
  /** Text color for the popover content */
  textColor: string;
  /** Icon color for the popover content */
  iconColor: string;
  /** Background color for the popover */
  backgroundColor: string;
  /** Popover direction */
  popoverDirection: PopoverDirection;
  /** Arrow alignment */
  arrowAlignment: PopoverArrowAlignment;
  /** Whether the popover is visible (after timing) */
  isVisible: boolean;
  /** Close handler - always available for CloseButton and Modal back button */
  onClose?: () => void;
  /** Whether to close on outside press (only affects overlay tap, not CloseButton or back button) */
  closeOnOutsidePress: boolean;
  /** Whether to hide the arrow (arrow is shown by default) */
  hideArrow: boolean;
  /** How the content is anchored to the target (default: "modal") */
  anchorMode: PopoverAnchorMode;
}

// ============================================================================
// Subcomponent Props
// ============================================================================

/**
 * Props for EtPopover.Title subcomponent
 */
export interface PopoverTitleProps {
  /** Title text content */
  children: string;
  /** Optional icon name to show before the title */
  iconName?: EtoroIconProps['icon']['iconName'];
  /** Style override */
  style?: StyleProp<ViewStyle>;
  /** Test ID for testing */
  testID?: string;
}

/**
 * Props for EtPopover.Text subcomponent
 */
export interface PopoverTextProps {
  /** Text content */
  children: string;
  /** Optional icon name to show before the text */
  iconName?: EtoroIconProps['icon']['iconName'];
  /** Style override */
  style?: StyleProp<ViewStyle>;
  /** Test ID for testing */
  testID?: string;
}

/**
 * Props for EtPopover.Button subcomponent
 */
export interface PopoverButtonProps {
  /** Button label */
  children: string;
  /** Press handler */
  onPress: () => void;
  /** Style override */
  style?: StyleProp<ViewStyle>;
  /** Test ID for testing */
  testID?: string;
}

/**
 * Props for EtPopover.CloseButton subcomponent
 */
export interface PopoverCloseButtonProps {
  /** Custom close handler (defaults to context onClose) */
  onPress?: () => void;
  /** Style override */
  style?: StyleProp<ViewStyle>;
  /** Test ID for testing */
  testID?: string;
}

/**
 * Props for EtPopover.Arrow subcomponent
 */
export interface PopoverArrowProps {
  /** Style override */
  style?: StyleProp<ViewStyle>;
  /** Test ID for testing */
  testID?: string;
}

// ============================================================================
// Children Union Types
// ============================================================================

/**
 * Valid child element types for EtPopover.Content
 */
export type PopoverContentChild =
  | ReactElement<PopoverTitleProps>
  | ReactElement<PopoverTextProps>
  | ReactElement<PopoverButtonProps>
  | ReactElement<PopoverCloseButtonProps>
  | ReactElement<PopoverArrowProps>
  | string;

/**
 * Valid children types for EtPopover.Content
 */
export type PopoverContentChildren = PopoverContentChild | PopoverContentChild[] | string | string[];

// ============================================================================
// Props-Based Config Types
// ============================================================================

/**
 * Props-based title configuration (without children, as text is passed separately)
 */
export type PopoverTitleConfig = string | (Omit<PopoverTitleProps, 'children'> & { text: string });

/**
 * Props-based text configuration (without children, as text is passed separately)
 */
export type PopoverTextConfig = string | (Omit<PopoverTextProps, 'children'> & { text: string });

/**
 * Props-based button configuration (without children, as label is passed separately)
 * When using a string, onButtonPress must be provided in PopoverContentProps.
 * When using config object, onPress is included in the config.
 */
export type PopoverButtonConfig = string | (Omit<PopoverButtonProps, 'children'> & { label: string });

// ============================================================================
// Main Component Props
// ============================================================================

/**
 * Base props shared by all PopoverContent variants
 */
interface PopoverContentBaseProps {
  /**
   * Popover content (Title, Text, Button, CloseButton, Arrow)
   * Can also be a simple string for text-only popovers
   */
  children?: PopoverContentChildren;

  /** Style override for the content container */
  style?: StyleProp<ViewStyle>;

  // Props-based API (alternative to compound children)

  /** Title - string or config object with text and optional iconName */
  title?: PopoverTitleConfig;

  /** Text content - string or config object with text and optional iconName */
  text?: PopoverTextConfig;

  /** Show close button with optional config */
  closeButton?: boolean | PopoverCloseButtonProps;

  /** Show arrow with optional config */
  arrow?: boolean | PopoverArrowProps;
}

/**
 * Props when no button is provided
 */
interface PopoverContentPropsWithoutButton extends PopoverContentBaseProps {
  button?: undefined;
  onButtonPress?: undefined;
}

/**
 * Props when button is a string (onButtonPress is required)
 */
interface PopoverContentPropsWithStringButton extends PopoverContentBaseProps {
  /** Button label as string (requires onButtonPress) */
  button: string;
  /** Button press handler (required when button is a string) */
  onButtonPress: () => void;
}

/**
 * Props when button is a config object with label and onPress
 */
type PopoverButtonConfigWithLabel = Omit<PopoverButtonProps, 'children'> & { label: string };

interface PopoverContentPropsWithConfigButton extends PopoverContentBaseProps {
  /** Button config object with label and onPress */
  button: PopoverButtonConfigWithLabel;
  /** Button press handler (optional, uses button.onPress) */
  onButtonPress?: () => void;
}

/**
 * Props for EtPopover.Content - contains the popover content
 * Supports both compound children API and props-based API
 *
 * When button is a string, onButtonPress is required.
 * When button is a config object with label and onPress, onButtonPress is optional.
 */
export type PopoverContentProps = PopoverContentPropsWithoutButton | PopoverContentPropsWithStringButton | PopoverContentPropsWithConfigButton;

/**
 * Props for EtPopover.Target - wraps the target element
 */
export interface PopoverTargetProps {
  /** The target element that the popover points to */
  children: ReactNode;

  /** Style override for the target wrapper */
  style?: StyleProp<ViewStyle>;

  /** Test ID for testing */
  testID?: string;

  /** Accessibility label */
  accessibilityLabel?: string;
}

/**
 * Props for EtPopover.Root - the main wrapper component
 */
export interface PopoverRootProps {
  /** Children must include Target and Content */
  children: ReactNode;

  /** Whether the popover is visible (default: true) */
  visible?: boolean;

  /** Direction where the popover appears relative to the target element */
  popoverDirection?: PopoverDirection;

  /** Arrow alignment - where on the edge the arrow is positioned */
  arrowAlignment?: PopoverArrowAlignment;

  /** Delay in milliseconds before showing the popover after visible becomes true (default: 500) */
  showDelay?: number;

  /** Duration in milliseconds after which to auto-hide (default: 3000, 0 = no auto-hide) */
  autoHideDelay?: number;

  /** Called when close button is pressed or auto-hide triggers */
  onClose?: () => void;

  /** Whether to close the popover when pressing outside of it (default: true) */
  closeOnOutsidePress?: boolean;

  /** Whether to hide the arrow (default: false - arrow is shown by default) */
  hideArrow?: boolean;

  /**
   * How the content is anchored to the target (default: "modal").
   * Use `"inline"` for targets inside nested native modals / sticky footers
   * where the modal-based positioning drifts from the target. See
   * {@link PopoverAnchorMode}.
   */
  anchorMode?: PopoverAnchorMode;

  /** Container style override */
  style?: StyleProp<ViewStyle>;

  /** Test ID for testing */
  testID?: string;

  /** Accessibility label */
  accessibilityLabel?: string;
}

// ============================================================================
// Legacy Types (backwards compatibility)
// ============================================================================

export type PopoverChildren = PopoverContentChildren;
export type EtPopoverProps = PopoverRootProps;
