/* eslint-disable react/style-prop-object -- Skia's `style` prop takes paint-style strings ("stroke" | "normal"), not RN style objects. */
import { BlurMask, Group, RoundedRect, SweepGradient, vec } from '@shopify/react-native-skia';
import { memo, useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  cancelAnimation,
  Easing,
  interpolateColor,
  SharedValue,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { EtCanvas } from '../../../core/skia/et-canvas';
import { useSkiaReady } from '../../../core/skia/skia-ready';
import { GLOW_CANVAS_INFLATE } from '../utils';

/** Soft neutral glow used when the focused item has no accent color. */
const NEUTRAL_GLOW = 'rgba(235,240,255,0.95)';
/** Breathing pulse period, in ms — keeps the edge light feeling alive. */
const BREATH_MS = 2800;
/** Time for the travelling glint to make one full lap of the border, in ms. */
const ORBIT_MS = 4800;
/** Cross-fade duration when the focused accent changes, in ms. */
const COLOR_TWEEN_MS = 320;
/** Peak opacity of the steady (breathing) edge glow when fully expanded. */
const PEAK_OPACITY = 0.6;
/** Peak opacity of the orbiting glint layer when fully expanded. */
const ORBIT_PEAK = 0.4;

interface IslandGlowProps {
  expansion: SharedValue<number>;
  shellWidth: SharedValue<number>;
  shellHeight: SharedValue<number>;
  shellRadius: SharedValue<number>;
  /** Max shell footprint — fixes the canvas size so the blur never reflows. */
  maxWidth: number;
  maxHeight: number;
  /** Whether the island is expanded — gates the motion so Skia stays idle while collapsed. */
  isExpanded: boolean;
  /** Optional focused-item accent that tints the edge glow. */
  accentColor?: string;
}

/**
 * An Apple-style "alive" edge glow rendered behind the glass. Two soft, blurred
 * stroked rounded rects track the shell morph:
 *  - a steady ring that gently breathes (the base pulse), and
 *  - a single bright glint (a sweep gradient with one accent arc) that orbits
 *    the border continuously, like light refracting around the island.
 *
 * Single-hue (the focused accent), no center fill. Intensity rises only with
 * expansion and both animations run only while expanded, so the collapsed pill
 * stays clean and Skia never repaints when idle.
 */
function IslandGlowBase({ expansion, shellWidth, shellHeight, shellRadius, maxWidth, maxHeight, isExpanded, accentColor }: IslandGlowProps) {
  const skiaReady = useSkiaReady();
  const canvasWidth = maxWidth + GLOW_CANVAS_INFLATE * 2;
  const canvasHeight = maxHeight + GLOW_CANVAS_INFLATE * 2;
  const cx = canvasWidth / 2;
  const cy = canvasHeight / 2;
  const center = skiaReady ? vec(cx, cy) : { x: cx, y: cy };
  const color = accentColor ?? NEUTRAL_GLOW;

  // Cross-fade the edge color when the focused accent changes, so the border
  // morphs smoothly instead of cutting to the new hue.
  const colorMix = useSharedValue(1);
  const fromColor = useRef(color);
  const toColor = useRef(color);
  useEffect(() => {
    if (toColor.current === color) return;
    fromColor.current = toColor.current;
    toColor.current = color;
    colorMix.value = 0;
    colorMix.value = withTiming(1, { duration: COLOR_TWEEN_MS, easing: Easing.inOut(Easing.ease) });
  }, [color, colorMix]);
  const glowColor = useDerivedValue(() => interpolateColor(colorMix.value, [0, 1], [fromColor.current, toColor.current]));
  const gradientColors = useDerivedValue(() => ['transparent', 'transparent', glowColor.value, 'transparent', 'transparent']);

  const breath = useSharedValue(0);
  const angle = useSharedValue(0);

  // Breathe + orbit only while expanded — a collapsed pill shows no halo and
  // the blurred Skia strokes never repaint when there is nothing to animate.
  useEffect(() => {
    if (!isExpanded) {
      cancelAnimation(breath);
      cancelAnimation(angle);
      breath.value = 0;
      angle.value = 0;
      return;
    }
    breath.value = withRepeat(withTiming(1, { duration: BREATH_MS, easing: Easing.inOut(Easing.ease) }), -1, true);
    angle.value = withRepeat(withTiming(2 * Math.PI, { duration: ORBIT_MS, easing: Easing.linear }), -1, false);
    return () => {
      cancelAnimation(breath);
      cancelAnimation(angle);
    };
  }, [breath, angle, isExpanded]);

  const rectX = useDerivedValue(() => cx - shellWidth.value / 2);
  const rectY = useDerivedValue(() => cy - shellHeight.value / 2);
  const strokeWidth = useDerivedValue(() => 3 + expansion.value * 3);
  const blurRadius = useDerivedValue(() => 8 + expansion.value * 10);
  const orbitStroke = useDerivedValue(() => 3 + expansion.value * 2);
  const orbitBlur = useDerivedValue(() => 8 + expansion.value * 8);

  const pulseOpacity = useDerivedValue(() => expansion.value * PEAK_OPACITY * (0.8 + 0.2 * breath.value));
  const orbitOpacity = useDerivedValue(() => expansion.value * ORBIT_PEAK);
  const orbitTransform = useDerivedValue(() => [{ rotate: angle.value }]);

  return (
    <View style={styles.center} pointerEvents="none">
      {skiaReady ? (
        <EtCanvas style={{ width: canvasWidth, height: canvasHeight }}>
          <Group opacity={pulseOpacity}>
            <RoundedRect
              x={rectX}
              y={rectY}
              width={shellWidth}
              height={shellHeight}
              r={shellRadius}
              color={glowColor}
              style="stroke"
              strokeWidth={strokeWidth}
            >
              <BlurMask blur={blurRadius} style="normal" />
            </RoundedRect>
          </Group>

          <Group opacity={orbitOpacity}>
            <RoundedRect x={rectX} y={rectY} width={shellWidth} height={shellHeight} r={shellRadius} style="stroke" strokeWidth={orbitStroke}>
              <SweepGradient c={center} origin={center} transform={orbitTransform} colors={gradientColors} positions={[0, 0.4, 0.5, 0.6, 1]} />
              <BlurMask blur={orbitBlur} style="normal" />
            </RoundedRect>
          </Group>
        </EtCanvas>
      ) : null}
    </View>
  );
}

export const IslandGlow = memo(IslandGlowBase);
IslandGlow.displayName = 'EtInstrumentIsland.Glow';

const styles = StyleSheet.create({
  center: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
