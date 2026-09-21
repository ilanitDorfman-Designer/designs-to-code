import { memo } from 'react';
import Animated, { type SharedValue, useAnimatedProps } from 'react-native-reanimated';
import { Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export type SegmentProps = {
  /** SVG center coordinate */
  center: number;
  /** Centerline radius */
  radius: number;
  /** Ring thickness */
  strokeWidth: number;
  /** Full circumference */
  circumference: number;
  /** Resolved stroke color */
  color: string;
  /** Cumulative fraction where this segment starts (0–1) */
  startFraction: number;
  /** This segment's fraction of the whole (0–1) */
  fraction: number;
  /** Static dash offset positioning the arc start */
  dashOffset: number;
  /** Global sweep progress (0→1) driving the entrance animation */
  progress: SharedValue<number>;
  /** Test ID for testing */
  testID?: string;
};

/**
 * A single animated donut arc.
 *
 * The arc's visible length is driven by the shared `progress` value: as the
 * global sweep passes over this segment's `[startFraction, startFraction+fraction]`
 * range, its dash grows from 0 to its full length — producing a clockwise
 * "draw-on" of the whole donut. When `progress` is pinned to 1 (animation off /
 * reduced motion) the arc renders fully immediately.
 */
function SegmentBase({ center, radius, strokeWidth, circumference, color, startFraction, fraction, dashOffset, progress, testID }: SegmentProps) {
  const animatedProps = useAnimatedProps(() => {
    const visibleFraction = Math.min(Math.max(progress.get() - startFraction, 0), fraction);
    const arcLength = visibleFraction * circumference;
    return {
      strokeDasharray: [arcLength, circumference - arcLength],
    };
  });

  return (
    <AnimatedCircle
      cx={center}
      cy={center}
      r={radius}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="butt"
      strokeDashoffset={dashOffset}
      animatedProps={animatedProps}
      testID={testID}
    />
  );
}

export const Segment = memo(SegmentBase);
Segment.displayName = 'EtPieChart.Segment';
