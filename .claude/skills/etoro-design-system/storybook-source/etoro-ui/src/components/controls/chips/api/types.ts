import { PropsWithChildren, ReactNode } from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';

import { IconName } from '../../../../foundations/icon-assets/api/types';

// Compound children types
export interface ChipIconProps {
  iconName: IconName;
}

export interface ChipLabelProps {
  children: ReactNode;
  style?: StyleProp<TextStyle>;
}

/**
 * Props for EtChip
 *
 * @example With compound children
 * ```tsx
 * <EtChip selected={true} onPress={handlePress}>
 *   <EtChip.Icon iconName="star" />
 *   <EtChip.Label>Chip</EtChip.Label>
 * </EtChip>
 * ```
 */
export interface EtChipProps extends PropsWithChildren {
  // State
  selected?: boolean;
  disabled?: boolean;

  // Interaction
  onPress?: () => void;
  onSelectionChange?: (_selected: boolean) => void;

  // Style
  style?: StyleProp<ViewStyle>;
  haptics?: boolean;

  /** When true, reveals a close icon by animating the close slot width and opacity while selected. */
  showCloseOnSelected?: boolean;

  // Accessibility
  testID?: string;
  accessibilityLabel?: string;
}
