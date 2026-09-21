import { describe, expect, it } from '@jest/globals';
import { render } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';

import { EtMotionSwap } from './et-motion-swap';
import { buildMotionSwapLayerStyle } from './utils/build-motion-swap-layer-style';

// react-native-reanimated is mocked globally via jest.setup.ts

const FirstLayer = () => <Text testID="first">First</Text>;
const SecondLayer = () => <Text testID="second">Second</Text>;

FirstLayer.displayName = 'FirstLayer';
SecondLayer.displayName = 'SecondLayer';

describe('buildMotionSwapLayerStyle', () => {
  it('omits translate when opacityOnly is true', () => {
    expect(buildMotionSwapLayerStyle(0, 'x', 14, 'first', true)).toEqual({ opacity: 1 });
    expect(buildMotionSwapLayerStyle(1, 'x', 14, 'second', true)).toEqual({ opacity: 1 });
    expect(buildMotionSwapLayerStyle(0.5, 'x', 14, 'first', true).transform).toBeUndefined();
  });

  it('includes directional translate when opacityOnly is false', () => {
    expect(buildMotionSwapLayerStyle(0, 'x', 14, 'first', false)).toEqual({
      opacity: 1,
      transform: [{ translateX: 0 }],
    });
    expect(buildMotionSwapLayerStyle(0, 'x', 14, 'second', false)).toEqual({
      opacity: 0,
      transform: [{ translateX: 14 }],
    });
  });
});

describe('EtMotionSwap', () => {
  it('renders both layers simultaneously', () => {
    const { getByTestId } = render(<EtMotionSwap axis="x" showSecond={false} first={<FirstLayer />} second={<SecondLayer />} />);
    expect(getByTestId('first')).toBeTruthy();
    expect(getByTestId('second', { includeHiddenElements: true })).toBeTruthy();
  });

  it('renders with axis=y without throwing', () => {
    expect(() => render(<EtMotionSwap axis="y" showSecond={true} first={<FirstLayer />} second={<SecondLayer />} />)).not.toThrow();
    expect(buildMotionSwapLayerStyle(0, 'y', 14, 'second', false)).toEqual({
      opacity: 0,
      transform: [{ translateY: 14 }],
    });
  });

  it('accepts a testID prop on the container', () => {
    const { getByTestId } = render(
      <EtMotionSwap axis="x" showSecond={false} first={<FirstLayer />} second={<SecondLayer />} testID="swap-container" />,
    );
    expect(getByTestId('swap-container')).toBeTruthy();
  });

  it('accepts custom timingConfig without throwing', () => {
    expect(() =>
      render(<EtMotionSwap axis="x" showSecond={false} first={<FirstLayer />} second={<SecondLayer />} timingConfig={{ duration: 100 }} />),
    ).not.toThrow();
  });

  it('accepts a custom distance', () => {
    expect(() => render(<EtMotionSwap axis="x" showSecond={false} first={<FirstLayer />} second={<SecondLayer />} distance={24} />)).not.toThrow();
  });

  it('accepts opacityOnly and rasterizeLayers without throwing', () => {
    expect(() =>
      render(<EtMotionSwap axis="x" showSecond={false} first={<FirstLayer />} second={<SecondLayer />} opacityOnly rasterizeLayers />),
    ).not.toThrow();
  });
});
