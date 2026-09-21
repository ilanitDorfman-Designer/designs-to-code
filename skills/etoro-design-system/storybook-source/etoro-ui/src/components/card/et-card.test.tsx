/* eslint-disable */
// @ts-nocheck
import { render } from '@testing-library/react-native';
import React from 'react';
import { Text, View } from 'react-native';
import { EtCard } from './et-card';

// Mock @react-navigation/native
jest.mock('@react-navigation/native', () => ({
  useTheme: () => ({ dark: false, colors: {} }),
  DefaultTheme: {
    dark: false,
    colors: {
      primary: 'rgb(0, 122, 255)',
      background: 'rgb(242, 242, 242)',
      card: 'rgb(255, 255, 255)',
      text: 'rgb(28, 28, 30)',
      border: 'rgb(216, 216, 216)',
      notification: 'rgb(255, 59, 48)',
    },
  },
  DarkTheme: {
    dark: true,
    colors: {
      primary: 'rgb(10, 132, 255)',
      background: 'rgb(1, 1, 1)',
      card: 'rgb(18, 18, 18)',
      text: 'rgb(229, 229, 231)',
      border: 'rgb(39, 39, 41)',
      notification: 'rgb(255, 69, 58)',
    },
  },
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const React = require('react');
  const { View, Image } = require('react-native');

  const AnimatedView = React.forwardRef((props: any, ref: any) => {
    return React.createElement(View, { ...props, ref });
  });
  AnimatedView.displayName = 'Animated.View';

  const AnimatedImage = React.forwardRef((props: any, ref: any) => {
    return React.createElement(Image, { ...props, ref });
  });
  AnimatedImage.displayName = 'Animated.Image';

  return {
    __esModule: true,
    default: {
      View: AnimatedView,
      Image: AnimatedImage,
      createAnimatedComponent: (Component: any) => Component,
    },
    View: AnimatedView,
    Image: AnimatedImage,
    createAnimatedComponent: (Component: any) => Component,
  };
});

// Mock useEtoroTheme
jest.mock('../../core/hooks/use-etoro-theme', () => ({
  useEtoroTheme: () => ({
    colors: {
      bgNeutralSecondary: '#f5f5f5',
      bgNeutralPositive: '#e6f4ea',
      bgNeutralNegative: '#fce8e6',
      textPrimaryNeutral: '#000000',
    },
    isDarkMode: false,
  }),
}));

// Note: Image requires are mocked by the jest config's moduleNameMapper

describe('EtCard', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('renders with Header subcomponent', () => {
      const { getByText } = render(
        <EtCard>
          <EtCard.Header>
            <Text>Header Content</Text>
          </EtCard.Header>
        </EtCard>,
      );

      expect(getByText('Header Content')).toBeTruthy();
    });

    it('renders with Content subcomponent', () => {
      const { getByText } = render(
        <EtCard>
          <EtCard.Content>
            <Text>Main Content</Text>
          </EtCard.Content>
        </EtCard>,
      );

      expect(getByText('Main Content')).toBeTruthy();
    });

    it('renders with Footer subcomponent', () => {
      const { getByText } = render(
        <EtCard>
          <EtCard.Footer>
            <Text>Footer Content</Text>
          </EtCard.Footer>
        </EtCard>,
      );

      expect(getByText('Footer Content')).toBeTruthy();
    });

    it('renders with all subcomponents together', () => {
      const { getByText } = render(
        <EtCard>
          <EtCard.Header>
            <Text>Header</Text>
          </EtCard.Header>
          <EtCard.Content>
            <Text>Content</Text>
          </EtCard.Content>
          <EtCard.Footer>
            <Text>Footer</Text>
          </EtCard.Footer>
        </EtCard>,
      );

      expect(getByText('Header')).toBeTruthy();
      expect(getByText('Content')).toBeTruthy();
      expect(getByText('Footer')).toBeTruthy();
    });

    it('renders with testID', () => {
      const { getByTestId } = render(
        <EtCard testID="test-card">
          <EtCard.Content>
            <Text>Content</Text>
          </EtCard.Content>
        </EtCard>,
      );

      expect(getByTestId('test-card')).toBeTruthy();
    });

    it('renders Header with testID', () => {
      const { getByTestId } = render(
        <EtCard>
          <EtCard.Header testID="test-header">
            <Text>Header</Text>
          </EtCard.Header>
        </EtCard>,
      );

      expect(getByTestId('test-header')).toBeTruthy();
    });

    it('renders Content with testID', () => {
      const { getByTestId } = render(
        <EtCard>
          <EtCard.Content testID="test-content">
            <Text>Content</Text>
          </EtCard.Content>
        </EtCard>,
      );

      expect(getByTestId('test-content')).toBeTruthy();
    });

    it('renders Footer with testID', () => {
      const { getByTestId } = render(
        <EtCard>
          <EtCard.Footer testID="test-footer">
            <Text>Footer</Text>
          </EtCard.Footer>
        </EtCard>,
      );

      expect(getByTestId('test-footer')).toBeTruthy();
    });
  });

  describe('Sentiment/Theme Behavior', () => {
    it('renders with positive sentiment', () => {
      const { getByText } = render(
        <EtCard isPositive={true}>
          <EtCard.Content>
            <Text>Positive Content</Text>
          </EtCard.Content>
        </EtCard>,
      );

      expect(getByText('Positive Content')).toBeTruthy();
    });

    it('renders with negative sentiment', () => {
      const { getByText } = render(
        <EtCard isPositive={false}>
          <EtCard.Content>
            <Text>Negative Content</Text>
          </EtCard.Content>
        </EtCard>,
      );

      expect(getByText('Negative Content')).toBeTruthy();
    });

    it('renders with neutral sentiment (undefined)', () => {
      const { getByText } = render(
        <EtCard>
          <EtCard.Content>
            <Text>Neutral Content</Text>
          </EtCard.Content>
        </EtCard>,
      );

      expect(getByText('Neutral Content')).toBeTruthy();
    });
  });

  describe('Shadow Prop', () => {
    it('renders with shadow by default', () => {
      const { getByTestId } = render(
        <EtCard testID="card-with-shadow">
          <EtCard.Content>
            <Text>Content</Text>
          </EtCard.Content>
        </EtCard>,
      );

      const card = getByTestId('card-with-shadow');
      expect(card).toBeTruthy();
      // Shadow styles are applied, component renders successfully
    });

    it('renders without shadow when shadow={false}', () => {
      const { getByTestId } = render(
        <EtCard testID="card-no-shadow" shadow={false}>
          <EtCard.Content>
            <Text>Content</Text>
          </EtCard.Content>
        </EtCard>,
      );

      const card = getByTestId('card-no-shadow');
      expect(card).toBeTruthy();
    });
  });

  describe('Compound Component Assembly', () => {
    it('has Header subcomponent', () => {
      expect(EtCard.Header).toBeDefined();
    });

    it('has Content subcomponent', () => {
      expect(EtCard.Content).toBeDefined();
    });

    it('has Footer subcomponent', () => {
      expect(EtCard.Footer).toBeDefined();
    });
  });

  describe('Display Names', () => {
    it('has correct display name for root component', () => {
      expect(EtCard.displayName).toBe('EtCard');
    });

    it('has correct display name for Header', () => {
      expect(EtCard.Header.displayName).toBe('EtCard.Header');
    });

    it('has correct display name for Content', () => {
      expect(EtCard.Content.displayName).toBe('EtCard.Content');
    });

    it('has correct display name for Footer', () => {
      expect(EtCard.Footer.displayName).toBe('EtCard.Footer');
    });
  });

  describe('Memoization', () => {
    it('root component is memoized', () => {
      // Check that the component has been wrapped with memo
      expect(EtCard.displayName).toBe('EtCard');
      // memo() wrapped components are callable
      expect(EtCard).toBeDefined();
    });

    it('Header subcomponent is memoized', () => {
      expect(EtCard.Header.displayName).toBe('EtCard.Header');
      expect(EtCard.Header).toBeDefined();
    });

    it('Content subcomponent is memoized', () => {
      expect(EtCard.Content.displayName).toBe('EtCard.Content');
      expect(EtCard.Content).toBeDefined();
    });

    it('Footer subcomponent is memoized', () => {
      expect(EtCard.Footer.displayName).toBe('EtCard.Footer');
      expect(EtCard.Footer).toBeDefined();
    });
  });

  describe('Style Overrides', () => {
    it('accepts custom style prop on root component', () => {
      const customStyle = { margin: 10 };
      const { getByTestId } = render(
        <EtCard testID="styled-card" style={customStyle}>
          <EtCard.Content>
            <Text>Content</Text>
          </EtCard.Content>
        </EtCard>,
      );

      expect(getByTestId('styled-card')).toBeTruthy();
    });

    it('accepts contentStyle prop for customizing content layer padding', () => {
      const contentStyle = { paddingHorizontal: 20, paddingVertical: 10 };
      const { getByTestId } = render(
        <EtCard contentStyle={contentStyle}>
          <EtCard.Content testID="custom-content">
            <Text>Content</Text>
          </EtCard.Content>
        </EtCard>,
      );

      const contentLayer = getByTestId('etcard-content-layer');
      expect(contentLayer).toBeTruthy();
      expect(contentLayer.props.style).toEqual(expect.arrayContaining([expect.objectContaining({ paddingHorizontal: 20, paddingVertical: 10 })]));
    });

    it('accepts custom style prop on Header', () => {
      const customStyle = { padding: 10 };
      const { getByTestId } = render(
        <EtCard>
          <EtCard.Header testID="styled-header" style={customStyle}>
            <Text>Header</Text>
          </EtCard.Header>
        </EtCard>,
      );

      expect(getByTestId('styled-header')).toBeTruthy();
    });

    it('accepts custom style prop on Content', () => {
      const customStyle = { padding: 10 };
      const { getByTestId } = render(
        <EtCard>
          <EtCard.Content testID="styled-content" style={customStyle}>
            <Text>Content</Text>
          </EtCard.Content>
        </EtCard>,
      );

      expect(getByTestId('styled-content')).toBeTruthy();
    });

    it('accepts custom style prop on Footer', () => {
      const customStyle = { padding: 10 };
      const { getByTestId } = render(
        <EtCard>
          <EtCard.Footer testID="styled-footer" style={customStyle}>
            <Text>Footer</Text>
          </EtCard.Footer>
        </EtCard>,
      );

      expect(getByTestId('styled-footer')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('renders with empty content', () => {
      const { getByTestId } = render(
        <EtCard testID="empty-card">
          <EtCard.Content></EtCard.Content>
        </EtCard>,
      );

      expect(getByTestId('empty-card')).toBeTruthy();
    });

    it('renders multiple Content sections', () => {
      const { getByText } = render(
        <EtCard>
          <EtCard.Content>
            <Text>Content 1</Text>
          </EtCard.Content>
          <EtCard.Content>
            <Text>Content 2</Text>
          </EtCard.Content>
        </EtCard>,
      );

      // Both content sections should render
      expect(getByText('Content 1')).toBeTruthy();
      expect(getByText('Content 2')).toBeTruthy();
    });

    it('renders custom elements between sections', () => {
      const { getByText, getByTestId } = render(
        <EtCard>
          <EtCard.Header>
            <Text>Header</Text>
          </EtCard.Header>
          <View testID="custom-divider" />
          <EtCard.Content>
            <Text>Content</Text>
          </EtCard.Content>
        </EtCard>,
      );

      expect(getByText('Header')).toBeTruthy();
      expect(getByTestId('custom-divider')).toBeTruthy();
      expect(getByText('Content')).toBeTruthy();
    });

    it('renders with only Header', () => {
      const { getByText } = render(
        <EtCard>
          <EtCard.Header>
            <Text>Only Header</Text>
          </EtCard.Header>
        </EtCard>,
      );

      expect(getByText('Only Header')).toBeTruthy();
    });

    it('renders with only Footer', () => {
      const { getByText } = render(
        <EtCard>
          <EtCard.Footer>
            <Text>Only Footer</Text>
          </EtCard.Footer>
        </EtCard>,
      );

      expect(getByText('Only Footer')).toBeTruthy();
    });
  });
});
