import { memo, useEffect, useRef, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { useEtoroTheme } from '../../../core/hooks';
import { primaryV2 } from '../../../core/styles/colors/primitives';
import { EtStepIndicatorProps, stepIndicatorFillTimingConfig } from './api';
import { StepIndicatorStep } from './subcomponents';

const DEFAULT_SIZE = 10;
const TRACK_HEIGHT_RATIO = 0.25;
const REACHED_EPSILON = 1e-6;

/**
 * Horizontal step indicator with a progress track, a dot per step and step
 * labels underneath (e.g. onboarding: Profile → Verification → Deposit).
 *
 * The track runs from the first dot center to the last dot center. The fill is
 * interpolated between measured dot centers, so it always ends exactly on a
 * dot at integer step positions. Dots the fill reaches are tinted in the fill
 * The filled portion of the track (and every dot it reaches) is tinted in the
 * fill color; the active step gets a larger dot and an emphasized label. An
 * active step ahead of the fill keeps the track-colored dot until the fill
 * catches up. Fill changes animate with an ease-out slide.
 *
 * @example Default fill (up to the active step)
 * ```tsx
 * <EtStepIndicator steps={['Profile', 'Verification', 'Deposit']} currentStep={1} />
 * ```
 *
 * @example Explicit fill, first step active (Figma onboarding card)
 * ```tsx
 * <EtStepIndicator steps={['Profile', 'Verification', 'Deposit']} currentStep={0} progress={0.5} />
 * ```
 *
 * @example Custom size and colors (e.g. on a gradient card)
 * ```tsx
 * <EtStepIndicator
 *   steps={['Profile', 'Verification', 'Deposit']}
 *   currentStep={0}
 *   size={12}
 *   trackColor="rgba(255, 255, 255, 0.25)"
 *   labelColor="rgba(255, 255, 255, 0.55)"
 * />
 * ```
 */
function EtStepIndicatorBase({
  steps,
  currentStep: rawCurrentStep,
  progress,
  size = DEFAULT_SIZE,
  color = primaryV2[400],
  trackColor,
  activeLabelColor,
  labelColor,
  style,
  testID,
}: EtStepIndicatorProps) {
  const { colors } = useEtoroTheme();

  if (__DEV__ && steps.length < 2) {
    console.warn('EtStepIndicator: at least 2 steps are required.');
  }

  const resolvedTrackColor = trackColor ?? colors.dividerQuinary;
  const resolvedActiveLabelColor = activeLabelColor ?? colors.textPrimaryNeutral;

  const trackHeight = size * TRACK_HEIGHT_RATIO;
  const trackTop = (size - trackHeight) / 2;
  const trackRadius = trackHeight / 2;

  const lastIndex = Math.max(steps.length - 1, 1);
  const currentStep = Math.max(0, Math.min(Math.floor(rawCurrentStep) || 0, steps.length - 1));
  const clampedProgress = Math.max(0, Math.min(progress ?? currentStep / lastIndex, 1));

  // Dot centers are measured from each step column's layout so the track and
  // fill span exactly from the first dot to the last dot, whatever the labels'
  // widths are.
  const [dotCenters, setDotCenters] = useState<Record<number, number>>({});

  const handleStepLayout = (index: number) => (event: LayoutChangeEvent) => {
    const { x, width } = event.nativeEvent.layout;
    const center = index === 0 ? x + size / 2 : x + width / 2;
    setDotCenters((prev) => (prev[index] === center ? prev : { ...prev, [index]: center }));
  };

  const measuredCenters: number[] = [];
  for (let index = 0; index < steps.length; index++) {
    const center = dotCenters[index];
    if (center === undefined) break;
    measuredCenters.push(center);
  }

  const trackStart = measuredCenters[0] ?? 0;
  const trackEnd = measuredCenters[steps.length - 1] ?? 0;
  const isMeasured = steps.length >= 2 && measuredCenters.length === steps.length && trackEnd > trackStart;
  const trackWidth = isMeasured ? trackEnd - trackStart : 0;

  // Dots are laid out by their label columns, so they are not evenly spaced
  // along the track. Interpolate the fill piecewise between measured dot
  // centers so integer step positions land exactly on their dots.
  const stepUnits = clampedProgress * lastIndex;
  const lowerIndex = Math.min(Math.floor(stepUnits), lastIndex - 1);
  const fraction = stepUnits - lowerIndex;
  const lowerCenter = measuredCenters[lowerIndex] ?? 0;
  const upperCenter = measuredCenters[lowerIndex + 1] ?? 0;
  const fillWidth = isMeasured ? lowerCenter + fraction * (upperCenter - lowerCenter) - trackStart : 0;

  // Drives the fill width so progress changes slide instead of snapping. The
  // first measured frame snaps to its width so mounting shows no unwanted slide.
  const animatedWidth = useSharedValue(0);
  const hasMeasured = useRef(false);

  useEffect(() => {
    if (!isMeasured) return;

    if (!hasMeasured.current) {
      hasMeasured.current = true;
      animatedWidth.value = fillWidth;
      return;
    }

    animatedWidth.value = withTiming(fillWidth, stepIndicatorFillTimingConfig);
  }, [isMeasured, fillWidth, animatedWidth]);

  const animatedFillStyle = useAnimatedStyle(() => ({ width: animatedWidth.value }));

  return (
    <View style={[styles.container, style]} testID={testID}>
      {isMeasured && (
        <View
          pointerEvents="none"
          style={[
            styles.track,
            {
              left: trackStart,
              width: trackWidth,
              top: trackTop,
              height: trackHeight,
              borderRadius: trackRadius,
              backgroundColor: resolvedTrackColor,
            },
          ]}
          testID={testID ? `${testID}-track` : undefined}
        >
          <Animated.View
            style={[styles.fill, { borderRadius: trackRadius, backgroundColor: color }, animatedFillStyle]}
            testID={testID ? `${testID}-fill` : undefined}
          />
        </View>
      )}
      <View style={styles.stepsRow}>
        {steps.map((label, index) => {
          const isActive = index === currentStep;
          // Dot tint follows the fill only — an active step ahead of the fill
          // (e.g. Deposit at progress 0.75) stays larger + bold label but uses
          // the track color until the fill reaches it, so the line never ends
          // short of a green "completed" dot.
          const isReached = clampedProgress * lastIndex + REACHED_EPSILON >= index;

          return (
            <StepIndicatorStep
              key={index}
              label={label}
              isActive={isActive}
              size={size}
              dotColor={isReached ? color : resolvedTrackColor}
              labelColor={isActive ? resolvedActiveLabelColor : labelColor}
              alignment={index === 0 ? 'start' : 'center'}
              onLayout={handleStepLayout(index)}
              testID={testID ? `${testID}-step-${index}` : undefined}
            />
          );
        })}
      </View>
    </View>
  );
}

EtStepIndicatorBase.displayName = 'EtStepIndicator';

export const EtStepIndicator = memo(EtStepIndicatorBase);

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  track: {
    position: 'absolute',
    overflow: 'hidden',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
