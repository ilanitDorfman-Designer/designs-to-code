import { memo } from 'react';
import { StyleSheet, useWindowDimensions, ViewProps } from 'react-native';
import Animated, { type AnimatedProps } from 'react-native-reanimated';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

const HALO_HEIGHT = 270;
const NEUTRAL_GLOW_COLOR = '#E4F3EC';

interface HaloProps {
  glowColor?: string;
  animatedHaloOpacity: NonNullable<AnimatedProps<ViewProps>['style']>;
  /**
   * Scales the gradient's per-stop opacity so the same glow can read softer or
   * stronger without changing color. Defaults to `1` (full strength).
   */
  intensity?: number;
}

function HaloBase({ glowColor = NEUTRAL_GLOW_COLOR, animatedHaloOpacity, intensity = 1 }: HaloProps) {
  const { width } = useWindowDimensions();

  // The gradient id must be unique per color: react-native-svg resolves
  // `url(#id)` references globally, so a shared id would let one halo (e.g. the
  // green tab halo) override another (the neutral/asset halo) when both mount.
  const gradientId = `etHaloGlow-${glowColor.replace(/[^a-zA-Z0-9]/g, '')}`;

  return (
    <Animated.View pointerEvents="none" style={[styles.halo, animatedHaloOpacity]}>
      <Svg width={width} height={HALO_HEIGHT} fill="none">
        <Defs>
          {/* userSpaceOnUse keeps the bright center pinned to the top-center of the
              visible strip so the glow reads on screen, fading down + outward. */}
          <RadialGradient id={gradientId} cx={width / 2} cy={0} rx={width * 0.75} ry={HALO_HEIGHT} gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor={glowColor} stopOpacity={0.32 * intensity} />
            <Stop offset="0.35" stopColor={glowColor} stopOpacity={0.14 * intensity} />
            <Stop offset="0.7" stopColor={glowColor} stopOpacity={0.04 * intensity} />
            <Stop offset="1" stopColor={glowColor} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect x={0} y={0} width={width} height={HALO_HEIGHT} fill={`url(#${gradientId})`} />
      </Svg>
    </Animated.View>
  );
}

export const Halo = memo(HaloBase);

const styles = StyleSheet.create({
  halo: {
    position: 'absolute',
    top: -10,
  },
});
