import { useTheme } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { Platform, StyleSheet, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { eToroTheme } from '../../../../core/styles';
import { EtText } from '../../../../foundations/text/et-text';
import { YAxisLabels as YAxisLabelsType } from '../api/types';
import { computeYAxisTickPositions } from '../utils';

const ANIMATION_BASE_DELAY = 50;
const ANIMATION_DURATION = 400;
// Matches Figma's "Background Blur" effect on the y-axis chip (radius 8 ≈ intensity ~20).
const CHIP_BLUR_INTENSITY = 20;

interface YAxisLabelsProps {
  labels: YAxisLabelsType;
  chartHeight: number;
  colors: eToroTheme['colors'];
  hidden?: boolean;
  /** Position from the end edge in px (default: 30) */
  end?: number;
  /** Label distribution mode (default: 'space-around') */
  distribution?: 'space-around' | 'space-between';
}

export function YAxisLabels({ labels, chartHeight, colors, hidden = false, end = 30, distribution = 'space-around' }: YAxisLabelsProps) {
  const { dark } = useTheme();
  const tickPositions = computeYAxisTickPositions(labels.length, chartHeight, distribution);

  return (
    <View pointerEvents={hidden ? 'none' : 'auto'} style={[styles.container, hidden && styles.hidden, { height: chartHeight, end }]}>
      {labels.map((label, index) => {
        const topPosition = tickPositions[index];

        return (
          <Animated.View
            // Reanimated layout/entering animations drive the web DOM imperatively and
            // write array-shaped styles to CSSStyleDeclaration, which throws. Disable the
            // entering animation on web; keep it on native.
            entering={Platform.OS === 'web' ? undefined : FadeInUp.delay(index * ANIMATION_BASE_DELAY).duration(ANIMATION_DURATION)}
            key={`y-axis-label-${index}`}
            style={[styles.chipPosition, { top: topPosition }]}
          >
            <View style={styles.chip}>
              {/* Android used to layer an opaque `carbon100` fill INSIDE a BlurView, hiding the
                  blur completely — so the chip is now just the filled view there, and the native
                  BlurView (still masked by nothing on iOS) only mounts where it is visible. */}
              {Platform.OS === 'android' ? (
                <View style={[styles.chipContent, { backgroundColor: colors.carbon100 }]}>
                  <EtText variant="caption-medium" style={{ color: colors.carbon900 }}>
                    {label}
                  </EtText>
                </View>
              ) : (
                <BlurView intensity={CHIP_BLUR_INTENSITY} tint={dark ? 'dark' : 'light'} style={styles.chipContent}>
                  <EtText variant="caption-medium" style={{ color: colors.carbon900 }}>
                    {label}
                  </EtText>
                </BlurView>
              )}
            </View>
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    // Ensure labels paint above the Skia <Canvas> sibling on iOS, where
    // implicit JSX-order layering is unreliable when the previous sibling
    // is a native Skia surface with overflow: visible.
    zIndex: 1,
  },
  hidden: {
    opacity: 0,
  },
  // The Animated.View wrapper only owns position so the FadeInUp layout
  // animation does not conflict with the static centering transform below.
  chipPosition: {
    position: 'absolute',
    right: 0,
  },
  chip: {
    transform: [{ translateY: -11 }], // Center the chip vertically (chip height ≈ 22px)
    borderRadius: 16,
    overflow: 'hidden', // Required to clip the BlurView to the rounded corners.
    minWidth: 37,
  },
  chipContent: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: 'flex-end',
  },
});
