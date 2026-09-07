import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';
import Animated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';

import { useEtoroTheme } from '../../../../core/hooks';

interface FadeGradientProps {
  expandProgress: SharedValue<number>;
}

export function FadeGradient({ expandProgress }: FadeGradientProps) {
  const { colors } = useEtoroTheme();

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: 1 - expandProgress.value,
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <LinearGradient colors={[colors.bgNeutralPrimary, colors.bgNeutralPrimary]} style={styles.gradient} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 20,
    pointerEvents: 'none',
  },
  gradient: {
    flex: 1,
  },
});
