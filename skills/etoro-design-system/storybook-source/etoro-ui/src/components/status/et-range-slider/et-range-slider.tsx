import { LinearGradient } from 'expo-linear-gradient';
import { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { clamp, Extrapolation, interpolate, runOnJS, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

import { useEtoroTheme } from '../../../core/hooks/use-etoro-theme';
import { X3, X4, X6 } from '../../../core/styles/spacing';
import { EtText } from '../../../foundations/text/et-text';
import { isRTL, rtlSign } from '../../../utils/rtl';
import { EtRangeSliderProps } from './api';
import { TrackBars } from './subcomponents/track-bars';

const BAR_COUNT = 13;
const BAR_WIDTH = 1;
/** Bar height in px; matches spacing X5 (20) */
const BAR_HEIGHT = 20;
const EDGE_GAP = X3;
const CONTAINER_PADDING = X6;
/** Thumb height in px; matches spacing X6 (24) */
const THUMB_BASE_HEIGHT = 24;
const THUMB_BASE_WIDTH = 2;
const HIT_SLOP_VERTICAL = X4;
const HIT_SLOP_HORIZONTAL = X6;
const STEP_RATIO = 0.005; // 0.5% increments

function EtRangeSliderComponent({
  min = 0,
  max = 100,
  value,
  onValueChange,
  cursorColor = 'positive',
  minLabel = 'MIN',
  maxLabel = 'MAX',
  testID,
}: EtRangeSliderProps) {
  const { colors } = useEtoroTheme();
  const startNormalized = useSharedValue(0);
  const trackWidthValue = useSharedValue(0);
  const isDragging = useSharedValue(false);
  const isDraggingRef = useRef(false);
  // Capture once — RTL only changes across a full app reload after language switch.
  const rtl = isRTL();
  const directionSign = rtlSign();

  const setDraggingTrue = useCallback(() => {
    isDraggingRef.current = true;
  }, []);
  const setDraggingFalse = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  const isZeroSpan = useMemo(() => max === min, [min, max]);
  const span = useMemo(() => (isZeroSpan ? 1 : max - min), [isZeroSpan, min, max]);
  const resolvedValue = value ?? (isZeroSpan ? min : min + span / 2);
  const thumbHeight = THUMB_BASE_HEIGHT;
  const thumbWidth = (thumbHeight / THUMB_BASE_HEIGHT) * THUMB_BASE_WIDTH;

  const position = useSharedValue(0.5);

  const updateSharedFromValue = useCallback(
    (nextValue: number) => {
      if (isZeroSpan) {
        position.value = 0.5;
        return;
      }
      const normalized = interpolate(nextValue, [min, max], [0, 1], Extrapolation.CLAMP);

      position.value = clamp(Math.round(normalized / STEP_RATIO) * STEP_RATIO, 0, 1);
    },
    [isZeroSpan, min, max, position],
  );

  useEffect(() => {
    if (isDraggingRef.current) return;
    updateSharedFromValue(resolvedValue);
  }, [resolvedValue, updateSharedFromValue]);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;

    trackWidthValue.value = Math.max(0, width);
  };

  const gesture = useMemo(() => {
    const pan = Gesture.Pan()
      .hitSlop({
        top: HIT_SLOP_VERTICAL,
        bottom: HIT_SLOP_VERTICAL,
        left: HIT_SLOP_HORIZONTAL,
        right: HIT_SLOP_HORIZONTAL,
      })
      .activeOffsetX([-10, 10])
      .failOffsetY([-8, 8])
      .onBegin(() => {
        isDragging.value = true;
        startNormalized.value = position.value;
        runOnJS(setDraggingTrue)();
      })
      .onUpdate((evt) => {
        const width = trackWidthValue.value;
        if (width <= 0) return;
        if (isZeroSpan) {
          position.value = 0.5;
          if (onValueChange) {
            runOnJS(onValueChange)(min);
          }
          return;
        }
        // translationX is physical; rtlSign mirrors drag toward the end edge.
        const delta = (evt.translationX * directionSign) / width;
        const normalized = clamp(startNormalized.value + delta, 0, 1);
        const quantized = clamp(Math.round(normalized / STEP_RATIO) * STEP_RATIO, 0, 1);
        position.value = quantized;
        if (onValueChange) {
          const next = min + quantized * span;
          runOnJS(onValueChange)(next);
        }
      })
      .onEnd(() => {
        isDragging.value = false;
        if (onValueChange) {
          const next = isZeroSpan ? min : min + position.value * span;
          runOnJS(onValueChange)(next);
        }
        runOnJS(setDraggingFalse)();
      })
      .onFinalize(() => {
        isDragging.value = false;
        runOnJS(setDraggingFalse)();
      });

    const tap = Gesture.Tap()
      .maxDuration(250)
      .onEnd((evt) => {
        const width = trackWidthValue.value;
        if (width <= 0) return;
        if (isZeroSpan) {
          position.value = 0.5;
          if (onValueChange) {
            runOnJS(onValueChange)(min);
          }
          return;
        }
        const normalized = clamp(rtl ? 1 - evt.x / width : evt.x / width, 0, 1);

        position.value = clamp(Math.round(normalized / STEP_RATIO) * STEP_RATIO, 0, 1);
        if (onValueChange) {
          const next = min + position.value * span;
          runOnJS(onValueChange)(next);
        }
      });

    return Gesture.Simultaneous(pan, tap);
  }, [
    isZeroSpan,
    min,
    onValueChange,
    position,
    span,
    trackWidthValue,
    startNormalized,
    isDragging,
    setDraggingTrue,
    setDraggingFalse,
    rtl,
    directionSign,
  ]);

  const animatedThumbStyle = useAnimatedStyle(() => {
    const width = trackWidthValue.value;
    const maxTranslate = Math.max(width - thumbWidth, 0);
    // `left: 0` swaps to the start edge in RTL; translateX is physical so
    // multiply by rtlSign to walk toward the end edge as value increases.
    const target = position.value * maxTranslate * directionSign;
    return {
      transform: [
        {
          translateX: target,
        },
      ],
    };
  }, [thumbWidth, directionSign]);

  return (
    <View
      style={[
        styles.container,
        {
          paddingHorizontal: CONTAINER_PADDING,
          backgroundColor: colors.bgNeutralSecondary,
        },
      ]}
      testID={testID}
    >
      <EtText variant="body-tiny-regular" style={[styles.label, { color: colors.textSecondaryNeutral }]}>
        {minLabel}
      </EtText>
      <View style={{ width: EDGE_GAP }} />
      <GestureDetector gesture={gesture}>
        <View style={styles.trackWrapper} onLayout={handleLayout}>
          <View style={styles.trackTouchable} collapsable={false}>
            <TrackBars barCount={BAR_COUNT} barWidth={BAR_WIDTH} barHeight={BAR_HEIGHT} barColor={colors.dividerTertiary} />
            <Animated.View
              style={[
                styles.thumbWrapper,
                {
                  width: thumbWidth,
                  height: thumbHeight,
                  borderRadius: thumbWidth / 2,
                },
                animatedThumbStyle,
              ]}
              testID={testID ? `${testID}-cursor` : undefined}
              accessibilityLabel={`cursor-${cursorColor}`}
            >
              <LinearGradient
                colors={
                  cursorColor === 'negative'
                    ? [colors.negativeGradientPrimary50 ?? '#FF8680', colors.negativeGradientPrimary70 ?? '#FF8680']
                    : [colors.positiveGradientPrimary50 ?? '#13C636', colors.positiveGradientPrimary70 ?? '#13C636']
                }
                start={{ x: 0, y: 0.5 }}
                end={{ x: 0, y: 1 }}
                style={[StyleSheet.absoluteFill, { borderRadius: thumbWidth / 2 }]}
              />
            </Animated.View>
            {/* Overlays are positioned logically (start/end) but gradient ramps
                are physical (x: 0 → 1 is always left → right), so in RTL each
                overlay must reverse its ramp to keep the opaque side on the
                outer edge and the fade facing the track. */}
            <LinearGradient
              pointerEvents="none"
              colors={rtl ? [colors.bgBaseScrollPrimary, colors.bgNeutralSecondary] : [colors.bgNeutralSecondary, colors.bgBaseScrollPrimary]}
              locations={[0, 1]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={[styles.edgeGradient, styles.edgeGradientStart]}
            />
            <LinearGradient
              pointerEvents="none"
              colors={rtl ? [colors.bgNeutralSecondary, colors.bgBaseScrollPrimary] : [colors.bgBaseScrollPrimary, colors.bgNeutralSecondary]}
              locations={[0, 1]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={[styles.edgeGradient, styles.edgeGradientEnd]}
            />
          </View>
        </View>
      </GestureDetector>
      <View style={{ width: EDGE_GAP }} />
      <EtText variant="body-tiny-regular" style={[styles.label, { color: colors.textSecondaryNeutral }]}>
        {maxLabel}
      </EtText>
    </View>
  );
}

export const EtRangeSlider = memo(EtRangeSliderComponent);
EtRangeSlider.displayName = 'EtRangeSlider';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: X4,
    paddingHorizontal: X6,
    gap: 0,
  },
  label: {
    textTransform: 'uppercase',
  },
  trackWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  trackTouchable: {
    width: '100%',
    height: BAR_HEIGHT,
    justifyContent: 'center',
    position: 'relative',
  },
  thumbWrapper: {
    position: 'absolute',
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOpacity: 0.08,
    shadowRadius: X3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
    zIndex: 3,
  },
  edgeGradient: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '25%',
    zIndex: 2,
  },
  edgeGradientStart: {
    start: 0,
  },
  edgeGradientEnd: {
    end: 0,
  },
});
