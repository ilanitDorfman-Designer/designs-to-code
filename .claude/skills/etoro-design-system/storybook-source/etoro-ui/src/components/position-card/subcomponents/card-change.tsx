import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { useEtoroTheme } from '../../../core/hooks';
import { X1, X3 } from '../../../core/styles/spacing';
import { EtText } from '../../../foundations/text';
import { EtNumber } from '../../data-display/number';
import { EtSkeleton } from '../../status/skeleton/et-skeleton';
import { usePositionCardContext } from '../api/context';
import { CardChangeProps } from '../api/types';

/**
 * EtPositionCard.Change - Displays price change with up/down indicator.
 *
 * Direction (up/down arrow, color) is automatically determined from the
 * percentage prop:
 * - Positive or zero: up arrow (green)
 * - Negative: down arrow (red)
 */
function CardChangeComponent({ value, percentage, isMasked = false }: CardChangeProps) {
  const { isLoading } = usePositionCardContext();
  const { colors } = useEtoroTheme();

  if (isLoading) {
    return <EtSkeleton style={styles.skeleton} width={60} height={12} variant="text" />;
  }

  // Direction determined by percentage sign
  const isPositive = percentage >= 0;
  const color = isPositive ? colors.verdictPositive600 : colors.verdictNegative600;
  const signedDisplayValue = Number.isFinite(value) ? (isPositive ? Math.abs(value) : -Math.abs(value)) : value;

  // Validate inputs and provide safe fallbacks for malformed values
  const formattedPercentage = Number.isFinite(percentage) ? Math.abs(percentage).toFixed(2) : '—';

  return (
    <View style={styles.container}>
      <EtNumber
        value={signedDisplayValue}
        format="number"
        showAbsoluteValue
        isColored={!isMasked}
        color={isMasked ? undefined : color}
        minDecimals={2}
        maxDecimals={2}
        fallback="—"
        isMasked={isMasked}
      >
        <EtNumber.Arrow size={8} />
        <EtNumber.Value variant="num-s" />
      </EtNumber>
      <EtText variant="num-s" style={{ color }}>
        ({formattedPercentage}%)
      </EtText>
    </View>
  );
}

export const CardChange = memo(CardChangeComponent);
CardChange.displayName = 'EtPositionCard.Change';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: X1,
  },
  skeleton: {
    marginTop: X3,
  },
});
