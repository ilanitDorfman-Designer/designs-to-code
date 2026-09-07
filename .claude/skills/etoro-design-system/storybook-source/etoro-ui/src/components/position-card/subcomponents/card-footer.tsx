import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { X2, X6 } from '../../../core/styles/spacing';
import { CardFooterProps } from '../api/types';

/**
 * EtPositionCard.Footer - Container for the bottom section.
 *
 * Provides predefined layout for Net Value, shares info, etc.
 */
function CardFooterComponent({ children }: CardFooterProps) {
  return <View style={styles.container}>{children}</View>;
}

export const CardFooter = memo(CardFooterComponent);
CardFooter.displayName = 'EtPositionCard.Footer';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: X6,
    paddingVertical: X2,
    gap: X2,
  },
});
