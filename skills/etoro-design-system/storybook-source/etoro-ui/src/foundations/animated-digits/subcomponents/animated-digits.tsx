import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, { FadeOut } from 'react-native-reanimated';

import { EtText } from '../../text';
import { ANIMATION_CONFIG, makeRoomTransition } from '../animations';
import type { AnimatedDigitProps } from '../api';
import { LeadingDigitCell } from './leading-digit-cell';
import { OdometerColumn } from './odometer-column';

export function AnimatedDigits({
  digit,
  height,
  width,
  textStyle,
  variant = 'num-xxl',
  weight = 'semiBold',
  characterSpacing,
  allowFontScaling,
  maxFontSizeMultiplier,
  springConfig,
  animateLengthChanges = false,
  enterFromBlank = false,
  isLastDigit = false,
}: AnimatedDigitProps) {
  const flattenedTextStyle = React.useMemo(() => {
    return StyleSheet.flatten(textStyle);
  }, [textStyle]);

  const containerStyle = React.useMemo(
    () => ({
      height,
      width,
      marginHorizontal: characterSpacing ? characterSpacing / 2 : 0,
    }),
    [height, width, characterSpacing],
  );

  const renderDigitCell = (value: number) => (
    <EtText
      variant={variant}
      weight={weight}
      numberOfLines={1}
      ellipsizeMode="clip"
      allowFontScaling={allowFontScaling}
      maxFontSizeMultiplier={maxFontSizeMultiplier}
      style={[flattenedTextStyle, styles.digitText, { width, height }]}
    >
      {String(value)}
    </EtText>
  );

  // Only the newly typed (trailing) digit drops in; every other slot renders in place. Gating to the
  // trailing digit means batched/multi-digit changes never leave a mid-row slot mid-entrance. 'decimal'
  // always odometers.
  const animateEntrance = animateLengthChanges && isLastDigit;

  return (
    <Animated.View
      layout={makeRoomTransition}
      exiting={enterFromBlank && animateLengthChanges ? FadeOut.duration(ANIMATION_CONFIG.EXIT_DURATION) : undefined}
      style={[styles.overflowHidden, containerStyle]}
    >
      {enterFromBlank ? (
        <LeadingDigitCell digit={digit} height={height} width={width} animateEntrance={animateEntrance} renderDigitCell={renderDigitCell} />
      ) : (
        <OdometerColumn digit={digit} height={height} springConfig={springConfig} renderDigitCell={renderDigitCell} />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overflowHidden: {
    overflow: 'hidden',
  },
  digitText: {
    textAlign: 'center',
  },
});
