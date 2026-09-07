import { ReactElement } from 'react';

import { IconName } from '../../../../foundations/icon-assets/api/types';

export interface ButtonGroupItemProps {
  iconName: IconName;
  onPress: () => void;
  disabled?: boolean;
  testID?: string;
  accessibilityLabel?: string;
}

export interface ButtonGroupContextValue {
  isFirst: boolean;
  isLast: boolean;
}

export type EtButtonGroupChildren = ReactElement<ButtonGroupItemProps> | ReactElement<ButtonGroupItemProps>[];

export interface EtButtonGroupProps {
  children: EtButtonGroupChildren;
  testID?: string;
}
