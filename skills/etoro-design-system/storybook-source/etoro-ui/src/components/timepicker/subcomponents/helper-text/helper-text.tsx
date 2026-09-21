import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useEtoroTheme } from '../../../../core/hooks/use-etoro-theme';
import { X1 } from '../../../../core/styles/spacing';
import { EtText } from '../../../../foundations/text/et-text';

interface HelperTextProps {
  error?: string | null;
}

/**
 * Simple helper text that only displays error messages.
 * Unlike Input's HelperText, this doesn't support character counter
 * since timepicker fields are read-only and don't need it.
 */
function HelperTextComponent({ error = null }: HelperTextProps) {
  const { colors } = useEtoroTheme();

  if (!error) {
    return null;
  }

  return (
    <View style={styles.container}>
      <EtText variant="body-tiny-regular" style={{ color: colors.statusNegative }}>
        {error}
      </EtText>
    </View>
  );
}

export const HelperText = React.memo(HelperTextComponent);
HelperText.displayName = 'EtTimepicker.HelperText';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: X1,
  },
});
