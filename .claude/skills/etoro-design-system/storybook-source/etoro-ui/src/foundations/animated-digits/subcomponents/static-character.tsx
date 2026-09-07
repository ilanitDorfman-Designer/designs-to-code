// ==============================================
// StaticCharacter Component
// ==============================================

import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';

import { EtText } from '../../text';
import { ANIMATION_CONFIG } from '../animations';
import type { StaticCharacterProps } from '../api';

/**
 * StaticCharacter component for non-numeric characters like commas, periods, currency symbols
 * These characters don't animate and remain static while digits animate around them
 */
export function StaticCharacter({
  char,
  height,
  width,
  textStyle,
  variant = 'num-xxl',
  weight = 'medium',
  characterSpacing,
  allowFontScaling,
  maxFontSizeMultiplier,
  animateLengthChanges = false,
}: StaticCharacterProps) {
  const containerStyle = React.useMemo(
    () => ({
      height: height / 2,
      width: width / 2,
      marginHorizontal: characterSpacing ? characterSpacing / 2 : 0,
    }),
    [height, width, characterSpacing],
  );

  return (
    <Animated.View
      layout={LinearTransition.springify()}
      entering={animateLengthChanges ? FadeIn.duration(ANIMATION_CONFIG.ENTER_DURATION) : undefined}
      exiting={animateLengthChanges ? FadeOut.duration(ANIMATION_CONFIG.EXIT_DURATION) : undefined}
      style={[styles.container, containerStyle]}
    >
      <EtText
        variant={variant}
        weight={weight}
        numberOfLines={1}
        ellipsizeMode="clip"
        allowFontScaling={allowFontScaling}
        maxFontSizeMultiplier={maxFontSizeMultiplier}
        style={[textStyle, styles.characterText, { width, height }]}
      >
        {char}
      </EtText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  characterText: {
    textAlign: 'left',
  },
});
