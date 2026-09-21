import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Extrapolation, interpolate, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { EtText } from '../../../../foundations/text';
import { calculateStaggerDelay, digitSpringConfig } from '../utils';

interface DigitColumnProps {
  digit: number;
  fontSize: number;
  textColor: string;
  columnIndex?: number;
  totalColumns?: number;
  animationDirection?: 'up' | 'down';
  testID?: string;
}

export function DigitColumn({ digit, fontSize, textColor, columnIndex, totalColumns, testID }: DigitColumnProps) {
  const animatedValue = useSharedValue(digit);

  // Update animation with staggered timing for better feel
  useEffect(() => {
    // Add slight delay for staggered effect (rightmost digits animate first)
    const staggerDelay = totalColumns && columnIndex !== undefined ? calculateStaggerDelay(columnIndex, totalColumns) : 0;

    const timer = setTimeout(() => {
      animatedValue.value = withSpring(digit, digitSpringConfig);
    }, staggerDelay);

    return () => clearTimeout(timer);
  }, [digit, columnIndex, totalColumns, animatedValue]);

  // Create animated style for vertical sliding with enhanced easing
  const animatedStyle = useAnimatedStyle(() => {
    const slideHeight = fontSize * 1.5;

    // Enhanced interpolation with smoother curves
    const translateY = interpolate(
      animatedValue.value,
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      [
        0,
        -slideHeight,
        -slideHeight * 2,
        -slideHeight * 3,
        -slideHeight * 4,
        -slideHeight * 5,
        -slideHeight * 6,
        -slideHeight * 7,
        -slideHeight * 8,
        -slideHeight * 9,
      ],
      Extrapolation.EXTEND,
    );

    return {
      transform: [{ translateY }],
    };
  });

  return (
    <View style={[styles.digitContainer, { height: fontSize * 1.5, width: fontSize * 0.8 }]} testID={testID || 'digit-column-container'}>
      <Animated.View style={animatedStyle}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <View key={num} style={[styles.digitTextContainer, { height: fontSize * 1.5 }]}>
            <EtText variant="label-primary-bold" style={[styles.digitText, { fontSize, color: textColor }]}>
              {num.toString()}
            </EtText>
          </View>
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  digitContainer: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  digitTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  digitText: {
    textAlign: 'center',
    lineHeight: undefined,
    fontVariant: ['tabular-nums'],
  },
});
