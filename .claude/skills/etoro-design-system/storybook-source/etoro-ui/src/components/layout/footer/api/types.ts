import { ReactNode } from 'react';
import { PressableProps, StyleProp, ViewProps, ViewStyle } from 'react-native';

/**
 * Props for EtFooter.Link
 */
export interface EtFooterLinkProps extends Omit<PressableProps, 'children'> {
  children: ReactNode;
  /** Custom styles for the link container */
  style?: StyleProp<ViewStyle>;
}

/**
 * Props for EtFooter.Section
 */
export interface EtFooterSectionProps extends Omit<ViewProps, 'children'> {
  children: ReactNode;
  /** Custom styles for the section container */
  style?: StyleProp<ViewStyle>;
}

/**
 * Scroll direction for EtFooter.Scrollable
 */
export type EtFooterScrollDirection = 'vertical' | 'horizontal';

/**
 * Props for EtFooter.Scrollable
 */
export interface EtFooterScrollableProps extends Omit<ViewProps, 'children'> {
  /** Children - for horizontal mode, should be EtFooter.Section components */
  children: ReactNode;
  /** Custom styles for the scroll container */
  style?: StyleProp<ViewStyle>;
  /** Custom styles for the content container (vertical mode only) */
  contentStyle?: StyleProp<ViewStyle>;
  /**
   * Scroll direction
   * - 'vertical': Simple vertical ScrollView for tall content
   * - 'horizontal': Paginated horizontal scroll with pagination dots
   * @default 'vertical'
   */
  direction?: EtFooterScrollDirection;
}

/**
 * Props for EtFooter component
 */
export interface EtFooterProps extends Omit<ViewProps, 'children'> {
  /** Footer content */
  children: ReactNode;
  /** Custom styles for the footer container */
  style?: StyleProp<ViewStyle>;
  /** Custom styles for the content container */
  contentStyle?: StyleProp<ViewStyle>;
}
