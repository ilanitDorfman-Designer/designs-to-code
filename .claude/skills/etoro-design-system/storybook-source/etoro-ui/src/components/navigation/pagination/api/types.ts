import { StyleProp, ViewStyle } from 'react-native';
import { SharedValue } from 'react-native-reanimated';

/**
 * Size variants for the pagination component
 * - small: 4px dot height, 8px selected width
 * - large: 6px dot height, 12px selected width
 */
export type PaginationSize = 'small' | 'large';

/**
 * Color variants for the pagination component
 * - neutral: Dark selected dot (textPrimaryNeutral)
 * - primary: Primary selected dot (actionBrandText)
 */
export type PaginationColor = 'neutral' | 'primary';

/**
 * Props for the PaginationDot subcomponent
 */
export interface PaginationDotProps {
  /** Index of this dot */
  index: number;
  /** Total number of pages (for accessibility label) */
  totalPages: number;
  /** Current active page as a shared value */
  currentPage: SharedValue<number>;
  /** Size variant */
  size: PaginationSize;
  /** Selected dot color */
  selectedColor: string;
  /** Default dot color */
  defaultColor: string;
}

/**
 * Props for EtPagination
 *
 * @example Basic usage with a number
 * ```tsx
 * <EtPagination
 *   totalPages={5}
 *   currentPage={2}
 * />
 * ```
 *
 * @example Scroll-driven animations with SharedValue
 * ```tsx
 * const currentPage = useSharedValue(0);
 * <EtPagination
 *   totalPages={5}
 *   currentPage={currentPage}
 * />
 * ```
 *
 * @example With size and color variants
 * ```tsx
 * <EtPagination
 *   totalPages={4}
 *   currentPage={1}
 *   size="large"
 *   color="primary"
 * />
 * ```
 */
export interface EtPaginationProps {
  // Required
  /** Total number of pages to display */
  totalPages: number;
  /**
   * Current active page (0-indexed).
   * Accepts a number for simple use cases or SharedValue for scroll-driven animations.
   */
  currentPage: number | SharedValue<number>;

  // Optional - Appearance
  /** Size variant of the pagination dots. Defaults to 'large' */
  size?: PaginationSize;
  /** Color variant of the pagination dots. Defaults to 'neutral' */
  color?: PaginationColor;

  // Optional - Style
  /** Custom styles for the container */
  style?: StyleProp<ViewStyle>;

  // Accessibility
  /** Test ID for testing purposes */
  testID?: string;
  /** Accessibility label for the pagination container */
  accessibilityLabel?: string;
}
