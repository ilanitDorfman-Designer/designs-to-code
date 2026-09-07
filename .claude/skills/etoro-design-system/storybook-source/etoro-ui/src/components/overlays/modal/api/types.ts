import { ReactElement, ReactNode, RefObject } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

// ============================================================================
// Backdrop Configuration
// ============================================================================

export interface ModalBackdropConfig {
  /** Enable backdrop overlay. Default: true */
  enabled?: boolean;
  /** Custom backdrop press handler (called before dismiss) */
  onPress?: () => void;
  /** Maximum animated opacity for the backdrop container (0-1). Default: 1 */
  opacity?: number;
  /** Custom accessibility label for backdrop (only used when closeOnBackdrop is true). Default: "Close modal" */
  accessibilityLabel?: string;
}

// ============================================================================
// Surface (background) Variant
// ============================================================================

export type EtModalSurface = 'primary' | 'secondary' | 'tertiary';

// ============================================================================
// Modal Ref API
// ============================================================================

export interface EtModalRef {
  /** Present the modal with animation */
  present: () => void;
  /** Dismiss the modal with animation */
  dismiss: () => void;
}

// ============================================================================
// Subcomponent Props
// ============================================================================

export interface EtModalContentProps {
  /** Content to render */
  children: ReactNode;
  /** Custom style for content container */
  style?: StyleProp<ViewStyle>;
  /** Whether content is scrollable */
  scrollable?: boolean;
  /** Custom loading placeholder component */
  loadingPlaceholder?: ReactNode;
}

export interface EtModalFooterProps {
  /** Footer content (typically buttons) */
  children: ReactNode;
  /** Custom style for the footer container (e.g. override paddingBottom). Matches EtModal.Header. */
  style?: StyleProp<ViewStyle>;
}

export interface EtModalHeaderProps {
  /** Header content */
  children: ReactNode;
  /** Custom style for header container */
  style?: StyleProp<ViewStyle>;
  /** Test ID for testing */
  testID?: string;
}

export interface EtModalHeaderTitleProps {
  /** Title text */
  children: string;
}

export interface EtModalHeaderActionProps {
  /** Action content (typically an icon) */
  children: ReactNode;
  /** Press handler */
  onPress: () => void;
  /** Accessibility label */
  accessibilityLabel: string;
  /** Test ID for testing */
  testID?: string;
}

export interface EtModalHandleProps {
  /** Whether to show the handle indicator. Default: true */
  showHandle?: boolean;
}

// ============================================================================
// Children Types
// ============================================================================

export type EtModalHeaderChild = ReactElement<EtModalHeaderProps>;
export type EtModalContentChild = ReactElement<EtModalContentProps>;
export type EtModalFooterChild = ReactElement<EtModalFooterProps>;
/** Single modal child element, including falsy values for conditional rendering */
export type EtModalChild = EtModalHeaderChild | EtModalContentChild | EtModalFooterChild | false | null | undefined;
/** Modal children - supports conditional rendering patterns like {cond && <EtModal.Header/>} */
export type EtModalChildren = EtModalChild | EtModalChild[];

// ============================================================================
// Main Component Props
// ============================================================================

/**
 * Common props shared between controlled and imperative modes
 */
interface EtModalPropsBase {
  /** Children - accepts EtModal.Header, EtModal.Content, EtModal.Footer */
  children: EtModalChildren;

  // ---- Behavior ----
  /** Called when modal opens (animation complete) */
  onOpen?: () => void;
  /** Called when modal closes (animation complete) */
  onClose?: () => void;
  /** Called before close starts (for validation) */
  onBeforeClose?: () => boolean | void;
  /** Enable swipe down to close. Default: true */
  enableSwipeToClose?: boolean;
  /** Close when tapping backdrop. Default: true */
  closeOnBackdrop?: boolean;

  // ---- Appearance ----
  /** Show drag handle indicator. Default: true */
  showHandle?: boolean;
  /**
   * Sheet background surface token.
   * Default matches existing behavior (`tertiary`).
   *
   * Prefer this over ad-hoc `backgroundStyle` overrides when you need
   * consistent elevation/contrast across themes.
   */
  surface?: EtModalSurface;
  /** Backdrop configuration */
  backdrop?: ModalBackdropConfig;
  /** Custom style for modal container */
  style?: StyleProp<ViewStyle>;
  /** Custom style for background */
  backgroundStyle?: StyleProp<ViewStyle>;

  // ---- State ----
  /** Show loading state */
  loading?: boolean;

  // ---- Accessibility ----
  /** Accessibility label for the modal */
  accessibilityLabel?: string;
  /** Test ID */
  testID?: string;
}

/**
 * Props for imperative mode - control modal via ref methods (present/dismiss)
 */
interface EtModalPropsImperative extends EtModalPropsBase {
  /** Ref for imperative control (present/dismiss) */
  modalRef: RefObject<EtModalRef | null>;
  /** Not allowed in imperative mode */
  visible?: never;
}

/**
 * Props for controlled mode - control modal via visible prop
 */
interface EtModalPropsControlled extends EtModalPropsBase {
  /** Whether the modal is visible */
  visible: boolean;
  /** Not allowed in controlled mode */
  modalRef?: never;
}

/**
 * EtModal props - use either imperative mode (modalRef) or controlled mode (visible), not both
 */
export type EtModalProps = EtModalPropsImperative | EtModalPropsControlled;

// ============================================================================
// Context Types
// ============================================================================

export interface ModalConfigContextValue {
  /** Show drag handle indicator */
  showHandle: boolean;
  /** Close on backdrop tap */
  closeOnBackdrop: boolean;
  /** Enable swipe to close */
  enableSwipeToClose: boolean;
  /** Theme colors */
  colors: {
    background: string;
    handle: string;
    text: string;
    textSecondary: string;
    divider: string;
  };
}

export interface ModalStateContextValue {
  /** Whether modal is currently presented */
  isPresented: boolean;
  /** Whether modal is in loading state */
  isLoading: boolean;
  /** Dismiss the modal */
  dismiss: () => void;
  /** Close handler for subcomponents */
  handleClose: () => void;
}
