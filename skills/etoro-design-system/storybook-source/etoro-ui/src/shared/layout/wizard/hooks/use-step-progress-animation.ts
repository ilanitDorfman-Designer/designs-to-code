import { useCallback, useEffect, useRef } from 'react';
import { cancelAnimation, Easing, useSharedValue, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

const DEFAULT_STEP_DURATION = 5000;

interface UseStepProgressAnimationParams {
  currentStep: number;
  autoPlay: boolean;
  stepDuration?: number;
  onSegmentComplete: () => void;
}

export function useStepProgressAnimation({
  currentStep,
  autoPlay,
  stepDuration = DEFAULT_STEP_DURATION,
  onSegmentComplete,
}: UseStepProgressAnimationParams) {
  const stepProgress = useSharedValue(0);
  const animatingStep = useSharedValue(currentStep);
  const isPaused = useRef(false);
  const pausedAt = useRef(0);
  const onSegmentCompleteRef = useRef(onSegmentComplete);
  onSegmentCompleteRef.current = onSegmentComplete;

  const fireSegmentComplete = useCallback(() => {
    onSegmentCompleteRef.current();
  }, []);

  const startAnimation = useCallback(
    (fromValue = 0) => {
      if (!autoPlay) return;
      const clampedFrom = Math.max(0, Math.min(fromValue || 0, 1));
      const safeDuration = stepDuration > 0 ? stepDuration : DEFAULT_STEP_DURATION;
      const remainingFraction = 1 - clampedFrom;
      const remainingDuration = remainingFraction * safeDuration;

      stepProgress.set(clampedFrom);
      stepProgress.set(
        withTiming(
          1,
          {
            duration: remainingDuration,
            easing: Easing.linear,
          },
          (finished) => {
            if (finished) {
              scheduleOnRN(fireSegmentComplete);
            }
          },
        ),
      );
    },
    [autoPlay, stepDuration, stepProgress, fireSegmentComplete],
  );

  useEffect(() => {
    isPaused.current = false;
    pausedAt.current = 0;
    animatingStep.set(currentStep);
    cancelAnimation(stepProgress);
    stepProgress.set(0);

    if (autoPlay) {
      startAnimation(0);
    }

    return () => {
      cancelAnimation(stepProgress);
    };
  }, [currentStep, autoPlay, startAnimation, stepProgress, animatingStep]);

  const pause = useCallback(() => {
    if (!autoPlay || isPaused.current) return;
    isPaused.current = true;
    pausedAt.current = stepProgress.get();
    cancelAnimation(stepProgress);
  }, [autoPlay, stepProgress]);

  const resume = useCallback(() => {
    if (!autoPlay || !isPaused.current) return;
    isPaused.current = false;
    startAnimation(pausedAt.current);
    pausedAt.current = 0;
  }, [autoPlay, startAnimation]);

  return { stepProgress, animatingStep, pause, resume };
}
