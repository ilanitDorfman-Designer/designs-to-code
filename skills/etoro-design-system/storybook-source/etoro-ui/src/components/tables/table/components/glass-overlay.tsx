import { useTheme } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';
import Animated, { interpolate, SharedValue, useAnimatedStyle } from 'react-native-reanimated';

import { useEtoroTheme } from '../../../../core/hooks';
import { EtTableBodyProps } from '../api';

type Props<T> = Pick<EtTableBodyProps<T>, 'glassEffect'> & {
  scrollOffsetX: SharedValue<number>;
};

export default function GlassOverlay<T>({ glassEffect, scrollOffsetX }: Props<T>) {
  const { dark } = useTheme();
  const { colors } = useEtoroTheme();

  if (!glassEffect) {
    throw new Error('GlassOverlay requires glassEffect prop to be provided.');
  }

  // Animated style that reacts to scroll offset without causing re-renders
  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollOffsetX.value,
      [0, 100], // Fade in between 0-100px of scroll
      [0, 1],
      'clamp',
    );

    return {
      opacity,
    };
  });

  return (
    <Animated.View style={[styles.container, animatedStyle]} pointerEvents="none" testID="et-table-glass-overlay">
      {/* Blur background layer */}
      <BlurView intensity={glassEffect.blurIntensity ?? 0} tint="light" style={StyleSheet.absoluteFillObject} />
      {/* Translucent overlay for depth */}
      <LinearGradient
        colors={
          glassEffect.gradientColors ??
          (dark
            ? [colors.bgNeutralPrimary, colors.bgNeutralTertiary, colors.bgNeutralPrimary]
            : [colors.bgTransparentPrimaryBright, colors.bgGreyPrimary, colors.bgTransparentPrimaryBright])
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[StyleSheet.absoluteFillObject, glassEffect.overlayStyle]}
        pointerEvents="none"
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1, // Place behind content
  },
});
