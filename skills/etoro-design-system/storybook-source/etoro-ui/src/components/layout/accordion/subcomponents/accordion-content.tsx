import { memo, useCallback, useEffect, useRef } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

import { X4, X6 } from '../../../../core/styles/spacing';
import { EtAccordionContentProps } from '../api';
import { useAccordionItemContext } from '../context';
import { ANIMATION_DURATION, SPRING_CONFIG, validateEtTextChildren } from '../utils';

/**
 * EtAccordion.Content - Animated content container for accordion item
 *
 * Animates height when expanding/collapsing.
 * Uses absolute positioning to ensure content is always laid out correctly.
 *
 * @throws Error if children are not EtText components
 */
const AccordionContent = memo(function AccordionContent({ children, style, testID }: EtAccordionContentProps) {
  const { isExpanded } = useAccordionItemContext();

  // Validate that children are EtText components only
  validateEtTextChildren(children, 'EtAccordion.Content');
  const animatedHeight = useSharedValue<number | undefined>(undefined);
  const measuredHeight = useRef(0);
  const hasMeasured = useRef(false);

  // Measure content height on first layout and update if it changes
  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { height } = event.nativeEvent.layout;
      if (height <= 0) {
        return;
      }

      // First measurement: initialize measured and animated heights
      if (!hasMeasured.current) {
        hasMeasured.current = true;
        measuredHeight.current = height;
        // Set initial height based on current expanded state (no animation)
        animatedHeight.value = isExpanded ? height : 0;
        return;
      }

      // Subsequent measurements: update when content height changes
      if (height !== measuredHeight.current) {
        measuredHeight.current = height;
        // If expanded, keep the visible height in sync with content
        if (isExpanded) {
          animatedHeight.value = height;
        }
      }
    },
    [isExpanded, animatedHeight],
  );

  // React to expanded state changes after initial measurement
  // Use spring (bounce) when opening, smooth timing when closing
  useEffect(() => {
    if (hasMeasured.current) {
      if (isExpanded) {
        animatedHeight.value = withSpring(measuredHeight.current, SPRING_CONFIG);
      } else {
        animatedHeight.value = withTiming(0, { duration: ANIMATION_DURATION });
      }
    }
  }, [isExpanded, animatedHeight]);

  // Animated style for clipping container
  const containerStyle = useAnimatedStyle(() => {
    'worklet';
    // Return empty object until measured (allows natural height for measurement)
    if (animatedHeight.value === undefined) {
      return {};
    }
    return {
      height: animatedHeight.value,
    };
  });

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      {/* Inner content positioned absolutely to maintain proper layout */}
      <View onLayout={handleLayout} style={[styles.innerContent, styles.content, style]} testID={testID}>
        {children}
      </View>
    </Animated.View>
  );
});

AccordionContent.displayName = 'EtAccordion.Content';

export { AccordionContent };

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
  innerContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  content: {
    paddingBottom: X6,
    paddingRight: X4,
  },
});
