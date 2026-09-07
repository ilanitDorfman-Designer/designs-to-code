/* 
  This is a marquee component that is used to display a list of items
  in a horizontal scrollable area.
  copied from @animatereactnative/marquee 
**/

import React, { useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View, ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import type { SharedValue } from 'react-native-reanimated';
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useFrameCallback,
  useSharedValue,
  withDecay,
} from 'react-native-reanimated';

interface MarqueeProps {
  children: React.ReactNode;
  speed?: number;
  spacing?: number;
  reverse?: boolean;
  withGesture?: boolean;
  position?: SharedValue<number>;
  style?: ViewStyle;
}

interface AnimatedChildProps {
  index: number;
  anim: SharedValue<number>;
  contentWidth: number;
  spacing: number;
  children: React.ReactNode;
}

function AnimatedChild({ index, children, anim, contentWidth, spacing }: AnimatedChildProps) {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      left: (index - 1) * (contentWidth + spacing),
      transform: [
        {
          translateX: -(anim.value % (contentWidth + spacing)),
        },
      ],
    };
  });

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
}

export function Marquee({ children, speed = 0.5, spacing = 0, reverse = false, withGesture = false, position, style }: MarqueeProps) {
  const [contentWidth, setContentWidth] = useState(0);
  const [parentWidth, setParentWidth] = useState(0);
  const [cloneTimes, setCloneTimes] = useState(0);

  const anim = useSharedValue(0);
  const lastFrameTime = useSharedValue(0);

  const frameCallback = useFrameCallback((frameInfo) => {
    if (frameInfo.timeSincePreviousFrame === null) return;

    // Use our own frame timing to avoid interference
    const currentTime = frameInfo.timestamp;
    const deltaTime =
      lastFrameTime.value === 0
        ? 16.67 // ~60fps initial frame
        : currentTime - lastFrameTime.value;

    lastFrameTime.value = currentTime;

    // Normalize speed based on 60fps (16.67ms per frame)
    const normalizedSpeed = speed * (deltaTime / 16.67);

    if (reverse) {
      anim.value -= normalizedSpeed;
    } else {
      anim.value += normalizedSpeed;
    }
  }, true);

  // Expose position if provided
  useDerivedValue(() => {
    if (position) {
      position.value = anim.value;
    }
  });

  // Calculate number of clones needed
  useAnimatedReaction(
    () => {
      if (contentWidth === 0 || parentWidth === 0) {
        return 0;
      }
      return Math.round(parentWidth / contentWidth) + 2;
    },
    (v) => {
      if (v === 0) return;
      runOnJS(setCloneTimes)(v * 2); // Double for smooth infinite scroll
    },
    [contentWidth, parentWidth],
  );

  const start = () => {
    lastFrameTime.value = 0; // Reset timing to avoid jumps
    frameCallback.setActive(true);
  };

  const stop = () => {
    frameCallback.setActive(false);
  };

  const pan = Gesture.Pan()
    .enabled(withGesture)
    .onBegin(() => {
      'worklet';
      runOnJS(stop)();
    })
    .onChange((e) => {
      'worklet';
      anim.value -= e.changeX;
    })
    .onFinalize((e) => {
      'worklet';
      anim.value = withDecay(
        {
          velocity: -e.velocityX,
        },
        (finished) => {
          if (finished) {
            runOnJS(start)();
          }
        },
      );
    });

  const handleParentLayout = (event: LayoutChangeEvent) => {
    setParentWidth(event.nativeEvent.layout.width);
  };

  const handleContentLayout = (event: LayoutChangeEvent) => {
    setContentWidth(event.nativeEvent.layout.width);
  };

  return (
    <Animated.View style={[styles.container, style]} onLayout={handleParentLayout} pointerEvents="box-none">
      <GestureDetector gesture={pan}>
        <Animated.View style={styles.content} pointerEvents="box-none">
          {/* Hidden view to measure content */}
          <View style={styles.hidden} onLayout={handleContentLayout}>
            {children}
          </View>

          {/* Render clones for infinite scrolling */}
          {cloneTimes > 0 &&
            [...Array(cloneTimes).keys()].map((index) => (
              <AnimatedChild key={`clone-${index}`} index={index} anim={anim} contentWidth={contentWidth} spacing={spacing}>
                {children}
              </AnimatedChild>
            ))}
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    flexDirection: 'row',
  },
  content: {
    flexDirection: 'row',
  },
  hidden: {
    opacity: 0,
    zIndex: -9999,
  },
});
