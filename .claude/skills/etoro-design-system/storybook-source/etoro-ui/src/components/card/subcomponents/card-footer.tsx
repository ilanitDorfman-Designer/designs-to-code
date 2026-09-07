import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { CardFooterProps } from '../api/types';

/**
 * EtCard.Footer - Container for the card footer section.
 */
function CardFooterComponent({ children, style, testID }: CardFooterProps) {
  return (
    <View style={[styles.container, style]} testID={testID}>
      {children}
    </View>
  );
}

export const CardFooter = memo(CardFooterComponent);
CardFooter.displayName = 'EtCard.Footer';

const styles = StyleSheet.create({
  container: {
    // Footer has no default styles - fully flexible
  },
});
