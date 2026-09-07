import { StyleSheet, View, ViewProps } from 'react-native';
import Animated, { type AnimatedProps } from 'react-native-reanimated';

import { SizeDimensions } from '../utils';
import { DigitColumn } from './digit-column';

interface NumberDisplayProps {
  digits: number[];
  dimensions: SizeDimensions;
  textColor?: string;
  animationDirection?: 'up' | 'down';
  containerAnimatedStyle: NonNullable<AnimatedProps<ViewProps>['style']>;
  testID?: string;
}

export function NumberDisplay({ digits, dimensions, textColor, animationDirection, containerAnimatedStyle, testID }: NumberDisplayProps) {
  return (
    <Animated.View style={[styles.numberContainer, containerAnimatedStyle]} testID={testID || 'number-display-container'}>
      <View style={styles.digitsRow} testID="digits-row">
        {digits.map((digit, index) => (
          <DigitColumn
            key={index}
            digit={digit}
            fontSize={dimensions.numberFontSize}
            textColor={textColor || '#FFFFFF'}
            columnIndex={index}
            totalColumns={digits.length}
            animationDirection={animationDirection}
          />
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  numberContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 40,
    // Remove flex: 1 to allow animated width control
  },
  // Digit sliding animation styles
  digitsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
