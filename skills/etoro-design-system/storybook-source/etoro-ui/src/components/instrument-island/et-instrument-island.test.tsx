import { act, fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { Gesture } from 'react-native-gesture-handler';

import { IslandInstrument } from './api/types';
import { EtInstrumentIsland } from './et-instrument-island';

jest.mock('react-native-reanimated', () => {
  const RN = require('react-native');
  const ReactLib = require('react');

  const AnimatedView = ReactLib.forwardRef((props, ref) => ReactLib.createElement(RN.View, { ...props, ref }));
  AnimatedView.displayName = 'Animated.View';

  const AnimatedScrollView = ReactLib.forwardRef((props, ref) => ReactLib.createElement(RN.ScrollView, { ...props, ref }));
  AnimatedScrollView.displayName = 'Animated.ScrollView';

  const interpolate = (value, inputRange, outputRange) => {
    const start = inputRange[0];
    const end = inputRange[inputRange.length - 1];
    const outputStart = outputRange[0];
    const outputEnd = outputRange[outputRange.length - 1];
    if (end === start) return outputStart;
    const progress = Math.min(Math.max((value - start) / (end - start), 0), 1);
    return outputStart + (outputEnd - outputStart) * progress;
  };

  return {
    __esModule: true,
    default: {
      ...RN.Animated,
      View: AnimatedView,
      ScrollView: AnimatedScrollView,
      createAnimatedComponent: (Component) => Component,
      scrollTo: jest.fn(),
    },
    View: AnimatedView,
    ScrollView: AnimatedScrollView,
    Extrapolation: { CLAMP: 'clamp' },
    Easing: {
      ease: jest.fn(),
      linear: jest.fn(),
      inOut: jest.fn(() => jest.fn()),
    },
    cancelAnimation: jest.fn(),
    createAnimatedComponent: (Component) => Component,
    interpolate,
    interpolateColor: (_value, _inputRange, outputRange) => outputRange[outputRange.length - 1],
    runOnJS: (fn) => fn,
    scrollTo: jest.fn(),
    useAnimatedReaction: jest.fn(),
    useAnimatedRef: () => ({ current: { scrollTo: jest.fn() } }),
    useAnimatedScrollHandler: (handler) => handler,
    useAnimatedStyle: (factory) => factory(),
    useDerivedValue: (factory) => ({ value: factory() }),
    useSharedValue: (value) => ({ value }),
    withRepeat: (value) => value,
    withSpring: (value) => value,
    withTiming: (value) => value,
  };
});

const items: IslandInstrument[] = [
  { id: 'btc', symbol: 'BTC', label: 'Bitcoin', fallback: 'BT', accentColor: '#F7931A' },
  { id: 'aapl', symbol: 'AAPL', label: 'Apple', fallback: 'AA' },
  { id: 'nvda', symbol: 'NVDA', label: 'Nvidia', fallback: 'NV' },
];

// The shared test harness mocks only a subset of Skia exports, so the glow
// (RoundedRect / SweepGradient / BlurMask) is disabled in these unit tests.
function renderIsland(props: Partial<React.ComponentProps<typeof EtInstrumentIsland>> = {}) {
  return render(<EtInstrumentIsland items={items} glow={false} testID="island" {...props} />);
}

// The shared mock makes Gesture.Pan() chainable and records each callback; this
// pulls the most recently built gesture so we can invoke its handlers directly.
function latestPanGesture() {
  const panMock = Gesture.Pan as unknown as jest.Mock;
  const { value } = panMock.mock.results[panMock.mock.results.length - 1];
  return {
    start: () => act(() => value.onStart.mock.calls[0][0]()),
    update: (translationX: number) => act(() => value.onUpdate.mock.calls[0][0]({ translationX })),
    end: () => act(() => value.onEnd.mock.calls[0][0]()),
  };
}

describe('EtInstrumentIsland', () => {
  it('renders nothing when there are no items', () => {
    const { queryByTestId } = renderIsland({ items: [] });
    expect(queryByTestId('island')).toBeNull();
  });

  it('focuses the first item by default and shows its label', () => {
    const { getByText } = renderIsland();
    expect(getByText('Bitcoin')).toBeTruthy();
  });

  it('honours defaultFocusedId', () => {
    const { getByText } = renderIsland({ defaultFocusedId: 'nvda' });
    expect(getByText('Nvidia')).toBeTruthy();
  });

  it('expands when the hold gesture starts', () => {
    const onExpandedChange = jest.fn();
    renderIsland({ onExpandedChange });
    latestPanGesture().start();
    expect(onExpandedChange).toHaveBeenCalledWith(true);
  });

  it('commits the centered instrument and collapses after a hold-scrub drag', () => {
    const onItemPress = jest.fn();
    const onExpandedChange = jest.fn();
    renderIsland({ isExpanded: true, defaultFocusedId: 'btc', onItemPress, onExpandedChange });

    const pan = latestPanGesture();
    pan.start();
    pan.update(-120); // a drag past the threshold marks this as a scrub
    pan.end();

    // The rail scroll is a no-op under the jest mock, so the centered item stays
    // the default — what matters is that a scrub commits it and collapses.
    expect(onItemPress).toHaveBeenCalledWith('btc');
    expect(onExpandedChange).toHaveBeenCalledWith(false);
  });

  it('stays expanded when the hold is released without a drag', () => {
    const onItemPress = jest.fn();
    const onExpandedChange = jest.fn();
    renderIsland({ isExpanded: true, onItemPress, onExpandedChange });

    const pan = latestPanGesture();
    pan.start();
    pan.end();

    expect(onItemPress).not.toHaveBeenCalled();
    expect(onExpandedChange).not.toHaveBeenCalledWith(false);
  });

  it('collapses when the backdrop is pressed while expanded', () => {
    const onExpandedChange = jest.fn();
    const { getByTestId } = renderIsland({ isExpanded: true, onExpandedChange });
    fireEvent.press(getByTestId('island-backdrop'));
    expect(onExpandedChange).toHaveBeenCalledWith(false);
  });

  it('reports focus changes when a rail item is activated', () => {
    const onFocusChange = jest.fn();
    const { getByLabelText } = renderIsland({ isExpanded: true, onFocusChange });
    fireEvent.press(getByLabelText('Apple'));
    expect(onFocusChange).toHaveBeenCalledWith('aapl');
  });

  it('activates (not re-focuses) the already-focused item', () => {
    const onItemPress = jest.fn();
    const onFocusChange = jest.fn();
    const { getByLabelText } = renderIsland({ isExpanded: true, defaultFocusedId: 'btc', onItemPress, onFocusChange });
    fireEvent.press(getByLabelText('Bitcoin'));
    expect(onItemPress).toHaveBeenCalledWith('btc');
    expect(onFocusChange).not.toHaveBeenCalled();
  });
});
