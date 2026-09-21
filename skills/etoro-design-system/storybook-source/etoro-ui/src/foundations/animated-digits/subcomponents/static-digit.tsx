// ==============================================
// StaticDigit Component
// ==============================================

import React from 'react';
import { StyleSheet, View } from 'react-native';

import { EtText } from '../../text';
import type { AnimatedDigitProps } from '../api';

/**
 * StaticDigit component for rendering digits without animation
 * Used when rapid changes are detected to prevent jarring animations
 * This component intentionally has NO animations for maximum performance
 */
export function StaticDigit({
  digit,
  height,
  width,
  textStyle,
  variant = 'num-xxl',
  weight = 'semiBold',
  characterSpacing,
  allowFontScaling,
  maxFontSizeMultiplier,
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

  return (
    <View style={[styles.container, containerStyle]}>
      <EtText
        variant={variant}
        numberOfLines={1}
        ellipsizeMode="clip"
        weight={weight}
        allowFontScaling={allowFontScaling}
        maxFontSizeMultiplier={maxFontSizeMultiplier}
        style={[flattenedTextStyle, styles.digitText, { width, height }]}
      >
        {String(digit)}
      </EtText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  digitText: {
    textAlign: 'center',
  },
});
