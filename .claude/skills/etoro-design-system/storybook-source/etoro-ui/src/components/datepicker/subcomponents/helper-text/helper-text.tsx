import { StyleSheet, View } from 'react-native';

import { useEtoroTheme } from '../../../../core/hooks/use-etoro-theme';
import { X1 } from '../../../../core/styles/spacing';
import { EtText } from '../../../../foundations/text/et-text';
import { INPUT_LAYOUT_METRICS } from '../../../input/input-v2';

interface HelperTextProps {
  error?: string | null;
}

/**
 * Simple helper text that only displays error messages.
 * Unlike Input's HelperText, this doesn't support character counter
 * since datepicker fields are read-only and don't need it.
 * Color stays `actionBrandVarText` (D4 — same red as the error border).
 * Horizontal padding is sourced from `INPUT_LAYOUT_METRICS.paddingHorizontal` so it stays
 * pinned to the boxed container even if V2's metric changes.
 */
export function HelperText({ error }: HelperTextProps) {
  const { colors } = useEtoroTheme();

  if (!error) {
    return null;
  }

  return (
    <View style={styles.container}>
      <EtText variant="body-tiny-regular" style={{ color: colors.actionBrandVarText }}>
        {error}
      </EtText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: X1,
    paddingHorizontal: INPUT_LAYOUT_METRICS.paddingHorizontal,
  },
});
