import { useCallback, useEffect, useState } from 'react';
import { LayoutChangeEvent, StyleProp, ViewStyle } from 'react-native';
import { AnimatedStyle, Easing, useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated';

import { ExpandDirection } from '../api/types';

const ANIMATION_DURATION = 300;

interface UseExpandAnimationOptions {
  isExpanded: boolean;
  expandDirection: ExpandDirection;
}

interface UseExpandAnimationResult {
  /** Animated style for the expanded content container */
  expandedContentStyle: AnimatedStyle<StyleProp<ViewStyle>>;

  /** Handler for measuring expanded content height */
  onExpandedContentLayout: (event: LayoutChangeEvent) => void;

  /** Whether the expanded content has been measured */
  isMeasured: boolean;
}

/**
 * Hook that manages the expand/collapse animation for the card.
 *
 * Uses react-native-reanimated for smooth height transitions.
 *
 * @param isExpanded - Whether the card is expanded
 * @param expandDirection - Direction of reveal: 'down' (top-to-bottom) or 'center' (bidirectional)
 */
export function useExpandAnimation({ isExpanded, expandDirection }: UseExpandAnimationOptions): UseExpandAnimationResult {
  const [isMeasured, setIsMeasured] = useState(false);
  const contentHeight = useSharedValue(0);
  const animatedHeight = useSharedValue(0);

  // Make expandDirection reactive so the worklet can respond to changes
  const sharedExpandDirection = useDerivedValue(() => {
    return expandDirection === 'center' ? 'center' : 'down';
  }, [expandDirection]);

  // Animate to target height when expanded state changes.
  // No cleanup cancellation — assigning a new withTiming to a shared value
  // automatically replaces the previous animation. An explicit cancelAnimation
  // in the cleanup races with the subsequent withTiming on the UI thread,
  // which can prevent the new animation from starting.
  useEffect(() => {
    if (isMeasured) {
      const targetHeight = isExpanded ? contentHeight.value : 0;
      animatedHeight.value = withTiming(targetHeight, {
        duration: ANIMATION_DURATION,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    }
  }, [isExpanded, isMeasured, contentHeight, animatedHeight]);

  const expandedContentStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      height: animatedHeight.value,
      overflow: 'hidden',
      // 'down': content aligned to top, reveals downward
      // 'center': content centered, reveals bidirectionally
      justifyContent: sharedExpandDirection.value === 'center' ? 'center' : 'flex-start',
    };
  }, [sharedExpandDirection]);

  const onExpandedContentLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { height } = event.nativeEvent.layout;

      if (height > 0 && !isMeasured) {
        contentHeight.value = height;
        setIsMeasured(true);

        // If starting expanded, set initial height immediately
        if (isExpanded) {
          animatedHeight.value = height;
        }
      }
    },
    [isMeasured, isExpanded, contentHeight, animatedHeight],
  );

  return {
    expandedContentStyle,
    onExpandedContentLayout,
    isMeasured,
  };
}
