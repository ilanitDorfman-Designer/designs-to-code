import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { X2, X6 } from '../../../core/styles/spacing';
import { CardExpandedContentProps } from '../api/types';

/**
 * EtPositionCard.ExpandedContent - Container for expanded section content.
 *
 * This section is animated in/out when the card expands/collapses.
 * The animation is handled by the parent component.
 */
function CardExpandedContentComponent({ children }: CardExpandedContentProps) {
  return <View style={styles.container}>{children}</View>;
}

export const CardExpandedContent = memo(CardExpandedContentComponent);
CardExpandedContent.displayName = 'EtPositionCard.ExpandedContent';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: X6,
    paddingTop: X2,
    paddingBottom: 0,
  },
});
