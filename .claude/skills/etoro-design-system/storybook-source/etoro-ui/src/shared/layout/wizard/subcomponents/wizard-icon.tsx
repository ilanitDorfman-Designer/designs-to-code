import type { StyleProp, ViewStyle } from 'react-native';

import { EtIconV2 } from '../../../../components/et-icon-v2';
import type { IconName, IconSize, IconVariant } from '../../../../components/et-icon-v2/api/types';

export interface WizardIconProps {
  /** Icon name from the Zappicons library */
  name: IconName;
  /** Icon variant style. Default: 'regular' */
  variant?: IconVariant;
  /** Icon size - preset or custom number. Default: 24 */
  size?: IconSize;
  /** Override the icon color */
  color?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/**
 * EtWizard.Icon - Standalone icon subcomponent for wizard step content.
 *
 * Wraps EtIconV2 with wizard-appropriate defaults (size 24, theme-aware color).
 * Use for decorative icons inside step content. For icons inside buttons,
 * use EtWizard.Button.Icon instead.
 */
export function WizardIcon({ name, variant, size = 24, color, style, testID }: WizardIconProps) {
  return <EtIconV2 name={name} variant={variant} size={size} color={color} style={style} testID={testID} />;
}

WizardIcon.displayName = 'EtWizard.Icon';
