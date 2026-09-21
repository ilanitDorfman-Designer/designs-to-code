import { StyleSheet, Text } from 'react-native';
import Animated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';

interface BreakdownLabelProps {
  animatedValue: SharedValue<number>;
  totalAnimatedValue: SharedValue<number>;
  label: string;
  textColor: string;
  marginRight: number;
}

export function BreakdownLabel({ animatedValue, totalAnimatedValue, label, textColor, marginRight }: BreakdownLabelProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const total = totalAnimatedValue.value;
    const val = animatedValue.value;
    const barWidth = total > 0 ? val / total : 0;
    return { flex: Math.max(barWidth, 0.001) };
  });

  return (
    <Animated.View style={[styles.labelContainer, animatedStyle, { marginRight }]}>
      <Text style={[styles.labelText, { color: textColor }]} numberOfLines={1}>
        {label}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  labelContainer: {
    alignItems: 'center',
  },
  labelText: {
    fontSize: 12,
    textAlign: 'center',
    overflow: 'hidden',
  },
});
