import { Pressable, StyleSheet, ViewProps } from 'react-native';
import Animated, { type AnimatedProps } from 'react-native-reanimated';

import { useEtoroTheme } from '../../../../core/hooks';
import { EtText } from '../../../../foundations/text';
import { SizeDimensions } from '../utils';

interface IncrementButtonProps {
  onPress: () => void;
  disabled: boolean;
  dimensions: SizeDimensions;
  buttonColor?: string;
  buttonTextColor?: string;
  animatedStyle: NonNullable<AnimatedProps<ViewProps>['style']>;
  onPressIn?: () => void;
  onPressOut?: () => void;
  testID?: string;
}

export function IncrementButton({
  onPress,
  disabled,
  dimensions,
  buttonColor,
  buttonTextColor,
  animatedStyle,
  onPressIn,
  onPressOut,
  testID,
}: IncrementButtonProps) {
  const { colors } = useEtoroTheme();
  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        style={[
          styles.button,
          {
            width: dimensions.buttonSize,
            height: dimensions.buttonSize,
            backgroundColor: buttonColor || '#4A9EFF',
            shadowColor: colors.bgNeutralPrimary,
          },
          disabled && styles.disabledButton,
        ]}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={disabled}
        accessibilityLabel="Increase value"
        accessibilityRole="button"
        testID={testID}
      >
        <EtText
          variant="label-primary-bold"
          style={[styles.buttonText, { fontSize: dimensions.numberFontSize - 4, color: buttonTextColor || '#FFFFFF' }]}
        >
          +
        </EtText>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  disabledButton: {
    opacity: 0.4,
  },
  buttonText: {
    textAlign: 'center',
    lineHeight: undefined, // Let the text center naturally
  },
});
