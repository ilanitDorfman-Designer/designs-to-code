import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { useEtoroTheme } from '../../../core/hooks';
import { X2 } from '../../../core/styles/spacing';
import { EtText } from '../../../foundations/text';
import { EtSkeleton } from '../../status/skeleton/et-skeleton';
import { usePositionCardContext } from '../api/context';
import { CardStatRowProps } from '../api/types';

/**
 * EtPositionCard.StatRow - Displays a label + value stat row.
 *
 * Example: "Today's Return" | "$699.95 (69.3%)"
 */
function CardStatRowComponent({ label, value }: CardStatRowProps) {
  const { isLoading, variant } = usePositionCardContext();
  const { colors } = useEtoroTheme();

  // Determine if value represents a change (contains parentheses)
  const valueAsString = typeof value === 'string' ? value : typeof value === 'number' ? String(value) : '';
  const isValueTypeOfChange = (typeof value === 'string' || typeof value === 'number') && valueAsString.includes('(') && valueAsString.includes(')');

  // Determine color based on variant: positive = green, negative = red, neutral = default
  const getChangeValueColor = () => {
    if (!isValueTypeOfChange) return colors.carbon900;

    switch (variant) {
      case 'positive':
        return colors.verdictPositive600;
      case 'negative':
        return colors.verdictNegative600;
      default:
        return colors.carbon900; // neutral
    }
  };
  const changeValueColor = getChangeValueColor();

  if (isLoading) {
    return (
      <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.container}>
        <EtSkeleton width={100} height={16} variant="text" />
        <EtSkeleton width={80} height={16} variant="text" />
      </Animated.View>
    );
  }

  const renderRowBody = () => (
    <>
      <EtText variant="body-secondary-regular" style={{ color: colors.carbon600 }}>
        {label}
      </EtText>
      {typeof value === 'string' || typeof value === 'number' ? (
        <EtText variant="num-sm" style={{ color: changeValueColor }}>
          {value}
        </EtText>
      ) : React.isValidElement(value) ? (
        value
      ) : null}
    </>
  );

  // No per-row reveal animation: the expanded container animates its height
  // (see EtPositionCard's useExpandHeight), so the row reveals in sync with the
  // fold/unfold. A separate fade here would desync and look janky.
  return <View style={styles.container}>{renderRowBody()}</View>;
}

export const CardStatRow = memo(CardStatRowComponent);
CardStatRow.displayName = 'EtPositionCard.StatRow';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: X2,
  },
});
