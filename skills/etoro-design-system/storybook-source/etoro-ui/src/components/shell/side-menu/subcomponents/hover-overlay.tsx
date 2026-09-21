import { StyleSheet } from 'react-native';
import Animated, { Easing, useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { useEtoroTheme } from '../../../../core/hooks/use-etoro-theme';
import { create } from '../../../../utils/create';
import { HOVER_IN_MS, HOVER_OPACITY, HOVER_OUT_MS } from '../constants';

interface HoverOverlayProps {
  hovered: boolean;
  /** Passed as a prop (not read from context) so the context-free trigger can reuse the overlay. */
  reducedMotion: boolean;
}

/**
 * Internal full-bleed 3% hover overlay — `carbon900` at animated opacity
 * 0 → 0.03 (80 ms in / 160 ms out), matching Figma's own hover structure
 * (a 3%-opacity fill layer) and sidestepping rgba composition entirely.
 * Binary (no animation) under reduced motion.
 */
function HoverOverlayBase({ hovered, reducedMotion }: HoverOverlayProps) {
  const { colors } = useEtoroTheme();

  const animatedStyle = useAnimatedStyle(() => {
    const target = hovered ? HOVER_OPACITY : 0;
    if (reducedMotion) {
      return { opacity: target };
    }
    return {
      opacity: withTiming(target, { duration: hovered ? HOVER_IN_MS : HOVER_OUT_MS, easing: Easing.linear }),
    };
  }, [hovered, reducedMotion]);

  return <Animated.View style={[styles.overlay, { backgroundColor: colors.carbon900 }, animatedStyle]} />;
}

export const HoverOverlay = create(HoverOverlayBase, 'EtSideMenu.HoverOverlay');

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none',
  },
});
