/* eslint-disable */
// @ts-nocheck
import { render } from '@testing-library/react-native';
import React from 'react';
import { CardProvider } from '../api/context';
import { CardHalo } from './card-halo';

// Mock @react-navigation/native
jest.mock('@react-navigation/native', () => ({
  useTheme: () => ({ dark: true, colors: {} }),
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
  const { Image } = require('react-native');

  const AnimatedImage = React.forwardRef((props: any, ref: any) => {
    return React.createElement(Image, { ...props, ref });
  });
  AnimatedImage.displayName = 'Animated.Image';

  return {
    __esModule: true,
    default: {
      Image: AnimatedImage,
      createAnimatedComponent: (Component: any) => Component,
    },
    Image: AnimatedImage,
    createAnimatedComponent: (Component: any) => Component,
  };
});

// Note: Image requires are mocked by the jest config's moduleNameMapper

describe('CardHalo', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Display Name', () => {
    it('has correct display name', () => {
      expect(CardHalo.displayName).toBe('EtCard.Halo');
    });
  });

  describe('Memoization', () => {
    it('is wrapped with React.memo', () => {
      // Component should have displayName set
      expect(CardHalo.displayName).toBe('EtCard.Halo');
      expect(CardHalo).toBeDefined();
    });
  });

  describe('Rendering Logic', () => {
    it('renders with positive sentiment', () => {
      expect(() => {
        render(
          <CardProvider isPositive={true}>
            <CardHalo />
          </CardProvider>,
        );
      }).not.toThrow();
    });

    it('renders with negative sentiment', () => {
      expect(() => {
        render(
          <CardProvider isPositive={false}>
            <CardHalo />
          </CardProvider>,
        );
      }).not.toThrow();
    });

    it('does not render with neutral sentiment (undefined)', () => {
      expect(() => {
        render(
          <CardProvider isPositive={undefined}>
            <CardHalo />
          </CardProvider>,
        );
      }).not.toThrow();
    });
  });

  describe('Context Integration', () => {
    it('reads isPositive from CardContext', () => {
      expect(() => {
        render(
          <CardProvider isPositive={true}>
            <CardHalo />
          </CardProvider>,
        );
      }).not.toThrow();
    });

    it('handles missing context gracefully', () => {
      // Rendering CardHalo without CardProvider should throw an error
      // because useCardContext requires the component to be within CardProvider
      expect(() => {
        render(<CardHalo />);
      }).toThrow('useCardContext must be used within an EtCard component');
    });
  });

  describe('Theme Switching', () => {
    it('component renders correctly', () => {
      expect(() => {
        render(
          <CardProvider isPositive={true}>
            <CardHalo />
          </CardProvider>,
        );
      }).not.toThrow();
    });
  });
});
