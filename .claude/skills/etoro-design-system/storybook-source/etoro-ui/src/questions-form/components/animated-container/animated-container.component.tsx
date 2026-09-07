import type { ReactNode } from 'react';
import Animated from 'react-native-reanimated';

import { useQuestionsFormAnimations } from '../../contexts';

/**
 * Props for the AnimatedContainer component.
 */
export interface AnimatedContainerProps {
  /** Content to animate with the host-provided enter/exit transitions */
  children: ReactNode;
}

/**
 * Wraps children in `Animated.View` using the host-provided `contentEntering`
 * / `contentExiting` from `QuestionsFormAnimationsProvider`. Renders without
 * animation when no animations are provided.
 */
export function AnimatedContainer({ children }: AnimatedContainerProps) {
  const { contentEntering, contentExiting } = useQuestionsFormAnimations();
  return (
    <Animated.View entering={contentEntering} exiting={contentExiting}>
      {children}
    </Animated.View>
  );
}
