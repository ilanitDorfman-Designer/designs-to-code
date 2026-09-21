import type { ReactElement, ReactNode } from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

/**
 * Illustration size presets matching Figma Banner variants.
 * - `small` — compact side art (button + illustration)
 * - `medium` — default side art (link/button + illustration)
 * - `large` — taller side art spanning most of the card height
 */
export type BannerIllustrationSize = 'small' | 'medium' | 'large';

/**
 * Props for {@link EtBanner.Title}.
 */
export interface BannerTitleProps {
  children: ReactNode;
  style?: StyleProp<TextStyle>;
  testID?: string;
}

/**
 * Props for {@link EtBanner.Description}.
 */
export interface BannerDescriptionProps {
  children: ReactNode;
  style?: StyleProp<TextStyle>;
  testID?: string;
}

/**
 * Props for {@link EtBanner.Actions}.
 * Compose with `EtButton` (`size="tiny"`) and/or `EtLink` (`size="small"`).
 */
export interface BannerActionsProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/**
 * Props for {@link EtBanner.Illustration}.
 * Pass side art as `children`. Without children the slot renders nothing.
 */
export interface BannerIllustrationProps {
  children?: ReactNode;
  /** Side-art size preset. @default 'medium' */
  size?: BannerIllustrationSize;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/**
 * Allowed compound child element of EtBanner.
 */
export type EtBannerChild =
  | ReactElement<BannerTitleProps>
  | ReactElement<BannerDescriptionProps>
  | ReactElement<BannerActionsProps>
  | ReactElement<BannerIllustrationProps>;

/**
 * Compound children for EtBanner (supports conditionals / arrays).
 */
export type EtBannerChildren = EtBannerChild | false | null | undefined | Array<EtBannerChild | false | null | undefined>;

/**
 * Props for {@link EtBanner}.
 *
 * @example
 * ```tsx
 * <EtBanner onClose={() => {}}>
 *   <EtBanner.Title>Title</EtBanner.Title>
 *   <EtBanner.Description>Supporting copy.</EtBanner.Description>
 *   <EtBanner.Actions>
 *     <EtButton size="tiny" variant="primary-filled">Label</EtButton>
 *   </EtBanner.Actions>
 * </EtBanner>
 * ```
 */
export interface EtBannerProps {
  /** Compound children: Title, Description, Actions, Illustration. */
  children: EtBannerChildren;
  /** When provided, renders the dismiss (xmark) control in the top-right. */
  onClose?: () => void;
  /** Accessibility label for the dismiss control. @default 'Close' */
  closeAccessibilityLabel?: string;
  /** Outer container style (margins belong to the host). */
  style?: StyleProp<ViewStyle>;
  /** Test id for the root; close uses `${testID}-close`. */
  testID?: string;
  /** Accessibility label for the banner container. */
  accessibilityLabel?: string;
}
