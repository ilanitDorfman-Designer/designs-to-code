import { LinearGradient } from 'expo-linear-gradient';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import Animated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';

interface BreakdownBarProps {
  animatedValue: SharedValue<number>;
  totalAnimatedValue: SharedValue<number>;
  gradientColors: [string, string];
  barStyle: StyleProp<ViewStyle>;
  marginRight: number;
}

export function BreakdownBar({ animatedValue, totalAnimatedValue, gradientColors, barStyle, marginRight }: BreakdownBarProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const total = totalAnimatedValue.value;
    const val = animatedValue.value;
    const barWidth = total > 0 ? val / total : 0;
    return { flex: Math.max(barWidth, 0.001) };
  });

  return (
    <Animated.View style={[styles.barContainer, animatedStyle, { marginRight }]}>
      <LinearGradient colors={gradientColors} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={barStyle} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  barContainer: {
    justifyContent: 'center',
  },
});
