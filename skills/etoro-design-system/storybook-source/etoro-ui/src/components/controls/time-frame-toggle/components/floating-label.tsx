import { useEffect } from 'react';
import { LayoutChangeEvent, StyleSheet } from 'react-native';
import Animated, { interpolateColor, SharedValue, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { useEtoroTheme } from '../../../../core/hooks';
import { X2, X3 } from '../../../../core/styles/spacing';
import { OptionLayout } from '../api/types';

const COLOR_TRANSITION_MS = 300;

interface FloatingLabelProps {
  value: number;
  /** Live indicator metrics (x + width) interpolated on the UI thread. */
  indicator: SharedValue<OptionLayout>;
}

export function FloatingLabel({ value, indicator }: FloatingLabelProps) {
  const { colors } = useEtoroTheme();
  const labelWidth = useSharedValue(0);

  const isPositive = value >= 0;
  // For positive: "+12.45%", for negative: "-12.45%"
  const displayValue = isPositive ? `+${value.toFixed(2)}%` : `-${Math.abs(value).toFixed(2)}%`;

  // 0 = negative, 1 = positive — drives all color transitions
  const colorProgress = useSharedValue(isPositive ? 1 : 0);

  useEffect(() => {
    colorProgress.set(
      withTiming(isPositive ? 1 : 0, {
        duration: COLOR_TRANSITION_MS,
      }),
    );
  }, [isPositive, colorProgress]);

  const handleLayout = (event: LayoutChangeEvent) => {
    labelWidth.value = event.nativeEvent.layout.width;
  };

  // Follows the indicator centre. Tracks the same SharedValue the ring uses,
  // so the label slides with the indicator instead of jumping.
  const positionStyle = useAnimatedStyle(() => {
    const { x, width } = indicator.value;
    return {
      opacity: width > 0 && labelWidth.value > 0 ? 1 : 0,
      transform: [{ translateX: x + width / 2 - labelWidth.value / 2 }],
    };
  });

  const animatedBgStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(colorProgress.get(), [0, 1], [colors.verdictNegative600Opacity15, colors.verdictPositive600Opacity15]),
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    color: interpolateColor(colorProgress.get(), [0, 1], [colors.verdictNegative600, colors.verdictPositive600]),
  }));

  return (
    <Animated.View style={[styles.container, positionStyle]} onLayout={handleLayout}>
      <Animated.View style={[styles.labelContainer, animatedBgStyle]}>
        <Animated.Text allowFontScaling={false} style={[styles.text, animatedTextStyle]}>
          {displayValue}
        </Animated.Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: -40,
    // Parent options row is LTR-locked, so `left: 0` is always the physical left.
    left: 0,
  },
  labelContainer: {
    paddingHorizontal: X3,
    paddingTop: 6,
    paddingBottom: X2,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Matches the 'body-tiny-medium' EtText variant, need to use style instead of variant because we have Animated.Text
  text: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: 'eToro-Medium',
  },
});
