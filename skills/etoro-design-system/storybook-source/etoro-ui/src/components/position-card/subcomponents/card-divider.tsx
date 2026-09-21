import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { useEtoroTheme } from '../../../core/hooks';
import { X4, X6 } from '../../../core/styles/spacing';

/**
 * EtPositionCard.Divider - Horizontal divider line.
 */
function CardDividerComponent() {
  const { colors } = useEtoroTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.line, { backgroundColor: colors.carbonSecondaryDivider }]} />
    </View>
  );
}

export const CardDivider = memo(CardDividerComponent);
CardDivider.displayName = 'EtPositionCard.Divider';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: X6,
    paddingVertical: X4,
  },
  line: {
    height: 1,
    width: '100%',
  },
});
