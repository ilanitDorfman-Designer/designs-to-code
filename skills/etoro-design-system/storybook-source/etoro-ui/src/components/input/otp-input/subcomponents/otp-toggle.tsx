import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { X1 } from '../../../../core/styles/spacing';
import { EtIconV2 } from '../../../et-icon-v2';
import { OtpToggleProps } from '../api/types';
import { useOtpContext } from '../context';

/**
 * EtOtpInput.Toggle — show/hide toggle for secure OTP entry.
 * Reads `isSecure` + `toggleSecure` from OtpContext.
 *
 * Always interactive — visibility toggling is a view-only action that does not
 * mutate the input value, so it stays enabled even when the OTP input is `disabled`.
 */
function OtpToggleBase({ accessibilityLabel, testID = 'otp-toggle-icon' }: OtpToggleProps) {
  const { isSecure, toggleSecure, iconColor } = useOtpContext();

  return (
    <Pressable
      onPress={toggleSecure}
      testID={testID}
      style={styles.icon}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      accessibilityLabel={accessibilityLabel ?? (isSecure ? 'Show code' : 'Hide code')}
      accessibilityRole="button"
      accessibilityState={{ disabled: false }}
    >
      <EtIconV2 name={isSecure ? 'eye' : 'eye-slash'} size="sm" color={iconColor} />
    </Pressable>
  );
}

export const OtpToggle: React.NamedExoticComponent<OtpToggleProps> = React.memo(OtpToggleBase);

OtpToggle.displayName = 'EtOtpInput.Toggle';

const styles = StyleSheet.create({
  icon: {
    marginStart: X1,
  },
});
