import React from 'react';
import Animated from 'react-native-reanimated';

import type { EtAnimatedCountProps } from './api';
import { useAnimatedCountConfig, useAnimatedCountState } from './hooks';
import { styles } from './styles';
import { AnimatedDigits, StaticCharacter, StaticDigit } from './subcomponents';
import { createCommonProps } from './utils';

/**
 * AnimatedCount component - Displays numbers with smooth digit animations
 * Supports formatted strings with commas, decimals, and currency symbols
 * Can switch to static rendering when disableAnimation is true
 */
export function EtAnimatedCount(props: EtAnimatedCountProps) {
  const { processedProps, disableAnimation, enterFromBlank, characters, keys, lastDigitIndex, textStyle } = useAnimatedCountConfig(props);
  const { animateLengthChanges, containerLayout } = useAnimatedCountState({ disableAnimation, enterFromBlank, charCount: characters.length });

  const commonProps = createCommonProps(processedProps, textStyle, animateLengthChanges, enterFromBlank);

  // Render the animated digits and static characters. Keys come from buildCharacterKeys so a digit
  // keeps its identity as the value changes: 'decimal' rolls the matching place (odometer), 'leading'
  // keeps existing typed digits put and adds the new digit as a fresh slot on the right.
  return (
    <Animated.View layout={containerLayout} style={styles.container}>
      {characters.map((character, index) => {
        if (character.isDigit) {
          if (disableAnimation) {
            return <StaticDigit key={keys[index]} digit={character.digit} {...commonProps} />;
          }
          return <AnimatedDigits key={keys[index]} digit={character.digit} isLastDigit={index === lastDigitIndex} {...commonProps} />;
        }
        return <StaticCharacter key={keys[index]} char={character.char} {...commonProps} />;
      })}
    </Animated.View>
  );
}
