import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { X3, X6, X9 } from '../../../core/styles/spacing';
import { CardHeaderProps } from '../api/types';

/**
 * EtPositionCard.Header - Container for the top section.
 *
 * Provides predefined layout with:
 * - Left side: Symbol and Name (stacked)
 * - Right side: Price and Change (stacked)
 */
function CardHeaderComponent({ children }: CardHeaderProps) {
  return <View style={styles.container}>{children}</View>;
}

export const CardHeader = memo(CardHeaderComponent);
CardHeader.displayName = 'EtPositionCard.Header';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: X6,
    paddingVertical: X3,
    paddingTop: X6,
    minHeight: X9,
  },
});
