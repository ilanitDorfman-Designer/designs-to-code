import type { ComponentType } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import type { IconProps } from '../../../core/icons/models/icon-props';

export type InvestorBadgeVariant = 'pro' | 'popular';

export interface InvestorBadgeProps {
  accessibilityLabel?: string;
  iconSize?: number;
  showLabel?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export interface InvestorBadgeConfig {
  Icon: ComponentType<IconProps>;
  label: string;
  textColor: string;
}
