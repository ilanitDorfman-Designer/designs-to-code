import type { ReactNode } from 'react';
import type { StyleProp, TextStyle } from 'react-native';

import { EtText } from '../../../../foundations/text';
import type { TextVariant } from '../../../../foundations/text/utils/variant-config';

export interface WizardSubtitleProps {
  children: ReactNode;
  /** Override the default text variant. Default: 'body-secondary-regular' */
  variant?: TextVariant;
  /** Override the text color */
  color?: string;
  style?: StyleProp<TextStyle>;
  testID?: string;
}

/**
 * EtWizard.Subtitle - Step subtitle/paragraph with body-secondary-regular styling by default.
 *
 * Provides Figma-derived defaults (Regular 14px, textPrimaryNeutral)
 * while allowing full customization via variant, color, and style props.
 */
export function WizardSubtitle({ children, variant = 'body-secondary-regular', color, style, testID }: WizardSubtitleProps) {
  return (
    <EtText variant={variant} style={[color != null && { color }, style]} testID={testID}>
      {children}
    </EtText>
  );
}

WizardSubtitle.displayName = 'EtWizard.Subtitle';
