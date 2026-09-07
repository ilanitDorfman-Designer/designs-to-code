import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { CardHeaderProps } from '../api/types';

/**
 * EtCard.Header - Container for the card header section.
 */
function CardHeaderComponent({ children, style, testID }: CardHeaderProps) {
  return (
    <View style={[styles.container, style]} testID={testID}>
      {children}
    </View>
  );
}

export const CardHeader = memo(CardHeaderComponent);
CardHeader.displayName = 'EtCard.Header';

const styles = StyleSheet.create({
  container: {
    // Header has no default styles - fully flexible
  },
});
