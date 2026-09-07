import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { StyleSheet } from 'react-native';

import { useEtoroTheme } from '../../../core/hooks';

interface GradientWrapperProps {
  gradient?: boolean;
  children: ReactNode;
}

/** Wraps children in a LinearGradient when `gradient` is true; otherwise renders children directly. */
export function GradientWrapper({ gradient, children }: GradientWrapperProps) {
  const { colors } = useEtoroTheme();

  if (!gradient) return <>{children}</>;

  return (
    <LinearGradient colors={[colors.cardDefault, colors.backgroundBase]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.container}>
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
