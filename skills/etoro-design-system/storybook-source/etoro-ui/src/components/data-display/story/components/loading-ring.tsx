import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedProps, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const STROKE_WIDTH = 2;

interface LoadingRingProps {
  /** Size of the ring */
  size: number;
  /** Start color of the gradient */
  startColor: string;
  /** End color of the gradient */
  endColor: string;
  /** Test ID */
  testID?: string;
}

/**
 * LoadingRing - Animated circular loading indicator with gradient
 * Renders a partial arc that rotates continuously like Instagram's loading spinner
 */
export function LoadingRing({ size, startColor, endColor, testID }: LoadingRingProps) {
  const rotation = useSharedValue(0);

  // Circle geometry
  const radius = (size - STROKE_WIDTH) / 2;
  const circumference = 2 * Math.PI * radius;
  // Show about 75% of the circle as the arc
  const arcLength = circumference * 0.75;

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 600,
        easing: Easing.linear,
      }),
      -1, // Infinite repeat
      false, // Don't reverse
    );
  }, [rotation]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference - arcLength,
    transform: [
      { translateX: size / 2 },
      { translateY: size / 2 },
      { rotate: `${rotation.value}deg` },
      { translateX: -size / 2 },
      { translateY: -size / 2 },
    ],
  }));

  return (
    <View style={[styles.container, { width: size, height: size }]} testID={testID}>
      <Svg width={size} height={size}>
        <Defs>
          <LinearGradient id="loadingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={startColor} />
            <Stop offset="100%" stopColor={endColor} />
          </LinearGradient>
        </Defs>
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#loadingGradient)"
          strokeWidth={STROKE_WIDTH}
          fill="none"
          strokeDasharray={`${arcLength} ${circumference - arcLength}`}
          strokeLinecap="round"
          animatedProps={animatedProps}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
