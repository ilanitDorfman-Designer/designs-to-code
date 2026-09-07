import { StyleSheet, View } from 'react-native';

import { useEtoroTheme } from '../../../../../core/hooks/use-etoro-theme';
import { X1, X2 } from '../../../../../core/styles/spacing';
import { EtText } from '../../../../../foundations/text/et-text';
import { EtNumber } from '../../../../data-display/number/et-number';
import { StatItemProps } from '../api';

/**
 * Individual stat display with value and label.
 *
 * @example
 * ```tsx
 * <EtUserProfileHeader.StatItem label="AUM" value={1800000} />
 * ```
 */
export function StatItem({ label, value, style, ...viewProps }: StatItemProps) {
  const { colors } = useEtoroTheme();

  const valueStyle = {
    color: colors.textPrimaryNeutral,
  };

  const labelStyle = {
    color: colors.textSecondaryNeutral,
  };

  return (
    <View style={[styles.container, style]} {...viewProps}>
      <EtNumber value={value} format="compact">
        <EtNumber.Value variant="num-ml" style={valueStyle} />
      </EtNumber>
      <EtText variant="caption-medium" style={labelStyle}>
        {label}
      </EtText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    gap: X1,
    paddingVertical: X2,
  },
});
