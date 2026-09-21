import { render } from '@testing-library/react-native';

import { EtExpandableCard } from '../et-expandable-card';

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper', () => ({}), {
  virtual: true,
});
jest.mock('react-native-svg', () => {
  const React = require('react');
  const { View } = require('react-native');
  function Mock(props: any) {
    return React.createElement(View, props, props.children);
  }
  Mock.Path = (props: any) => React.createElement(View, { testID: props.testID || 'mock-path', ...props }, props.children);
  Mock.Circle = (props: any) => React.createElement(View, props, props.children);
  Mock.Rect = (props: any) => React.createElement(View, props, props.children);
  return Mock;
});
jest.mock('react-native-reanimated', () => {
  const noop = () => {};
  const { View, ScrollView, Animated: RNAnimated } = require('react-native');
  return {
    __esModule: true,
    default: {
      ...RNAnimated,
      View,
      ScrollView,
    },
    View,
    ScrollView,
    // shared value helpers
    useSharedValue: (v: any) => ({ value: v }),
    useDerivedValue: (v: any) => ({ value: v }),
    // animation helpers
    withTiming: (v: any) => v,
    withSpring: (v: any) => v,
    withDelay: (_: any, v: any) => v,
    // hooks
    useAnimatedStyle: () => ({}),
    useAnimatedProps: () => ({}),
    useAnimatedReaction: noop,
    // components
    createAnimatedComponent: (Component: any) => Component,
    // worklets
    runOnJS: (fn: any) => fn,
    // misc
    Easing: { linear: noop, inOut: noop },
    FadeIn: {},
    FadeOut: {},
    Layout: {
      springify: () => ({}),
    },
    createSerializable: (v: any) => v,
  };
});
jest.mock('etoro-ui/core/hooks', () => ({
  useEtoroTheme: () => ({
    colors: {
      bgNeutralPrimary: '#ffffff',
      textDisabledPrimaryNeutral: '#cccccc',
      bgNeutralQuaternary: '#444444',
      dividerSecondary: '#dddddd',
      positiveGradientSecondary45: 'rgba(0,0,0,0.1)',
      positiveGradientSecondary25: 'rgba(0,0,0,0.05)',
      positiveGradientSecondary0: 'rgba(0,0,0,0)',
      negativeGradientSecondary45: 'rgba(0,0,0,0.1)',
      negativeGradientSecondary25: 'rgba(0,0,0,0.05)',
      negativeGradientSecondary0: 'rgba(0,0,0,0)',
    },
    isDarkMode: false,
  }),
}));

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');

  RN.NativeModules = RN.NativeModules || {};
  RN.NativeModules.DevMenu = RN.NativeModules.DevMenu || {};
  RN.NativeModules.SettingsManager = RN.NativeModules.SettingsManager || {
    settings: { AppleLocale: 'en_US', AppleLanguages: ['en-US'] },
    getConstants: () => ({
      settings: { AppleLocale: 'en_US', AppleLanguages: ['en-US'] },
    }),
  };

  RN.TurboModuleRegistry = {
    getEnforcing: () => ({}),
    get: () => ({}),
  };
  RN.useColorScheme = () => 'light';

  return RN;
});

describe('EtExpandableCard', () => {
  const collapsed = <></>;
  const expanded = <></>;

  it('uses collapsedFillColor when provided', () => {
    const collapsedFillColor = '#ABCDEF';
    const { getByTestId } = render(
      <EtExpandableCard collapsedContent={collapsed} expandedContent={expanded} collapsedFillColor={collapsedFillColor} />,
    );

    const path = getByTestId('mock-path');
    expect(path.props.fill).toBe(collapsedFillColor);
  });

  it('falls back to light fill when collapsedFillColor is not provided', () => {
    const { getByTestId } = render(<EtExpandableCard collapsedContent={collapsed} expandedContent={expanded} />);

    const path = getByTestId('mock-path');
    expect(path.props.fill).toBe('#fff');
  });
});
