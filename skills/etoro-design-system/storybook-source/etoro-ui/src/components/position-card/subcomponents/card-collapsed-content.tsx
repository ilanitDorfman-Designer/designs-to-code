import { memo } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { usePositionCardContext } from '../api/context';
import { CardCollapsedContentProps } from '../api/types';
import { useSlotHeight } from '../use-slot-height';

/**
 * EtPositionCard.CollapsedContent - Container for collapsed-only chrome
 * (e.g. a divider, or a "Net Value" label) that exists when the card is folded
 * and disappears when it expands.
 *
 * It is the inverse of `ExpandedContent`: its height animates to its natural
 * size while collapsed and to 0 while expanded. Animating the height (instead of
 * mounting/unmounting on the `isExpanded` flip) keeps the fold smooth — the
 * chrome shrinks in lockstep with the expanded content growing, so the footer
 * never jolts ("ticks") at the start of the animation.
 *
 * Self-animating, so it can live anywhere in the card tree (top level, or nested
 * inside a Footer).
 */
function CardCollapsedContentComponent({ children }: CardCollapsedContentProps) {
  const { isExpanded, disableExpandAnimation } = usePositionCardContext();
  // Collapsed chrome is "open" (visible) when the card is NOT expanded.
  const { heightValue, onContentLayout } = useSlotHeight(!isExpanded);

  if (disableExpandAnimation) {
    return isExpanded ? null : <View>{children}</View>;
  }

  return (
    <Animated.View style={[styles.container, { height: heightValue }]}>
      <View style={styles.measure} onLayout={onContentLayout}>
        {children}
      </View>
    </Animated.View>
  );
}

export const CardCollapsedContent = memo(CardCollapsedContentComponent);
CardCollapsedContent.displayName = 'EtPositionCard.CollapsedContent';

const styles = StyleSheet.create({
  container: {
    // Height is animated (RN Animated.Value); clip the content as it collapses.
    overflow: 'hidden',
  },
  measure: {
    // Absolute so the natural content height is measured independently of the
    // animated outer height.
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
  },
});
