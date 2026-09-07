import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';

import { X6, X10 } from '../../../../core/styles';

export interface WizardFooterProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/**
 * EtWizard.Footer - Bottom action area (typically a CTA button).
 * Declare inside an `EtWizard.Step` to attach a footer to that step.
 * The wizard extracts the footer and renders it in a fixed area below
 * the step content. Steps without a Footer have no footer area.
 */
export function WizardFooter({ children, style, testID }: WizardFooterProps) {
  return (
    <View style={[styles.container, style]} testID={testID}>
      {children}
    </View>
  );
}

WizardFooter.displayName = 'EtWizard.Footer';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: X6,
    paddingTop: X6,
    paddingBottom: X10,
    width: '100%',
  },
});
