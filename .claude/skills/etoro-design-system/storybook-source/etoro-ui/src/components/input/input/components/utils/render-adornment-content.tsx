/* eslint-disable react-native/no-inline-styles */
import React from 'react';

import type { IconName } from '../../../../../foundations/icon-assets/api/types';
import { EtoroIcon } from '../../../../../foundations/icon-assets/et-icon';

interface RenderAdornmentContentParams {
  iconName?: IconName;
  size: number;
  children?: React.ReactNode;
  color: string;
}

/**
 * Render the adornment content with precedence:
 * 1. Icon (if iconName provided)
 * 2. Children (ReactNode - should be wrapped in EtText if text)
 *
 * @param params - Configuration for rendering the adornment content
 * @returns JSX element or null
 */
export function renderAdornmentContent({ iconName, size, children, color }: RenderAdornmentContentParams): React.ReactNode {
  if (iconName) {
    return <EtoroIcon icon={{ iconName }} style={{ hasFill: true, fill: color }} appearance={{ size, color }} />;
  }

  return children || null;
}
