import type { ReactNode } from 'react';
import type { StyleProp, TextStyle } from 'react-native';

import { EtText } from '../../../../foundations/text';
import type { TextVariant } from '../../../../foundations/text/utils/variant-config';

export interface WizardTitleProps {
  children: ReactNode;
  /** Override the default text variant. Default: 'display-main' */
  variant?: TextVariant;
  /** Override the text color */
  color?: string;
  style?: StyleProp<TextStyle>;
  testID?: string;
}

/**
 * EtWizard.Title - Step title with display-main styling by default.
 *
 * Provides Figma-derived defaults (Bold 28px, textPrimaryNeutral)
 * while allowing full customization via variant, color, and style props.
 */
export function WizardTitle({ children, variant = 'display-main', color, style, testID }: WizardTitleProps) {
  return (
    <EtText variant={variant} style={[color != null && { color }, style]} testID={testID}>
      {children}
    </EtText>
  );
}

WizardTitle.displayName = 'EtWizard.Title';
