import { render } from '@testing-library/react-native';
import { Text } from 'react-native';

import { AnimatedContainer } from './animated-container.component';

jest.mock('react-native-reanimated', () => {
  const React = require('react');
  const { View } = require('react-native');
  const AnimatedView = React.forwardRef((props: unknown, ref: unknown) => React.createElement(View, { ...(props as object), ref }));
  AnimatedView.displayName = 'Animated.View';
  return {
    __esModule: true,
    default: {
      View: AnimatedView,
      createAnimatedComponent: (Component: unknown) => Component,
    },
    FadeIn: { duration: () => ({}) },
    FadeOut: { duration: () => ({}) },
    FadeInUp: { duration: () => ({}) },
    FadeOutDown: { duration: () => ({}) },
  };
});

describe('AnimatedContainer', () => {
  it('renders children', () => {
    const { getByText } = render(
      <AnimatedContainer>
        <Text>Child content</Text>
      </AnimatedContainer>,
    );
    expect(getByText('Child content')).toBeTruthy();
  });
});
