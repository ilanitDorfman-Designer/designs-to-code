import { useEffect } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { AnimatedStyle, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

export function useExpandedContentAnimation(
  isExpanded: boolean,
  animationDuration = 200,
  delay = 200,
  initialTranslateY = 10,
): AnimatedStyle<StyleProp<ViewStyle>> {
  // Seed from the initial expanded state so a card that mounts already expanded
  // shows its content immediately (no fade-in on mount); the fade only plays on
  // an actual expand/collapse toggle.
  const opacity = useSharedValue(isExpanded ? 1 : 0);
  const translateY = useSharedValue(isExpanded ? 0 : initialTranslateY);

  useEffect(() => {
    if (isExpanded) {
      opacity.value = withDelay(delay, withTiming(1, { duration: animationDuration }));
      translateY.value = withDelay(delay, withTiming(0, { duration: animationDuration }));
    } else {
      opacity.value = withTiming(0, { duration: animationDuration });
      translateY.value = withTiming(initialTranslateY, { duration: animationDuration });
    }
  }, [isExpanded, opacity, translateY, animationDuration, delay, initialTranslateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return animatedStyle;
}
