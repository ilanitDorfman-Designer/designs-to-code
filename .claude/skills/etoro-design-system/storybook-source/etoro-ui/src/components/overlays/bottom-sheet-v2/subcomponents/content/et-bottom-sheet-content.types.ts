import { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

/**
 * Props for EtBottomSheet.Content
 */
export interface EtBottomSheetContentProps {
  /** Content to render */
  children: ReactNode;
  /**
   * Enable scrolling when content overflows.
   * When true, the parent EtBottomSheet wraps content in BottomSheetScrollView
   * for proper gesture handling.
   *
   * **Note:** This prop is read by the parent EtBottomSheet component, not by
   * EtBottomSheet.Content itself. The parent uses this to determine the
   * appropriate scroll container.
   *
   * @default false (uses dynamic sizing to fit content)
   */
  scrollable?: boolean;
  /**
   * Deprecated. Vertical scroll indicators are hidden app-wide.
   */
  showsVerticalScrollIndicator?: boolean;
  /** Custom style override */
  style?: StyleProp<ViewStyle>;
  /** Custom loading placeholder (shown when parent sheet has loading=true) */
  loadingPlaceholder?: ReactNode;
}
