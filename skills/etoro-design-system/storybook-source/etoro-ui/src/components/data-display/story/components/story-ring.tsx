import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

const STROKE_WIDTH = 2;

export interface StoryRingProps {
  /** Size of the ring */
  size: number;
  /** Start color of the gradient */
  startColor: string;
  /** End color of the gradient */
  endColor: string;
  /** Test ID for testing purposes */
  testID?: string;
}

/**
 * StoryRing - Static circular ring indicator with gradient for story component
 * Used to indicate unwatched/new story state
 */
export const StoryRing = React.memo(function StoryRing({ size, startColor, endColor, testID }: StoryRingProps) {
  const radius = Math.max(0, (size - STROKE_WIDTH) / 2);

  return (
    <View style={[styles.container, { width: size, height: size }]} testID={testID}>
      <Svg width={size} height={size}>
        <Defs>
          <LinearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={startColor} />
            <Stop offset="100%" stopColor={endColor} />
          </LinearGradient>
        </Defs>
        <Circle cx={size / 2} cy={size / 2} r={radius} stroke="url(#ringGradient)" strokeWidth={STROKE_WIDTH} fill="none" />
      </Svg>
    </View>
  );
});
StoryRing.displayName = 'StoryRing';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
