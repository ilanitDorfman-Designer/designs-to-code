import { memo, useMemo } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';
import Animated, { type SharedValue, useAnimatedStyle } from 'react-native-reanimated';

import { useEtoroTheme } from '../../../core/hooks';
import { X6 } from '../../../core/styles';

const SEGMENT_HEIGHT = 4;
const SEGMENT_GAP = 2;
const SEGMENT_RADIUS = 16;
const BACKGROUND_OPACITY = 0.08;

export interface TopbarStepProgressProps extends Omit<ViewProps, 'children'> {
  /** Total number of segments */
  steps: number;
  /** 0-based index of the active step */
  currentStep: number;
  /** Animated 0-1 fill of the current segment */
  stepProgress?: SharedValue<number>;
  /**
   * Shared value tracking which step is currently being animated.
   * When provided, segment fill is driven entirely on the UI thread,
   * preventing flicker during step transitions.
   */
  animatingStep?: SharedValue<number>;
  /** Override fill color (defaults to theme textPrimaryNeutral) */
  color?: string;
}

function SegmentFill({ progress, color }: { progress: SharedValue<number>; color: string }) {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: progress.get() }],
  }));

  return <Animated.View style={[styles.segmentFill, { backgroundColor: color }, animatedStyle]} />;
}

function AnimatedSegmentFill({
  index,
  progress,
  animatingStep,
  color,
}: {
  index: number;
  progress: SharedValue<number>;
  animatingStep: SharedValue<number>;
  color: string;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    'worklet';
    if (index < animatingStep.get()) return { transform: [{ scaleX: 1 }] };
    if (index > animatingStep.get()) return { transform: [{ scaleX: 0 }] };
    return { transform: [{ scaleX: progress.get() }] };
  });

  return <Animated.View style={[styles.segmentFill, { backgroundColor: color }, animatedStyle]} />;
}

const MemoizedSegmentFill = memo(SegmentFill);
const MemoizedAnimatedSegmentFill = memo(AnimatedSegmentFill);

export function TopbarStepProgress({
  steps: rawSteps,
  currentStep: rawCurrentStep,
  stepProgress,
  animatingStep,
  color,
  style,
  ...rest
}: TopbarStepProgressProps) {
  const { colors } = useEtoroTheme();
  const fillColor = color ?? colors.carbon900;

  const steps = Math.max(0, Math.floor(rawSteps) || 0);
  // `currentStep === steps` is intentionally supported as an "all complete" sentinel
  // for non-animated usage where callers pass `lastIndex + 1`.
  const currentStep = Math.max(0, Math.min(Math.floor(rawCurrentStep) || 0, steps));

  const backgroundColorStyle = useMemo(() => ({ backgroundColor: fillColor, opacity: BACKGROUND_OPACITY }), [fillColor]);

  const filledStyle = useMemo(() => ({ backgroundColor: fillColor }), [fillColor]);

  const segments = useMemo(() => Array.from({ length: steps }, (_, i) => i), [steps]);

  return (
    <View style={[styles.container, style]} {...rest}>
      <View style={styles.segmentsRow}>
        {segments.map((index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <View key={index} style={styles.segment}>
              <View style={[styles.segmentBackground, backgroundColorStyle]} />
              {stepProgress && animatingStep ? (
                <MemoizedAnimatedSegmentFill index={index} progress={stepProgress} animatingStep={animatingStep} color={fillColor} />
              ) : (
                <>
                  {isCompleted && <View style={[styles.segmentCompleted, filledStyle]} />}
                  {isCurrent && stepProgress && <MemoizedSegmentFill progress={stepProgress} color={fillColor} />}
                </>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}

TopbarStepProgress.displayName = 'TopbarStepProgress';
TopbarStepProgress.etTopbarStepProgress = true;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: X6,
    width: '100%',
  },
  segmentsRow: {
    flexDirection: 'row',
    gap: SEGMENT_GAP,
    height: SEGMENT_HEIGHT,
    borderRadius: SEGMENT_HEIGHT,
    overflow: 'hidden',
  },
  segment: {
    flex: 1,
    height: SEGMENT_HEIGHT,
    borderRadius: SEGMENT_RADIUS,
    overflow: 'hidden',
    position: 'relative',
  },
  segmentBackground: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: SEGMENT_RADIUS,
  },
  segmentCompleted: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: SEGMENT_RADIUS,
  },
  segmentFill: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: SEGMENT_RADIUS,
    transformOrigin: 'left center',
  },
});
