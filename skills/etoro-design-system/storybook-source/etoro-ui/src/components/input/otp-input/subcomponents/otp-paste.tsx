import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { X1 } from '../../../../core/styles/spacing';
import { EtIconV2 } from '../../../et-icon-v2';
import { OtpPasteProps } from '../api/types';
import { useOtpContext } from '../context';

/**
 * Paste button for EtOtpInput - reads OTP code from clipboard.
 *
 * Usage:
 * ```tsx
 * <EtOtpInput length={6} value={code} onChangeText={setCode}>
 *   <EtOtpInput.Paste />
 * </EtOtpInput>
 * ```
 */
function OtpPasteBase({ accessibilityLabel, testID = 'otp-paste-icon' }: OtpPasteProps) {
  const { pasteFromClipboard, disabled, iconColor } = useOtpContext();

  const handlePress = () => {
    if (!disabled) {
      void pasteFromClipboard();
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      testID={testID}
      style={styles.icon}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
    >
      <EtIconV2 name="copy" size="sm" color={iconColor} />
    </Pressable>
  );
}

export const OtpPaste: React.NamedExoticComponent<OtpPasteProps> = React.memo(OtpPasteBase);

OtpPaste.displayName = 'EtOtpInput.Paste';

const styles = StyleSheet.create({
  icon: {
    marginStart: X1,
  },
});
