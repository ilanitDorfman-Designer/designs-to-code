import { StyleProp, StyleSheet, TextProps, TextStyle } from 'react-native';
import Animated, { type AnimatedProps } from 'react-native-reanimated';

interface FloatingLabelProps {
  label: string;
  required?: boolean;
  animatedStyle: NonNullable<AnimatedProps<TextProps>['style']>;
  labelStyle?: StyleProp<TextStyle>;
  color: string;
  testID?: string;
  fontFamily?: string;
}

export function FloatingLabel({ label, required, animatedStyle, labelStyle, color, testID, fontFamily }: FloatingLabelProps) {
  return (
    <Animated.Text testID={testID} style={[styles.label, { color, fontFamily }, labelStyle, animatedStyle]}>
      {label}
      {required && ' *'}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  label: {
    position: 'absolute',
    start: 0,
  },
});
