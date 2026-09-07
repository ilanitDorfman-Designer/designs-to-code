import { memo, useState } from 'react';
import { type LayoutChangeEvent, StyleSheet } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

import { useEtoroTheme } from '../../../../core/hooks/use-etoro-theme';
import { X3 } from '../../../../core/styles/spacing';
import { EtText } from '../../../../foundations/text';
import { useKeyEntranceAnimation, useKeyPressAnimation } from '../animations';
import type { NumericKeyValue } from '../api/types';
import { getPressCircleSize } from '../constants';

interface KeypadKeyProps {
  value: NumericKeyValue;
  /** Grid row of this key, drives the center-out entrance flare. */
  rowIndex: number;
  /** Grid column of this key, drives the center-out entrance flare. */
  colIndex: number;
  /** Responsive row height — bounds the press-circle so it never exceeds a shrunk cell. */
  rowHeight: number;
  disabled: boolean;
  pressCircleColor: string;
  animateEntrance: boolean;
  onPress: (value: NumericKeyValue) => void;
  testID?: string;
}

/**
 * A single digit / decimal-point key. Renders a grey circle behind the glyph
 * that plays a single fixed grow-in / fade-out pulse on every tap (regardless of
 * hold duration), plus a subtle glyph scale-up. Mounts with a center-out radial flare
 * that blooms outward from the "5" key.
 */
function KeypadKeyComponent({ value, rowIndex, colIndex, rowHeight, disabled, pressCircleColor, animateEntrance, onPress, testID }: KeypadKeyProps) {
  const { colors } = useEtoroTheme();

  const [pressCircleSize, setPressCircleSize] = useState(rowHeight);

  const { circleStyle, glyphStyle, gesture } = useKeyPressAnimation({ value, disabled, onPress });
  const entering = useKeyEntranceAnimation(animateEntrance, rowIndex, colIndex);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setPressCircleSize(getPressCircleSize(width, rowHeight));
  };

  const keyColor = disabled ? colors.textDisabledPrimaryNeutral : colors.textPrimaryNeutral;

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        entering={entering}
        style={styles.key}
        onLayout={handleLayout}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        testID={testID}
      >
        <Animated.View
          pointerEvents="none"
          style={[
            styles.pressCircle,
            {
              width: pressCircleSize,
              height: pressCircleSize,
              borderRadius: pressCircleSize / 2,
              backgroundColor: pressCircleColor,
            },
            circleStyle,
          ]}
        />
        <Animated.View pointerEvents="none" style={glyphStyle}>
          <EtText variant="num-ml" style={[styles.glyph, { color: keyColor }]}>
            {value}
          </EtText>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
}

export const KeypadKey = memo(KeypadKeyComponent);
KeypadKey.displayName = 'KeypadKey';

const styles = StyleSheet.create({
  key: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: X3,
    overflow: 'hidden',
  },
  pressCircle: {
    position: 'absolute',
  },
  glyph: {
    fontSize: 26,
    lineHeight: 38,
    letterSpacing: -0.25,
  },
});
