import React from 'react';

import { IconName } from '../../../../foundations/icon-assets/api/types';
import { EtoroIcon } from '../../../../foundations/icon-assets/et-icon';

interface ListItemIconProps {
  icon: IconName;
  size?: number;
}

export function ListItemIcon({ icon, size = 24 }: ListItemIconProps) {
  return <EtoroIcon icon={{ iconName: icon }} appearance={{ size }} />;
}
