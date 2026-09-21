import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

import type { TickerGradientProps } from '../api';

const DEFAULT_GRADIENT_WIDTH = 30;

/**
 * EtTicker.Gradient - Opacity mask wrapper for ticker content.
 * Uses MaskedView with LinearGradient overlays to create 30px opacity fades at edges.
 * Works on any background color by masking the content itself.
 * Both left and right gradients are applied by default. Use rightOnly when
 * EtTicker.Start is present to skip the left fade.
 */
export function TickerGradient({ width = DEFAULT_GRADIENT_WIDTH, rightOnly = false, children }: TickerGradientProps) {
  const sanitizedWidth = Number.isFinite(width) && width > 0 ? width : DEFAULT_GRADIENT_WIDTH;

  return (
    <MaskedView
      style={styles.container}
      maskElement={
        <View style={styles.maskContainer}>
          {/* Left fade: transparent to opaque over 30px */}
          {!rightOnly && (
            <LinearGradient
              colors={['transparent', 'black']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.leftMask, { width: sanitizedWidth }]}
            />
          )}

          {/* Center: fully opaque */}
          <View style={styles.centerMask} />

          {/* Right fade: opaque to transparent over 30px */}
          <LinearGradient
            colors={['black', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.rightMask, { width: sanitizedWidth }]}
          />
        </View>
      }
    >
      {children}
    </MaskedView>
  );
}

TickerGradient.displayName = 'EtTicker.Gradient';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  maskContainer: {
    flex: 1,
    flexDirection: 'row',
    // Edge fades are physical left/right overlays. Keep LTR so RTL does not
    // swap the strips while gradient start/end coords stay screen-absolute.
    direction: 'ltr',
  },
  leftMask: {
    height: '100%',
  },
  centerMask: {
    flex: 1,
    // backgroundColor must be opaque for MaskedView mask (color doesn't matter, only opacity)
    // 'black' is convention for "fully visible" in mask definitions
    backgroundColor: 'black',
  },
  rightMask: {
    height: '100%',
  },
});
