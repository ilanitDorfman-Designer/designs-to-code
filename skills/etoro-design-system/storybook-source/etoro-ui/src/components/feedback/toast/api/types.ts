import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import { X2, X3, X4, X6, X9 } from '../../../../core/styles/spacing';
import type { IconName } from '../../../../foundations/icon-assets/api';

/**
 * Toast display types - determines the media/visual on the start of the toast.
 *
 * - `asset` / `image` / `assetGroup` / `icon` / `badge`: built-in media variants
 *   rendered by `ToastMedia` with the standard `StatusBadge` overlay.
 * - `custom`: caller supplies its own ReactNode for the media slot. No
 *   `StatusBadge` is overlaid — the caller's media is expected to be
 *   self-contained (e.g., a trader avatar that already carries its own badge).
 */
export type ToastType = 'asset' | 'image' | 'assetGroup' | 'icon' | 'badge' | 'custom';

/**
 * Toast status - determines the status badge and its icon
 */
export type ToastStatus = 'neutral' | 'loader' | 'success' | 'error' | 'disconnect';

/**
 * Statuses supported by the 'badge' toast type (badge as primary media)
 */
export type ToastBadgeStatus = Extract<ToastStatus, 'success' | 'error'>;

/**
 * Surface variant for the toast card.
 *
 * - `default`: solid `carbon050` surface with a drop shadow. Theme-aware
 *   (light in light mode, dark in dark mode). Use for the vast majority of
 *   toasts. Text is `carbon900` — do not hardcode light text in ReactNode messages.
 * - `inverted`: solid `carbon900` surface with `carbon050` text.
 *   Use for high-emphasis notifications where the surface contrast is part
 *   of the design (e.g., copy-trading success events). `carbon900` is the
 *   "max contrast against page background" token, so the result is dark in
 *   light mode and light in dark mode.
 */
export type ToastVariant = 'default' | 'inverted';

/**
 * Screen edge a toast is anchored to. `'top'` is the default; pass `'bottom'`
 * on an individual toast when it would cover content that matters up top.
 */
export type ToastPosition = 'top' | 'bottom';

/**
 * Asset configuration for single asset toasts
 */
export interface ToastAssetConfig {
  /** URL to the asset logo */
  logoUrl: string;
}

/**
 * Image configuration for image toasts
 */
export interface ToastImageConfig {
  /** URI of the image to display */
  uri: string;
}

/**
 * Asset group configuration for multi-asset toasts
 * Displays up to 3 assets in a stacked layout
 */
export interface ToastAssetGroupConfig {
  /** Array of assets to display (max 3 will be shown) */
  assets: ToastAssetConfig[];
}

/**
 * Icon configuration for icon-based toasts
 */
export interface ToastIconConfig {
  /** Icon name from the icon registry */
  name: IconName;
}

/**
 * Base properties shared by all toast types
 */
interface ToastConfigBase {
  /** Unique identifier for the toast */
  id: string;
  /** Status of the toast - determines the badge icon */
  status: ToastStatus;
  /** Message content - can be string or ReactNode for rich text */
  message: string | ReactNode;
  /** Auto-dismiss duration in milliseconds (default: 3000ms) */
  duration?: number;
  /**
   * Surface variant. Defaults to `'default'` (solid `carbon050` surface with a
   * shadow). Pass `'inverted'` for a solid `carbon900` surface with `carbon050` text.
   *
   * @default 'default'
   */
  variant?: ToastVariant;
  /** Optional tap handler. When provided, the toast becomes tappable and is dismissed after the callback fires. */
  onPress?: () => void;
  /**
   * Screen edge the toast is anchored to. Drives everything directional: the
   * anchor offset, which way it slides in and out, which way the stack grows,
   * and the swipe-to-dismiss direction (always "away from the screen").
   *
   * @default 'top'
   */
  position?: ToastPosition;
  testID?: string;
  /**
   * When true, renders a close (X) control that dismisses via the toast
   * dismiss pipeline WITHOUT invoking `onPress`.
   *
   * @default false
   */
  closable?: boolean;
  /**
   * Accessibility label for the close control.
   *
   * @default 'Close'
   */
  closeAccessibilityLabel?: string;
}

/**
 * Full toast configuration - discriminated union based on type
 * Each type requires its corresponding configuration
 */
export type ToastConfig =
  | (ToastConfigBase & {
      type: 'asset';
      asset: ToastAssetConfig;
    })
  | (ToastConfigBase & {
      type: 'image';
      image: ToastImageConfig;
    })
  | (ToastConfigBase & {
      type: 'assetGroup';
      assetGroup: ToastAssetGroupConfig;
    })
  | (ToastConfigBase & {
      type: 'icon';
      icon: ToastIconConfig;
    })
  | (Omit<ToastConfigBase, 'status'> & {
      type: 'badge';
      status: ToastBadgeStatus;
    })
  | (ToastConfigBase & {
      type: 'custom';
      /**
       * Caller-supplied media node. Rendered as-is in the media slot.
       *
       * No `StatusBadge` is overlaid on `custom` toasts — the caller's media
       * is expected to be self-contained. `status` on the base is still used
       * for semantics (a11y / future hooks) but does **not** drive a visual
       * badge for this type.
       */
      media: ReactNode;
    });

/**
 * Distributive Omit that preserves discriminated unions.
 * Standard Omit<Union, Key> doesn't distribute over union members,
 * but this helper does by using a conditional type.
 */
type DistributiveOmit<T, K extends keyof T> = T extends unknown ? Omit<T, K> : never;

/**
 * Configuration for showing a new toast (id is auto-generated).
 * Uses DistributiveOmit to preserve the discriminated union structure.
 */
export type ShowToastConfig = DistributiveOmit<ToastConfig, 'id'>;

/**
 * Toast context value provided by ToastProvider
 */
export interface ToastContextValue {
  /** Currently active toasts */
  toasts: ToastConfig[];
  /** Show a new toast and return its id */
  showToast: (config: ShowToastConfig) => string;
  /** Dismiss a specific toast by id */
  dismissToast: (id: string) => void;
  /** Dismiss all active toasts */
  dismissAll: () => void;
}

/**
 * Props for the ToastProvider component
 */
export interface ToastProviderProps {
  /** Child components wrapped by the provider */
  children: ReactNode;
  /** Maximum number of toasts kept mounted at once (default: 3) */
  maxToasts?: number;
  /** Default auto-dismiss duration in milliseconds (default: 3000ms) */
  defaultDuration?: number;
  /**
   * How many toasts remain fully visible in the collapsed pile before deeper
   * ones fade out (default: 3).
   */
  visibleToasts?: number;
  /** Render the stack expanded by default instead of collapsed (default: false). */
  expandByDefault?: boolean;
}

/**
 * Props for the main EtToast component
 */
export interface EtToastProps {
  /** Toast configuration */
  config: ToastConfig;
  /** Callback when toast is dismissed */
  onDismiss: (id: string) => void;
  /** Whether this toast is currently being held (pauses auto-dismiss) */
  isHeld?: boolean;
  /** Optional style override */
  style?: StyleProp<ViewStyle>;
}

/**
 * Pre-computed position of a single toast within the stack. Produced by the
 * container (on the JS thread) and animated to on the UI thread by each toast.
 */
export interface ToastStackGeometry {
  /** Vertical offset from the anchor (negative = moves up, away from the edge) */
  offset: number;
  /** Depth scale (1 = front, smaller as it recedes while collapsed) */
  scale: number;
  /** Target opacity (0 when stacked deeper than `visibleToasts`) */
  opacity: number;
  /** Distance from the front of the stack (0 = newest / front-most toast) */
  frontIndex: number;
}

/**
 * Props for the ToastContainer component
 */
export interface ToastContainerProps {
  /** Array of toast configurations to render (oldest first, newest last) */
  toasts: ToastConfig[];
  /** Callback when a toast is dismissed */
  onDismiss: (id: string) => void;
  /** How many toasts stay fully opaque before deeper ones fade out */
  visibleToasts?: number;
  /** Whether the stack starts expanded instead of collapsed */
  expandByDefault?: boolean;
}

/**
 * Props for the ToastMedia component
 * Note: type and status are now read from ToastInternalContext
 */
export interface ToastMediaProps {
  /** Asset configuration (required when type is 'asset') */
  asset?: ToastAssetConfig;
  /** Image configuration (required when type is 'image') */
  image?: ToastImageConfig;
  /** Asset group configuration (required when type is 'assetGroup') */
  assetGroup?: ToastAssetGroupConfig;
  /** Icon configuration (required when type is 'icon') */
  icon?: ToastIconConfig;
  /** Caller-supplied media node (required when type is 'custom') */
  customMedia?: ReactNode;
}

/**
 * Props for the ToastMessage component
 */
export interface ToastMessageProps {
  /** Message content */
  children: string | ReactNode;
}

/**
 * Props for the StatusBadge component
 *
 * @deprecated StatusBadge now reads status from ToastInternalContext.
 *
 * **Migration Guide:**
 * Instead of passing `status` as a prop, StatusBadge now automatically reads
 * it from the ToastInternalContext. Ensure your StatusBadge is rendered within
 * a ToastInternalContext.Provider (which happens automatically inside EtToast).
 *
 * Before:
 * ```tsx
 * <StatusBadge status="success" />
 * ```
 *
 * After:
 * ```tsx
 * <ToastInternalContext.Provider value={{ type, status }}>
 *   <StatusBadge />
 * </ToastInternalContext.Provider>
 * ```
 *
 * @see ToastInternalContext for context usage
 * @see useToastInternalContext for the hook to access context
 *
 * TODO: Remove this interface in v2.0.0 (breaking change)
 * Issue: #TOAST-CLEANUP
 */
export interface StatusBadgeProps {
  /** Status to display */
  status: ToastStatus;
}

/**
 * Animation configuration constants
 */
export const TOAST_ANIMATION = {
  /** Entry animation duration in ms */
  ENTRY_DURATION: 300,
  /** Exit animation duration in ms */
  EXIT_DURATION: 200,
  /** Swipe threshold to dismiss in px */
  SWIPE_THRESHOLD: 50,
  /** Gap between stacked toasts in px (used when the stack is expanded) */
  STACK_GAP: X2, // 8px
  /**
   * Peek offset per toast sitting *behind* the front one while the stack is
   * collapsed. Each deeper toast pokes this many px above the one in front of
   * it (Sonner-style pile). Ported from `expo-dynamic-toast`.
   */
  STACK_COLLAPSE_OFFSET: 14,
  /**
   * Scale reduction applied per depth level while collapsed, so toasts further
   * back look smaller and recede into the pile.
   */
  STACK_SCALE_STEP: 0.06,
  /** Lower bound for the collapsed depth scale so deep toasts stay legible. */
  STACK_MIN_SCALE: 0.85,
  /** Off-screen translation distance for entry/exit */
  SLIDE_DISTANCE: 100,
  /** Base bottom offset from screen edge, used by bottom-anchored toasts */
  BOTTOM_OFFSET: 100,
  /**
   * Gap between the top safe-area inset and a top-anchored toast. The actual
   * anchor is `insets.top + TOP_INSET_MARGIN`, so the toast clears the status
   * bar / notch on every device instead of relying on a fixed pixel offset.
   */
  TOP_INSET_MARGIN: X2,
  /**
   * How long a user-expanded stack stays open with no interaction before it
   * collapses on its own. Expanding freezes every auto-dismiss timer so the
   * user can read the pile; without this ceiling a stack the user expanded and
   * walked away from would sit on screen forever.
   */
  EXPANDED_IDLE_TIMEOUT: 10000,
  /**
   * Grace period after a user-expanded stack collapses (tap or idle). The pile
   * was already read, so leftover original duration is replaced with this short
   * window instead of resuming ~4s and letting an expanded session stretch to
   * idle + remaining (~14s+).
   */
  POST_READ_DISMISS_DURATION: 1000,
} as const;

/**
 * Toast visual constants from Figma
 * Uses spacing constants (X1=4, X2=8, X3=12, X4=16, etc.)
 */
export const TOAST_DIMENSIONS = {
  /** Horizontal margin from screen edges */
  MARGIN_HORIZONTAL: X6,
  /** Maximum toast width (for tablets / wide screens) */
  MAX_WIDTH: 500,
  /** Minimum toast height — grows automatically for multi-line messages */
  MIN_HEIGHT: 66,
  /** Border radius */
  BORDER_RADIUS: X3, // 12px
  /** Horizontal padding */
  PADDING_HORIZONTAL: X4, // 16px
  /** Vertical padding */
  PADDING_VERTICAL: X3, // 12px
  /** Gap between media and content */
  CONTENT_GAP: X3, // 12px
  /** Asset/image size */
  MEDIA_SIZE: X9, // 36px
  /** Status badge size */
  BADGE_SIZE: 20,
  /** Media border radius */
  MEDIA_BORDER_RADIUS: X2, // 8px (using X2 for consistency, adjust if needed)
  /** Asset group overlap margin */
  ASSET_GROUP_OVERLAP: -X6, // -24px
  /** Badge offset from edge */
  BADGE_OFFSET_TOP: -5,
  BADGE_OFFSET_END: -X2, // -8px
} as const;

/**
 * Default toast duration in milliseconds
 */
export const DEFAULT_TOAST_DURATION = 4000;

/** Screen edge toasts anchor to when a config doesn't specify one. */
export const DEFAULT_TOAST_POSITION: ToastPosition = 'top';

/**
 * Direction multiplier for a toast's off-screen travel: `+1` moves it toward
 * the bottom edge, `-1` toward the top. A top-anchored toast enters from above,
 * exits upward, stacks downward, and is swiped up to dismiss — all of which are
 * the bottom behaviour with this sign flipped.
 */
export function toastExitSign(position: ToastPosition = DEFAULT_TOAST_POSITION): 1 | -1 {
  return position === 'top' ? -1 : 1;
}

/**
 * Maximum number of toasts kept mounted simultaneously. Older toasts beyond
 * this cap are dropped as new ones arrive.
 */
export const DEFAULT_MAX_TOASTS = 3;

/**
 * How many toasts stay fully opaque in the collapsed pile. Toasts stacked
 * deeper than this fade out (but remain mounted until dismissed).
 */
export const DEFAULT_VISIBLE_TOASTS = 3;
