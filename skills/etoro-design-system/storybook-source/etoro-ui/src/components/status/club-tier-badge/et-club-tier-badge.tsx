import { memo, useEffect, useId } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from 'react-native-svg';

/**
 * Club tier visual variants. `bronze`/`silver`/`gold` mirror the metallic medal
 * exports from Figma; `platinum` is a cool blue-silver, `diamond` is bright
 * white with a twinkling sparkle overlay, and `etorian` is the base-club
 * variant that reuses the eToro brand green (PE/Clubs design).
 */
export type ClubTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'etorian';

/**
 * Two-stop gradient per tier (light → dark). Metallic stops come from the Figma
 * medal SVG exports; `platinum` is tinted bluer per design feedback, `diamond`
 * is near-white, and `etorian` uses the eToro green primitives (primaryV2 400 → 600).
 */
const TIER_GRADIENT: Record<ClubTier, { from: string; to: string }> = {
  bronze: { from: '#FFD6C0', to: '#B97652' },
  silver: { from: '#E3E7F0', to: '#939BAF' },
  gold: { from: '#FFDA8A', to: '#AF6C26' },
  platinum: { from: '#DCEAFF', to: '#6E86C0' },
  diamond: { from: '#FFFFFF', to: '#DCE6F2' },
  etorian: { from: '#6EFF8B', to: '#0EB12E' },
};

/**
 * Sparkle overlay positions (fractions of the badge size) + stagger delays,
 * used only by the diamond tier. Delays fire them in 1 → 3 → 2 order.
 */
const DIAMOND_SPARKLES = [
  { cx: 0.56, cy: -0.04, scale: 0.24, delay: 0 },
  { cx: 0.0, cy: 0.04, scale: 0.38, delay: 900 },
  { cx: 0.82, cy: 0.44, scale: 0.3, delay: 450 },
];

/** Extra px each sparkle is nudged away from the badge center. */
const SPARKLE_OUTWARD_OFFSET = 0;

export interface EtClubTierMedalProps {
  /** Club tier that selects the medal gradient (and sparkle overlay for diamond). */
  tier: ClubTier;
  /** Rendered width/height in px. The artwork scales from a 30×30 viewBox. @default 30 */
  size?: number;
  testID?: string;
}

/**
 * Two overlapping coins (the eToro club medal) with a per-tier metallic
 * gradient. Geometry and gradient stops come from the Figma exports; only the
 * two stop colors change per `tier`. The `diamond` tier additionally renders a
 * looping, reanimated sparkle overlay.
 *
 * @example
 * ```tsx
 * <EtClubTierMedal tier="diamond" size={44} />
 * ```
 */
function EtClubTierMedalBase({ tier, size = 30, testID }: EtClubTierMedalProps) {
  // SVG gradient ids are document-global; useId keeps multiple badges isolated.
  const uid = useId();
  const gradient = TIER_GRADIENT[tier];

  if (!gradient) {
    return null;
  }

  const backId = `${uid}-back`;
  const frontId = `${uid}-front`;
  const { from, to } = gradient;

  return (
    <View style={{ width: size, height: size }} testID={testID}>
      <Svg width={size} height={size} viewBox="0 0 30 30" fill="none">
        <Defs>
          <LinearGradient id={backId} x1="5.46" y1="5.07" x2="17.87" y2="15" gradientUnits="userSpaceOnUse">
            <Stop stopColor={from} />
            <Stop offset="1" stopColor={to} />
          </LinearGradient>
          <LinearGradient id={frontId} x1="17.87" y1="12.53" x2="26.8" y2="22.94" gradientUnits="userSpaceOnUse">
            <Stop stopColor={from} />
            <Stop offset="1" stopColor={to} />
          </LinearGradient>
        </Defs>
        <Circle cx="13.8974" cy="15" r="13.8974" fill={`url(#${backId})`} />
        <Circle cx="21.8149" cy="20.7123" r="8.18501" fill={`url(#${frontId})`} />
      </Svg>

      {tier === 'diamond' && (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {DIAMOND_SPARKLES.map((sparkle, index) => {
            const baseLeft = sparkle.cx * size;
            const baseTop = sparkle.cy * size;
            // Nudge each sparkle radially away from the badge center.
            const dx = baseLeft - size / 2;
            const dy = baseTop - size / 2;
            const dist = Math.hypot(dx, dy) || 1;
            return (
              <Sparkle
                key={index}
                left={baseLeft + (dx / dist) * SPARKLE_OUTWARD_OFFSET}
                top={baseTop + (dy / dist) * SPARKLE_OUTWARD_OFFSET}
                size={sparkle.scale * size}
                delay={sparkle.delay}
              />
            );
          })}
        </View>
      )}
    </View>
  );
}

export const EtClubTierMedal = memo(EtClubTierMedalBase);
EtClubTierMedal.displayName = 'EtClubTierMedal';

/** A single twinkling sparkle: fades + scales in/out on a staggered, infinite loop. */
function Sparkle({ left, top, size, delay }: { left: number; top: number; size: number; delay: number }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 950, easing: Easing.inOut(Easing.cubic) }),
          withTiming(0, { duration: 950, easing: Easing.inOut(Easing.cubic) }),
          withTiming(0, { duration: 450 }),
        ),
        -1,
        false,
      ),
    );
  }, [delay, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: 0.35 + progress.value * 0.65,
    transform: [{ scale: 0.55 + progress.value * 0.65 }, { rotate: `${progress.value * 30}deg` }],
  }));

  return (
    <Animated.View style={[styles.sparkle, { left, top }, animatedStyle]}>
      <Svg width={size} height={size} viewBox="0 0 10 10" fill="none">
        <Path
          d="M5 0C5.3 2.6 7.4 4.7 10 5C7.4 5.3 5.3 7.4 5 10C4.7 7.4 2.6 5.3 0 5C2.6 4.7 4.7 2.6 5 0Z"
          fill="#FFFFFF"
          stroke="#FFD700"
          strokeWidth={0.6}
          strokeLinejoin="round"
        />
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sparkle: {
    position: 'absolute',
    // Soft golden glow so the twinkle reads against bright diamond medals.
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 3,
    elevation: 4,
  },
});
