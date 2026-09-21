import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useEtoroTheme } from '../../../../core/hooks';
import { X2 } from '../../../../core/styles/spacing';
import { EtText } from '../../../../foundations/text';
import { OtpErrorMessageProps } from '../api/types';

/**
 * EtOtpInput.ErrorMessage — renders a red error message below the OTP cells.
 * Consumer controls visibility via conditional rendering.
 */
function OtpErrorMessageBase({ children, testID, accessibilityLabel }: OtpErrorMessageProps) {
  const { colors } = useEtoroTheme();

  return (
    <View style={styles.container} accessibilityRole="alert" accessibilityLiveRegion="polite" testID={testID} accessibilityLabel={accessibilityLabel}>
      <EtText variant="body-tiny-regular" style={[styles.text, { color: colors.actionBrandVarText }]}>
        {children}
      </EtText>
    </View>
  );
}

export const OtpErrorMessage: React.NamedExoticComponent<OtpErrorMessageProps> = React.memo(OtpErrorMessageBase);

OtpErrorMessage.displayName = 'EtOtpInput.ErrorMessage';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: X2,
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  },
});
