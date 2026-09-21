import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { CardContentProps } from '../api/types';

/**
 * EtCard.Content - Generic content container for full flexibility.
 */
function CardContentComponent({ children, style, testID }: CardContentProps) {
  return (
    <View style={[styles.container, style]} testID={testID}>
      {children}
    </View>
  );
}

export const CardContent = memo(CardContentComponent);
CardContent.displayName = 'EtCard.Content';

const styles = StyleSheet.create({
  container: {
    // Content has no default styles - fully flexible
  },
});
