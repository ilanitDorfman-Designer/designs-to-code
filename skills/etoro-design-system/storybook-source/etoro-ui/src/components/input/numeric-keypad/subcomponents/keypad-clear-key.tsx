import { memo } from 'react';
import { StyleSheet } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { Path, Svg } from 'react-native-svg';

import { useEtoroTheme } from '../../../../core/hooks/use-etoro-theme';
import { X1, X3 } from '../../../../core/styles/spacing';
import { EtText } from '../../../../foundations/text';
import { useClearKeyPressAnimation, useKeyEntranceAnimation } from '../animations';

const BADGE_PATH =
  'M10.218 30.8627L0.652954 19.4932L10.218 8.08913C16.5425 -0.279039 28.526 -1.99656 36.9826 4.28778C45.4392 10.5715 47.1679 22.4779 40.8434 30.88C37.2313 35.6789 31.5526 38.5029 25.522 38.5C19.4925 38.4994 14.653 35.5 10.218 30.8627Z';

interface KeypadClearKeyProps {
  /** Grid row of this key, drives the center-out entrance flare. */
  rowIndex: number;
  /** Grid column of this key, drives the center-out entrance flare. */
  colIndex: number;
  disabled: boolean;
  animateEntrance: boolean;
  onPress: () => void;
  onLongPress?: () => void;
  testID?: string;
  deleteLabel?: string;
}

/**
 * The "C" (clear) key. Renders the hexagonal badge as an outline at rest and,
 * on press, inverts: the badge fills with the foreground color while the
 * stroke + glyph switch to the inverted (background) color. Supports a
 * long-press "clear-all" gesture. Mounts with the center-out radial flare.
 */
function KeypadClearKeyComponent({ rowIndex, colIndex, disabled, animateEntrance, onPress, onLongPress, testID, deleteLabel }: KeypadClearKeyProps) {
  const { colors } = useEtoroTheme();

  const { fillStyle, outlineStyle, glyphScaleStyle, restGlyphStyle, invertedGlyphStyle, gesture } = useClearKeyPressAnimation({
    disabled,
    onPress,
    onLongPress,
  });
  const entering = useKeyEntranceAnimation(animateEntrance, rowIndex, colIndex);

  const restColor = disabled ? colors.textDisabledPrimaryNeutral : colors.textPrimaryNeutral;
  const filledColor = colors.carbon900;
  const invertedColor = colors.carbon900Inverted;

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        entering={entering}
        style={styles.key}
        accessible
        accessibilityRole="button"
        accessibilityLabel={deleteLabel}
        accessibilityState={{ disabled }}
        testID={testID}
      >
        <Animated.View pointerEvents="none" style={[styles.badge, glyphScaleStyle]}>
          <Animated.View style={[StyleSheet.absoluteFillObject, outlineStyle]}>
            <Svg width={46} height={39} viewBox="0 0 46 39" style={StyleSheet.absoluteFillObject}>
              <Path fillRule="evenodd" clipRule="evenodd" d={BADGE_PATH} fill="none" stroke={restColor} strokeWidth={1} />
            </Svg>
          </Animated.View>
          <Animated.View style={[StyleSheet.absoluteFillObject, fillStyle]}>
            <Svg width={46} height={39} viewBox="0 0 46 39" style={StyleSheet.absoluteFillObject}>
              <Path fillRule="evenodd" clipRule="evenodd" d={BADGE_PATH} fill={filledColor} stroke={filledColor} strokeWidth={1} />
            </Svg>
          </Animated.View>
          <Animated.View style={[styles.glyphLayer, restGlyphStyle]}>
            <EtText variant="num-ml" style={[styles.glyph, { color: restColor }]}>
              C
            </EtText>
          </Animated.View>
          <Animated.View style={[styles.glyphLayer, invertedGlyphStyle]}>
            <EtText variant="num-ml" style={[styles.glyph, { color: invertedColor }]}>
              C
            </EtText>
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
}

export const KeypadClearKey = memo(KeypadClearKeyComponent);
KeypadClearKey.displayName = 'KeypadClearKey';

const styles = StyleSheet.create({
  key: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: X3,
  },
  badge: {
    width: 46,
    height: 39,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glyphLayer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glyph: {
    marginLeft: X1,
  },
});
