import { act, render } from '@testing-library/react-native';
import { Text, View } from 'react-native';

import { EtLazyMount } from './et-lazy-mount';

let mockViewportHeight = 500;
let mockYOffset = Number.POSITIVE_INFINITY;
let mockPrepare: (() => boolean) | undefined;
let mockReact: ((next: boolean, previous: boolean | null) => void) | undefined;

jest.mock('./use-lazy-mount-viewport-height', () => ({
  useLazyMountViewportHeight: () => mockViewportHeight,
}));

jest.mock('react-native-reanimated', () => ({
  runOnJS: (callback: () => void) => callback,
  useAnimatedReaction: (prepare: () => boolean, react: (next: boolean, previous: boolean | null) => void) => {
    mockPrepare = prepare;
    mockReact = react;
  },
  useSharedValue: () => ({
    get: () => mockYOffset,
    set: (next: number) => {
      mockYOffset = next;
    },
  }),
}));

describe('EtLazyMount', () => {
  beforeEach(() => {
    mockViewportHeight = 500;
    mockYOffset = Number.POSITIVE_INFINITY;
    mockPrepare = undefined;
    mockReact = undefined;
  });

  it('mounts when the viewport grows and stays mounted when it shrinks', () => {
    const scrollY = { get: () => 0 };
    const { getByText, queryByText, rerender, UNSAFE_getByType } = render(
      <EtLazyMount scrollY={scrollY} placeholderHeight={200}>
        <Text>Deferred content</Text>
      </EtLazyMount>,
    );

    act(() => {
      UNSAFE_getByType(View).props.onLayout({ nativeEvent: { layout: { y: 1_200 } } });
    });
    expect(mockPrepare?.()).toBe(false);
    expect(queryByText('Deferred content')).toBeNull();

    mockViewportHeight = 700;
    rerender(
      <EtLazyMount scrollY={scrollY} placeholderHeight={200}>
        <Text>Deferred content</Text>
      </EtLazyMount>,
    );
    act(() => mockReact?.(mockPrepare?.() ?? false, false));
    expect(getByText('Deferred content')).toBeTruthy();

    mockViewportHeight = 300;
    rerender(
      <EtLazyMount scrollY={scrollY} placeholderHeight={200}>
        <Text>Deferred content</Text>
      </EtLazyMount>,
    );
    act(() => mockReact?.(mockPrepare?.() ?? false, true));
    expect(getByText('Deferred content')).toBeTruthy();
  });
});
