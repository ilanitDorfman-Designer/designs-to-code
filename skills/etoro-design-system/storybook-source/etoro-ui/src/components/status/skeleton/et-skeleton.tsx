import { type DimensionValue, type StyleProp, View, type ViewStyle } from 'react-native';
import Animated, { interpolate, useAnimatedStyle } from 'react-native-reanimated';

import { type ReducedMotionState, useReducedMotionState } from '../../../core/hooks/accessibility';
import { EtSkeletonProps } from './api/types';
import { EtSkeletonChips } from './components/et-skeleton-chips';
import { EtSkeletonGroupHost } from './components/et-skeleton-group-host';
import { useSkeletonGroup } from './context/skeleton-group-context';
import { useShimmerClock } from './hooks/use-shimmer-clock';
import { useSkeletonTheme } from './hooks/use-skeleton-theme';
import { getDefaultBorderRadius } from './utils/get-default-border-radius';

interface PulseAtomProps {
  base: string;
  shape: { width: DimensionValue; height: number; borderRadius: number };
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

interface SkeletonAtomProps extends PulseAtomProps {
  animation: EtSkeletonProps['animation'];
  animated: boolean;
  reducedMotion: ReducedMotionState;
}

/**
 * A single skeleton atom that pulses its opacity using the shared clock.
 * Extracted as a component so `useShimmerClock` (which increments the
 * reference count) only runs when a pulsing atom is actually mounted.
 */
function PulseAtom({ base, shape, style, testID }: PulseAtomProps) {
  const clock = useShimmerClock();
  const pulseStyle = useAnimatedStyle(() => ({
    opacity: interpolate(clock.get(), [0, 1], [0.5, 1]),
  }));

  return <Animated.View style={[shape, { backgroundColor: base }, style, pulseStyle]} testID={testID} />;
}

function SkeletonAtom({ animation, animated, reducedMotion, base, shape, style, testID }: SkeletonAtomProps) {
  const shouldPulse = animated && animation !== 'none' && reducedMotion.hasResolved && !reducedMotion.isReducedMotionEnabled;

  if (shouldPulse) {
    return <PulseAtom base={base} shape={shape} style={style} testID={testID} />;
  }

  return <View style={[shape, { backgroundColor: base }, style]} testID={testID} />;
}

function StandaloneSkeletonAtom(props: Omit<SkeletonAtomProps, 'reducedMotion'>) {
  const reducedMotion = useReducedMotionState();

  return <SkeletonAtom {...props} reducedMotion={reducedMotion} />;
}

/**
 * `EtSkeleton` — the atomic placeholder shape.
 *
 * Each atom is a solid box that pulses its opacity off the shared clock,
 * replacing the previous per-atom `AnimatedLinearGradient` sweep. This removes
 * the GPU compositing cost (no gradient layer, no translateX worklet) while
 * keeping all atoms phase-synced on a single UI-thread timer.
 *
 * Convenience atoms: `EtSkeleton.Box`, `EtSkeleton.Circle`, `EtSkeleton.Text`.
 * Layout host: `EtSkeleton.Group` (pure flexbox — no animation of its own).
 */
function EtSkeletonBase({
  width = '100%',
  height = 20,
  animation = 'shimmer',
  variant = 'text',
  borderRadius,
  style,
  visible = true,
  children,
  testID,
}: EtSkeletonProps) {
  const group = useSkeletonGroup();
  const { base } = useSkeletonTheme();
  const radius = getDefaultBorderRadius(variant, height, borderRadius);

  if (!visible) {
    // eslint-disable-next-line react/jsx-no-useless-fragment -- must not add a layout-affecting wrapper around children.
    return <>{children}</>;
  }

  const shape = { width: width as DimensionValue, height, borderRadius: radius };

  if (group.reducedMotion) {
    return (
      <SkeletonAtom
        animation={animation}
        animated={group.animated}
        reducedMotion={group.reducedMotion}
        base={base}
        shape={shape}
        style={style}
        testID={testID}
      />
    );
  }

  return <StandaloneSkeletonAtom animation={animation} animated={group.animated} base={base} shape={shape} style={style} testID={testID} />;
}

function SkeletonBox(props: Omit<EtSkeletonProps, 'variant'>) {
  return <EtSkeletonBase variant="rounded" {...props} />;
}

function SkeletonCircle(props: Omit<EtSkeletonProps, 'variant'>) {
  return <EtSkeletonBase variant="circular" {...props} />;
}

function SkeletonText(props: Omit<EtSkeletonProps, 'variant'>) {
  return <EtSkeletonBase variant="text" {...props} />;
}

export const EtSkeleton = Object.assign(EtSkeletonBase, {
  Group: EtSkeletonGroupHost,
  Box: SkeletonBox,
  Circle: SkeletonCircle,
  Text: SkeletonText,
  Chips: EtSkeletonChips,
});
