import type { ReactElement, ReactNode } from 'react';
import type { AccessibilityState, StyleProp, ViewStyle } from 'react-native';

// ========== Slot Identity ==========

/** Slot type identifier used for runtime slot detection (survives minification) */
export type SlotType = 'start' | 'middle' | 'end' | 'divider' | 'skeleton';

// ========== Size & Skeleton Types ==========

/** Size variant (`large` | `small`). List row padding is X4 on both axes; skeleton vertical padding still varies by size (see `list-item-skeleton.tsx`). */
export type ListItemSize = 'large' | 'small';

/** Skeleton loading variant */
export type ListItemSkeleton = '1-line' | '2-lines' | 'asset-1-line' | 'asset-2-lines';

/**
 * Layout mode determined by which slot children are present.
 * - start-only: Only Start slot → full width
 * - start-end: Start + End → Start flex:1, End content-sized
 * - start-middle-end: All three → equal width (flex:1 each)
 */
export type ListItemLayoutMode = 'start-only' | 'start-end' | 'start-middle-end';

// ========== Slot Props ==========

export interface ListItemSlotProps {
  children: ReactNode;
  /** Override the default alignment for this slot */
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

// ========== Children Type ==========

export type EtListItemChildren =
  | ReactElement<ListItemSlotProps>
  | ReactElement<ListItemSkeletonProps>
  | Array<ReactElement<ListItemSlotProps> | ReactElement<ListItemSkeletonProps> | null | false>
  | null
  | false;

// ========== Divider Props ==========

export interface ListItemDividerProps {
  /** Container style override */
  style?: StyleProp<ViewStyle>;
  /** Test ID for testing */
  testID?: string;
}

// ========== Skeleton Props ==========

export interface ListItemSkeletonProps {
  /** Skeleton layout variant */
  variant: ListItemSkeleton;
  /**
   * Controls **vertical** padding only: `large` = X4, `small` = X3. Horizontal padding is fixed at X4 regardless of size.
   * Default: `'large'`. See `list-item-skeleton.tsx`.
   */
  size?: ListItemSize;
  /** Container style override */
  style?: StyleProp<ViewStyle>;
  /** Test ID for testing */
  testID?: string;
}

// ========== Main Props ==========

/**
 * Props for EtListItemV2
 *
 * @example Start + End with divider
 * ```tsx
 * <EtListItem size="large">
 *   <EtListItem.Start><MyContent /></EtListItem.Start>
 *   <EtListItem.End><MyEndContent /></EtListItem.End>
 *   <EtListItem.Divider />
 * </EtListItem>
 * ```
 *
 * @example Start + Middle + End (equal widths)
 * ```tsx
 * <EtListItem size="large">
 *   <EtListItem.Start>...</EtListItem.Start>
 *   <EtListItem.Middle>...</EtListItem.Middle>
 *   <EtListItem.End>...</EtListItem.End>
 * </EtListItem>
 * ```
 *
 * @example Skeleton loading
 * ```tsx
 * <EtListItem size="large">
 *   <EtListItem.Skeleton variant="asset-2-lines" />
 * </EtListItem>
 * ```
 */
export interface EtListItemProps {
  // Appearance
  /** Slot children (Start, Middle, End, Divider, Skeleton) */
  children?: EtListItemChildren;
  /** Size variant. Default: 'large'. Row padding is X4 horizontal and vertical. */
  size?: ListItemSize;
  /** Container style override */
  style?: StyleProp<ViewStyle>;

  // Interaction
  /** Press handler for the content area. When set, renders content as Pressable instead of View. */
  onPress?: () => void;
  /**
   * Long-press handler for the content area. Piggybacks on the same Pressable as `onPress`
   * (rendered when either is set), so it adds no gesture recognizers or idle cost — RN's
   * Pressability only arms its long-press timer while a touch is down.
   */
  onLongPress?: () => void;
  /** When `true`, lowers opacity and disables press handling. Default: `false`. */
  disabled?: boolean;

  // Accessibility
  /** Test ID for testing */
  testID?: string;
  /** Accessibility label for the pressable content area (used when onPress is set) */
  accessibilityLabel?: string;
  /** Accessibility state merged with the component's disabled state. */
  accessibilityState?: AccessibilityState;
}
