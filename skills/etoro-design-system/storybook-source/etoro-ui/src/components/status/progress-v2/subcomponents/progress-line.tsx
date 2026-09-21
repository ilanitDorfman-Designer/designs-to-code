import { memo, useEffect, useRef, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

import { useEtoroTheme } from '../../../../core/hooks';
import { X1, X2, X3 } from '../../../../core/styles/spacing';
import { EtText } from '../../../../foundations/text/et-text';
import { progressFillEntering, progressFillLinearEasing, progressFillTimingConfig, ProgressLineProps } from '../api';

/**
 * Line variant of the progress indicator.
 * Displays a horizontal bar with optional percentage label.
 */
export const ProgressLine = memo<ProgressLineProps>(
  ({
    progress,
    size,
    color,
    showBackground,
    showLabel,
    labelText,
    style,
    testID,
    fillEntering = false,
    fillDelay = 0,
    fillDuration,
    animateOnMount = false,
    customColor,
  }) => {
    const { colors } = useEtoroTheme();
    const [containerWidth, setContainerWidth] = useState(0);

    const handleLayout = (event: LayoutChangeEvent) => {
      setContainerWidth(event.nativeEvent.layout.width);
    };

    const clampedProgress = Math.max(0, Math.min(progress, 1));
    const fillWidth = containerWidth * clampedProgress;
    const percentValue = Math.round(clampedProgress * 100);

    // Drives the fill width so value changes slide instead of snapping. The
    // first measured frame snaps to its width (so a plain bar shows no unwanted
    // slide), unless `animateOnMount` is set — then it slides in from zero so
    // the sectioned sweep plays uniformly, including the first section.
    const animatedWidth = useSharedValue(0);
    const hasMeasured = useRef(false);

    useEffect(() => {
      if (containerWidth === 0) return;

      const snapOnMount = !hasMeasured.current && !animateOnMount;
      hasMeasured.current = true;

      if (snapOnMount) {
        animatedWidth.value = fillWidth;
        return;
      }

      // Sectioned sweep passes an explicit per-section duration with linear
      // easing so every section moves at the same constant speed (one line).
      // The plain line variant keeps the default ease-out settle.
      const timingConfig = fillDuration !== undefined ? { duration: fillDuration, easing: progressFillLinearEasing } : progressFillTimingConfig;

      animatedWidth.value = fillDelay > 0 ? withDelay(fillDelay, withTiming(fillWidth, timingConfig)) : withTiming(fillWidth, timingConfig);
    }, [fillWidth, containerWidth, fillDelay, fillDuration, animateOnMount, animatedWidth]);

    const animatedFillStyle = useAnimatedStyle(() => ({ width: animatedWidth.value }));

    // The `entering` (FadeInLeft) and the width-slide both animate the fill on
    // mount. When `animateOnMount` is set (sectioned sweep), the width slide from
    // zero already provides the entrance, so running `entering` on top of it just
    // fights the slide and flickers — let the width slide own the entrance there.
    //
    // For the plain line variant, only run `entering` once the track width is
    // measured. Otherwise it fires on a 0-width fill and the width snaps in a
    // frame later, which reads as a flicker. Re-keying remounts the fill so
    // `entering` plays with the correct width.
    const animateFill = fillEntering && !animateOnMount && containerWidth > 0;

    const height = size === 'small' ? X1 : size === 'medium' ? X2 : X3;
    const borderRadius = height / 2;

    const resolvedFillColor = customColor ? colors[customColor] : color === 'positive' ? colors.bgPositivePrimary : colors.textPrimaryNeutral;

    const trackColor = showBackground ? colors.dividerQuinary : 'transparent';

    const displayLabel = labelText ?? `${percentValue}% complete`;

    return (
      <View style={[styles.container, style]} testID={testID}>
        <View
          style={[
            styles.track,
            {
              height,
              borderRadius,
              backgroundColor: trackColor,
            },
          ]}
          onLayout={handleLayout}
          testID={testID ? `${testID}-track` : undefined}
        >
          <Animated.View
            key={animateFill ? 'fill-animated' : 'fill'}
            style={[
              styles.fill,
              {
                height,
                borderRadius,
                backgroundColor: resolvedFillColor,
              },
              animatedFillStyle,
            ]}
            entering={animateFill ? progressFillEntering : undefined}
            testID={testID ? `${testID}-fill` : undefined}
          />
        </View>

        {showLabel && (
          <EtText variant="body-secondary-semibold" style={styles.label} testID={testID ? `${testID}-label` : undefined}>
            {displayLabel}
          </EtText>
        )}
      </View>
    );
  },
);

ProgressLine.displayName = 'EtProgressV2.Line';

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  label: {
    marginTop: X2,
  },
});
