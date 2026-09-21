import { describe, expect, it, jest } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';
import type { ReactTestInstance } from 'react-test-renderer';

import type { BarConfig } from './performance-bar';
import { PerformanceBar } from './performance-bar';

jest.mock('expo-linear-gradient', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');
  return {
    LinearGradient: ({ colors, ...props }: { colors: [string, string] }) =>
      React.createElement(View, { testID: `gradient-${colors[0]}-${colors[1]}`, ...props }),
  };
});

// Stateful Reanimated mock:
// - `useSharedValue` returns a stable per-hook wrapper backed by a persistent record; writes are
//   intercepted so timing/delay descriptors are queued instead of assigned directly.
// - `withTiming` / `withDelay` build descriptors; the last write wins (matches Reanimated semantics).
// - `advanceMockAnimations(ms)` progresses every registered shared value's queued animation, so
//   tests can observe intermediate states (sign crossing, muted-fade midpoint).
jest.mock('react-native-reanimated', () => {
  const React = jest.requireActual('react');
  const { View } = jest.requireActual('react-native');

  const registry = new Set();
  const isAnim = (v) => typeof v === 'object' && v !== null && v.__anim === true;

  const useSharedValue = (initial) => {
    const wrapperRef = React.useRef(null);
    if (wrapperRef.current === null) {
      const record = { current: initial, anim: null };
      registry.add(record);
      const wrapper = Object.defineProperty({}, 'value', {
        get: () => record.current,
        set: (next) => {
          if (isAnim(next)) {
            record.anim = { ...next, from: record.current, elapsed: 0 };
          } else {
            record.current = next;
            record.anim = null;
          }
        },
        configurable: true,
      });
      // Persist the wrapper across renders so `mutedOpacity` / `signedHeight` refs stay stable and
      // the component's useEffects only re-fire when their real (non-wrapper) deps change.
      // eslint-disable-next-line react-compiler/react-compiler -- fake hook implementation must mutate ref
      wrapperRef.current = wrapper;
    }
    return wrapperRef.current;
  };

  const withTiming = (to, config = {}) => ({
    __anim: true,
    delay: 0,
    duration: config.duration ?? 300,
    to,
    elapsed: 0,
  });

  const withDelay = (delayMs, animation) => ({ ...animation, delay: delayMs });

  const useAnimatedStyle = (updater) => updater();
  const useReducedMotion = () => false;

  const advanceMockAnimations = (ms) => {
    registry.forEach((record) => {
      const anim = record.anim;
      if (!anim) return;
      let remaining = ms;
      if (anim.delay > 0) {
        const spent = Math.min(anim.delay, remaining);
        anim.delay -= spent;
        remaining -= spent;
      }
      if (remaining <= 0) return;
      anim.elapsed += remaining;
      const from = anim.from ?? record.current;
      const progress = Math.min(1, anim.elapsed / Math.max(1, anim.duration));
      record.current = from + (anim.to - from) * progress;
      if (progress >= 1) record.anim = null;
    });
  };

  const resetMockAnimations = () => registry.clear();

  return {
    __esModule: true,
    default: { View },
    useReducedMotion,
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withDelay,
    advanceMockAnimations,
    resetMockAnimations,
  };
});

const reanimatedMock = jest.requireMock('react-native-reanimated') as {
  advanceMockAnimations: (ms: number) => void;
  resetMockAnimations: () => void;
};
const { advanceMockAnimations, resetMockAnimations } = reanimatedMock;

const POSITIVE: [string, string] = ['pos0', 'pos1'];
const NEGATIVE: [string, string] = ['neg0', 'neg1'];
const MUTED: [string, string] = ['mut0', 'mut1'];
const SLOT: [string, string] = ['slot0', 'slot1'];

const buildConfig = (overrides: Partial<BarConfig> = {}): BarConfig => ({
  item: { value: 5, muted: false },
  hasBar: true,
  isPressable: true,
  isPositive: true,
  isGhostTrack: false,
  barHeight: 40,
  index: 0,
  isMuted: false,
  barGradientColors: POSITIVE,
  positiveGradientColors: POSITIVE,
  negativeGradientColors: NEGATIVE,
  mutedGradientColors: MUTED,
  topBackgroundColors: SLOT,
  bottomBackgroundColors: SLOT,
  ghostTrackColors: SLOT,
  barOpacity: 1,
  layout: 'centered',
  ...overrides,
});

const findNearestOpacity = (node: ReactTestInstance | null): number | undefined => {
  let current: ReactTestInstance | null = node;
  while (current) {
    const flattened = StyleSheet.flatten(current.props?.style);
    if (flattened && typeof flattened.opacity === 'number') {
      return flattened.opacity;
    }
    current = current.parent;
  }
  return undefined;
};

const getOpacityForGradient = (testId: string, getByTestId: (id: string) => ReactTestInstance): number | undefined => {
  const gradient = getByTestId(testId);
  return findNearestOpacity(gradient.parent);
};

const renderBar = (config: BarConfig, extraProps: { animated?: boolean } = {}) =>
  render(
    <PerformanceBar config={config} onBarPress={jest.fn()} height={120} barGap={2} barBorderRadius={6} animated={extraProps.animated ?? false} />,
  );

describe('PerformanceBar muted overlay behavior (static)', () => {
  beforeEach(() => {
    resetMockAnimations();
  });

  it('hides sign layers and shows muted overlay fully when muted at rest', () => {
    const { getByTestId } = renderBar(buildConfig({ item: { value: 5, muted: true }, isMuted: true }));

    expect(getOpacityForGradient('gradient-pos0-pos1', getByTestId)).toBe(0);
    expect(getOpacityForGradient('gradient-neg0-neg1', getByTestId)).toBe(0);
    expect(getOpacityForGradient('gradient-mut0-mut1', getByTestId)).toBe(1);
  });

  it('shows sign gradient for non-muted bars and keeps muted overlay hidden', () => {
    const { getByTestId } = renderBar(buildConfig({ item: { value: 5, muted: false }, isMuted: false }));

    expect(getOpacityForGradient('gradient-pos0-pos1', getByTestId)).toBe(1);
    expect(getOpacityForGradient('gradient-neg0-neg1', getByTestId)).toBe(0);
    expect(getOpacityForGradient('gradient-mut0-mut1', getByTestId)).toBe(0);
  });

  it('does not render a muted overlay when the color scheme has no muted gradient', () => {
    const { getByTestId, queryByTestId } = renderBar(buildConfig({ item: { value: 5, muted: true }, isMuted: true, mutedGradientColors: undefined }));

    expect(getOpacityForGradient('gradient-pos0-pos1', getByTestId)).toBe(1);
    expect(getOpacityForGradient('gradient-neg0-neg1', getByTestId)).toBe(0);
    expect(queryByTestId('gradient-mut0-mut1')).toBeNull();
  });
});

describe('PerformanceBar animated transitions (stateful mock)', () => {
  beforeEach(() => {
    resetMockAnimations();
  });

  it('does not flip sign colour up-front when a bar morphs from positive to negative; colour flips as it crosses the axis', () => {
    const positiveConfig = buildConfig({ item: { value: 5 }, isPositive: true, barHeight: 40 });
    const { getByTestId, rerender } = renderBar(positiveConfig, { animated: true });

    // Complete initial grow (stagger 0 at index 0, duration 320)
    advanceMockAnimations(400);
    rerender(<PerformanceBar config={positiveConfig} onBarPress={jest.fn()} height={120} barGap={2} barBorderRadius={6} animated />);

    // Sanity: fully positive after mount
    expect(getOpacityForGradient('gradient-pos0-pos1', getByTestId)).toBe(1);
    expect(getOpacityForGradient('gradient-neg0-neg1', getByTestId)).toBe(0);

    // Switch to a negative target — animation begins from +40 toward -40 over 320ms
    const negativeConfig = buildConfig({ item: { value: -5 }, isPositive: false, barHeight: 40 });
    rerender(<PerformanceBar config={negativeConfig} onBarPress={jest.fn()} height={120} barGap={2} barBorderRadius={6} animated />);

    // Still above the axis a third of the way through — colour must not have flipped yet
    advanceMockAnimations(100);
    rerender(<PerformanceBar config={negativeConfig} onBarPress={jest.fn()} height={120} barGap={2} barBorderRadius={6} animated />);
    expect(getOpacityForGradient('gradient-pos0-pos1', getByTestId)).toBe(1);
    expect(getOpacityForGradient('gradient-neg0-neg1', getByTestId)).toBe(0);

    // Past the midpoint the animated value is now negative — colour flips exactly on the crossing
    advanceMockAnimations(150);
    rerender(<PerformanceBar config={negativeConfig} onBarPress={jest.fn()} height={120} barGap={2} barBorderRadius={6} animated />);
    expect(getOpacityForGradient('gradient-pos0-pos1', getByTestId)).toBe(0);
    expect(getOpacityForGradient('gradient-neg0-neg1', getByTestId)).toBe(1);
  });

  it('holds the muted overlay opaque through the full height morph before revealing sign colour (muted → coloured)', () => {
    const mutedConfig = buildConfig({ item: { value: 5, muted: true }, isMuted: true, barHeight: 40 });
    const { getByTestId, rerender } = renderBar(mutedConfig, { animated: true });

    // Complete initial mount so muted overlay is fully in place
    advanceMockAnimations(400);
    rerender(<PerformanceBar config={mutedConfig} onBarPress={jest.fn()} height={120} barGap={2} barBorderRadius={6} animated />);
    expect(getOpacityForGradient('gradient-mut0-mut1', getByTestId)).toBe(1);

    // Switch to non-muted — fade is delayed by animationDuration (320ms) before running MUTED_FADE_DURATION (200ms)
    const colouredConfig = buildConfig({ item: { value: 5, muted: false }, isMuted: false, barHeight: 40 });
    rerender(<PerformanceBar config={colouredConfig} onBarPress={jest.fn()} height={120} barGap={2} barBorderRadius={6} animated />);

    // 200ms into the delay window — overlay still fully covers, sign colour still hidden
    advanceMockAnimations(200);
    rerender(<PerformanceBar config={colouredConfig} onBarPress={jest.fn()} height={120} barGap={2} barBorderRadius={6} animated />);
    expect(getOpacityForGradient('gradient-mut0-mut1', getByTestId)).toBe(1);
    expect(getOpacityForGradient('gradient-pos0-pos1', getByTestId)).toBe(0);

    // Halfway through the fade — overlay and sign cross-fade in sync (grey out, colour in)
    advanceMockAnimations(220);
    rerender(<PerformanceBar config={colouredConfig} onBarPress={jest.fn()} height={120} barGap={2} barBorderRadius={6} animated />);
    const midOverlay = getOpacityForGradient('gradient-mut0-mut1', getByTestId);
    expect(midOverlay).toBeGreaterThan(0);
    expect(midOverlay).toBeLessThan(1);
    expect(getOpacityForGradient('gradient-pos0-pos1', getByTestId)).toBeCloseTo(1 - (midOverlay ?? 0), 1);

    // Fade completes — sign colour fully revealed, no grey remains
    advanceMockAnimations(200);
    rerender(<PerformanceBar config={colouredConfig} onBarPress={jest.fn()} height={120} barGap={2} barBorderRadius={6} animated />);
    expect(getOpacityForGradient('gradient-mut0-mut1', getByTestId)).toBe(0);
    expect(getOpacityForGradient('gradient-pos0-pos1', getByTestId)).toBe(1);
  });

  it('snaps immediately to grey when a coloured bar turns muted (no fade needed — grey is the final state)', () => {
    const colouredConfig = buildConfig({ item: { value: 5, muted: false }, isMuted: false });
    const { getByTestId, rerender } = renderBar(colouredConfig, { animated: true });

    advanceMockAnimations(400);
    rerender(<PerformanceBar config={colouredConfig} onBarPress={jest.fn()} height={120} barGap={2} barBorderRadius={6} animated />);
    expect(getOpacityForGradient('gradient-mut0-mut1', getByTestId)).toBe(0);

    const mutedConfig = buildConfig({ item: { value: 5, muted: true }, isMuted: true });
    rerender(<PerformanceBar config={mutedConfig} onBarPress={jest.fn()} height={120} barGap={2} barBorderRadius={6} animated />);

    // No time advance needed — the muted-effect snapped the overlay to 1 on commit; a follow-up
    // rerender re-runs `useAnimatedStyle` so the mock reflects the post-effect value.
    rerender(<PerformanceBar config={mutedConfig} onBarPress={jest.fn()} height={120} barGap={2} barBorderRadius={6} animated />);
    expect(getOpacityForGradient('gradient-mut0-mut1', getByTestId)).toBe(1);
  });
});
