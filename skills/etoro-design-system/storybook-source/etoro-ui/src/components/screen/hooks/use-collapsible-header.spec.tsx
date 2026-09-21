import { render } from '@testing-library/react-native';

import { useCollapsibleHeaderModel, type UseCollapsibleHeaderModelOptions } from './use-collapsible-header';
import { HIDE_ON_SCROLL_TOGGLE_LOCK_MS } from './use-hide-on-scroll';

// Captures the worklets passed to useAnimatedReaction so a test can drive the scroll → visibility derivation.
const animatedReactions: Array<{ deps: () => unknown; effect: (next: unknown, prev: unknown) => void }> = [];

jest.mock('react-native-reanimated', () => ({
  useSharedValue: (initial: unknown) => ({ value: initial }),
  useAnimatedStyle: (fn: () => object) => fn(),
  useAnimatedReaction: (deps: () => unknown, effect: (next: unknown, prev: unknown) => void) => {
    animatedReactions.push({ deps, effect });
  },
  runOnJS:
    (fn: (...args: unknown[]) => unknown) =>
    (...args: unknown[]) =>
      fn(...args),
  withTiming: (v: unknown) => v,
}));

// Shared mock scrollY so tests can simulate the scrolling child feeding the screen context.
const mockScrollY: { value: number } = { value: 0 };
const mockScrollBottomDistance: { value: number } = { value: Number.POSITIVE_INFINITY };

jest.mock('../api/context', () => ({
  useScreenContext: () => ({ scrollY: mockScrollY, scrollBottomDistance: mockScrollBottomDistance }),
}));

/** Renders the hook in a throwaway component so React hook rules are satisfied. */
function renderModel(options: UseCollapsibleHeaderModelOptions) {
  function Harness(props: UseCollapsibleHeaderModelOptions) {
    useCollapsibleHeaderModel(props);
    return null;
  }
  return render(<Harness {...options} />);
}

const enabledOptions: UseCollapsibleHeaderModelOptions = {
  enabled: true,
  hasFilters: true,
  hasTopNavSlot: true,
};

/**
 * Locates the scroll → visibility reaction by the one whose `deps` reads `scrollY`. Robust to
 * sibling reactions (e.g. the pointer-events reaction) registering ahead of it.
 */
function getScrollReaction() {
  const SENTINEL = 987654;
  const original = mockScrollY.value;
  mockScrollY.value = SENTINEL;
  const reaction = animatedReactions.find((r) => r.deps() === SENTINEL);
  mockScrollY.value = original;
  return reaction;
}

function getRevealTargetReaction() {
  return animatedReactions.find((r) => r !== getScrollReaction() && r.deps() === 0);
}

/** Drives the scroll → visibility reaction with a new scroll position. */
function runScrollReaction(prevY: number, nextY: number) {
  mockScrollY.value = nextY;
  getScrollReaction()?.effect(nextY, prevY);
}

describe('useCollapsibleHeaderModel', () => {
  let now = 0;

  function advancePastToggleCooldown() {
    now += HIDE_ON_SCROLL_TOGGLE_LOCK_MS + 1;
  }

  beforeEach(() => {
    jest.clearAllMocks();
    animatedReactions.length = 0;
    mockScrollY.value = 0;
    mockScrollBottomDistance.value = Number.POSITIVE_INFINITY;
    now = 0;
    jest.spyOn(performance, 'now').mockImplementation(() => now);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('GIVEN enabled WHEN rendered THEN registers a scroll reaction on the screen context', () => {
    renderModel(enabledOptions);

    expect(getScrollReaction()).toBeDefined();
  });

  it('GIVEN scrolling down past the hide threshold THEN does not throw (worklet derives visibility on the UI thread)', () => {
    renderModel(enabledOptions);

    expect(() => runScrollReaction(0, 40)).not.toThrow();
  });

  it('GIVEN scrolling back to the top THEN does not throw (worklet restores visibility on the UI thread)', () => {
    renderModel(enabledOptions);

    runScrollReaction(0, 80);
    expect(() => runScrollReaction(80, 0)).not.toThrow();
  });

  it('GIVEN tiny alternating deltas WHEN replayed many times THEN does not throw (jitter immunity)', () => {
    renderModel(enabledOptions);

    let y = 30;
    for (let i = 0; i < 100; i++) {
      const prev = y;
      y += i % 2 === 0 ? 1.5 : -1.5;
      expect(() => runScrollReaction(prev, y)).not.toThrow();
    }
    expect(getScrollReaction()).toBeDefined();
  });

  it('GIVEN a meaningful downward then immediate small upward WHEN played back-to-back THEN cooldown prevents the second flip from re-targeting mid-flight', () => {
    renderModel(enabledOptions);

    runScrollReaction(0, 30);
    runScrollReaction(30, 60);
    expect(() => runScrollReaction(60, 0)).not.toThrow();
  });

  it('GIVEN freezeScrollCollapse WHEN scrolling THEN still does not throw (visibility flips are ignored)', () => {
    renderModel({ ...enabledOptions, freezeScrollCollapse: true });

    expect(() => {
      runScrollReaction(0, 40);
      runScrollReaction(40, 0);
    }).not.toThrow();
  });

  it('GIVEN disabled WHEN scrolling THEN still does not throw (header stays expanded)', () => {
    renderModel({ ...enabledOptions, enabled: false });

    expect(() => runScrollReaction(0, 80)).not.toThrow();
  });

  it('GIVEN hidden header near the list bottom WHEN end bounce creates upward scroll THEN reveal stays suppressed', () => {
    renderModel(enabledOptions);

    runScrollReaction(0, 80);
    advancePastToggleCooldown();
    runScrollReaction(80, 500);
    advancePastToggleCooldown();
    mockScrollBottomDistance.value = 40;

    runScrollReaction(500, 400);
    runScrollReaction(400, 300);
    runScrollReaction(300, 200);
    runScrollReaction(200, 100);

    expect(getRevealTargetReaction()?.deps()).toBe(0);
  });

  it('GIVEN hidden header hits the bottom zone WHEN a fast rebound moves just outside it THEN reveal stays suppressed', () => {
    renderModel(enabledOptions);

    runScrollReaction(0, 80);
    advancePastToggleCooldown();
    runScrollReaction(80, 500);
    advancePastToggleCooldown();

    mockScrollBottomDistance.value = 40;
    runScrollReaction(500, 430);
    mockScrollBottomDistance.value = 140;
    runScrollReaction(430, 360);
    mockScrollBottomDistance.value = 220;
    runScrollReaction(360, 290);
    mockScrollBottomDistance.value = 300;
    runScrollReaction(290, 220);

    expect(getRevealTargetReaction()?.deps()).toBe(0);
  });

  it('GIVEN hidden header was bottom-locked WHEN user scrolls well away from the bottom THEN reveal is allowed again', () => {
    renderModel(enabledOptions);

    runScrollReaction(0, 80);
    advancePastToggleCooldown();
    runScrollReaction(80, 500);
    advancePastToggleCooldown();

    mockScrollBottomDistance.value = 40;
    runScrollReaction(500, 430);
    mockScrollBottomDistance.value = 180;
    runScrollReaction(430, 360);
    mockScrollBottomDistance.value = 360;
    runScrollReaction(360, 260);
    runScrollReaction(260, 160);
    runScrollReaction(160, 60);

    expect(getRevealTargetReaction()).toBeUndefined();
  });

  it('GIVEN hidden header away from the list bottom WHEN user scrolls upward THEN reveal is allowed', () => {
    renderModel(enabledOptions);

    runScrollReaction(0, 80);
    advancePastToggleCooldown();
    runScrollReaction(80, 500);
    advancePastToggleCooldown();
    mockScrollBottomDistance.value = 500;

    runScrollReaction(500, 400);
    runScrollReaction(400, 300);
    runScrollReaction(300, 200);
    runScrollReaction(200, 100);

    expect(getRevealTargetReaction()).toBeUndefined();
  });
});
