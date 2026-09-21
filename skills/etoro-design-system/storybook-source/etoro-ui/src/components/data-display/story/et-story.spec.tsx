import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';
import { Text } from 'react-native';

import { EtStory } from './et-story';
import { StoryLabel } from './subcomponents/story-label';

// react-native-reanimated is mocked globally in jest.setup.ts

// Mock react-native-svg
jest.mock('react-native-svg', () => {
  const mockReact = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: (props: any) => mockReact.createElement(View, props, props.children),
    Svg: (props: any) => mockReact.createElement(View, { testID: 'svg', ...props }, props.children),
    Circle: (props: any) => mockReact.createElement(View, { testID: 'svg-circle', ...props }),
    Defs: (props: any) => mockReact.createElement(View, props, props.children),
    LinearGradient: (props: any) => mockReact.createElement(View, props, props.children),
    Stop: (props: any) => mockReact.createElement(View, props),
  };
});

// Mock useEtoroTheme hook
jest.mock('../../../core/hooks/use-etoro-theme', () => {
  const { colorsMock } = require('../../../core/hooks/__mocks__/colors-mock');
  return {
    useEtoroTheme: jest.fn(() => ({
      colors: colorsMock.colors,
      gradients: {},
      fonts: {},
    })),
  };
});

// Mock expo-linear-gradient
jest.mock('expo-linear-gradient', () => {
  const mockReact = require('react');
  const { View } = require('react-native');
  return {
    LinearGradient: (props: any) => mockReact.createElement(View, { testID: 'linear-gradient', ...props }, props.children),
  };
});

describe('EtStory', () => {
  const mockImageSource = 'https://example.com/tsla.png';
  const mockLabel = 'TSLA';
  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders with required props', () => {
      const { getAllByText } = render(
        <EtStory imageSource={mockImageSource}>
          <EtStory.Label>{mockLabel}</EtStory.Label>
        </EtStory>,
      );

      expect(getAllByText(mockLabel).length).toBeGreaterThan(0);
    });

    it('renders with testID', () => {
      const { getByTestId } = render(
        <EtStory imageSource={mockImageSource} testID="story-test">
          <EtStory.Label>{mockLabel}</EtStory.Label>
        </EtStory>,
      );

      expect(getByTestId('story-test')).toBeTruthy();
    });
  });

  describe('Watched State', () => {
    it('renders ring when story is unwatched (watched=false)', () => {
      const { getByTestId } = render(
        <EtStory imageSource={mockImageSource} watched={false}>
          <EtStory.Label>{mockLabel}</EtStory.Label>
        </EtStory>,
      );

      // Ring should appear when story hasn't been watched yet
      expect(getByTestId('story-ring')).toBeTruthy();
    });

    it('does not render ring when story is watched (watched=true)', () => {
      const { queryByTestId } = render(
        <EtStory imageSource={mockImageSource} watched={true} testID="watched-story">
          <EtStory.Label>{mockLabel}</EtStory.Label>
        </EtStory>,
      );

      // Ring should not appear once story has been watched
      expect(queryByTestId('story-ring')).toBeNull();
    });
  });

  describe('Loading State', () => {
    it('renders loading ring when loading', () => {
      const { getByTestId, queryByTestId } = render(
        <EtStory imageSource={mockImageSource} loading={true}>
          <EtStory.Label>{mockLabel}</EtStory.Label>
        </EtStory>,
      );

      // Loading ring should appear
      expect(getByTestId('loading-ring')).toBeTruthy();
      // Static watched ring should not appear
      expect(queryByTestId('story-ring')).toBeNull();
    });

    it('loading takes precedence over watched state', () => {
      const { getByTestId, queryByTestId } = render(
        <EtStory imageSource={mockImageSource} watched={false} loading={true}>
          <EtStory.Label>{mockLabel}</EtStory.Label>
        </EtStory>,
      );

      // Loading ring should appear instead of watched ring
      expect(getByTestId('loading-ring')).toBeTruthy();
      expect(queryByTestId('story-ring')).toBeNull();
    });

    it('does not call onPress when loading', () => {
      const { getByTestId } = render(
        <EtStory imageSource={mockImageSource} loading={true} onPress={mockOnPress} testID="loading-story">
          <EtStory.Label>{mockLabel}</EtStory.Label>
        </EtStory>,
      );

      fireEvent.press(getByTestId('loading-story'));
      expect(mockOnPress).not.toHaveBeenCalled();
    });

    it('sets accessibility state busy when loading', () => {
      const { getByTestId } = render(
        <EtStory imageSource={mockImageSource} loading={true} testID="loading-story">
          <EtStory.Label>{mockLabel}</EtStory.Label>
        </EtStory>,
      );

      const story = getByTestId('loading-story');
      expect(story.props.accessibilityState).toMatchObject({ busy: true });
    });
  });

  describe('Press Events', () => {
    it('calls onPress when pressed', () => {
      const { getByTestId } = render(
        <EtStory imageSource={mockImageSource} onPress={mockOnPress} testID="pressable-story">
          <EtStory.Label>{mockLabel}</EtStory.Label>
        </EtStory>,
      );

      fireEvent.press(getByTestId('pressable-story'));
      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it('does not call onPress when onPress is not provided', () => {
      const { getByTestId } = render(
        <EtStory imageSource={mockImageSource} testID="no-press-story">
          <EtStory.Label>{mockLabel}</EtStory.Label>
        </EtStory>,
      );

      // Should not throw
      expect(() => {
        fireEvent.press(getByTestId('no-press-story'));
      }).not.toThrow();
    });
  });

  describe('Accessibility', () => {
    it('has button accessibility role', () => {
      const { getByRole } = render(
        <EtStory imageSource={mockImageSource} onPress={mockOnPress}>
          <EtStory.Label>{mockLabel}</EtStory.Label>
        </EtStory>,
      );

      expect(getByRole('button')).toBeTruthy();
    });

    it('uses custom accessibility label when provided', () => {
      const { getByTestId } = render(
        <EtStory imageSource={mockImageSource} accessibilityLabel="Custom label" testID="accessible-story">
          <EtStory.Label>{mockLabel}</EtStory.Label>
        </EtStory>,
      );

      const story = getByTestId('accessible-story');
      expect(story.props.accessibilityLabel).toBe('Custom label');
    });

    it('generates accessibility label from EtStory.Label text', () => {
      const { getByTestId } = render(
        <EtStory imageSource={mockImageSource} testID="auto-label-story">
          <EtStory.Label>{mockLabel}</EtStory.Label>
        </EtStory>,
      );

      const story = getByTestId('auto-label-story');
      expect(story.props.accessibilityLabel).toBe(`Story: ${mockLabel}`);
    });
  });

  describe('Subcomponents', () => {
    it('has Label as static property', () => {
      expect(EtStory.Label).toBeDefined();
      expect(EtStory.Label).toBe(StoryLabel);
    });

    it('renders EtStory.Label subcomponent', () => {
      const { getAllByText } = render(
        <EtStory imageSource={mockImageSource}>
          <EtStory.Label>Custom Label</EtStory.Label>
        </EtStory>,
      );

      expect(getAllByText('Custom Label').length).toBeGreaterThan(0);
    });
  });

  describe('Component Structure', () => {
    it('is a valid React component', () => {
      expect(EtStory).toBeDefined();
      expect(typeof EtStory).toBe('object'); // React.memo wraps component as object
    });

    it('has displayName set', () => {
      expect(EtStory.displayName).toBe('EtStory');
    });
  });

  describe('Style Customization', () => {
    it('applies custom style to container', () => {
      const customStyle = { margin: 10 };
      const { getByTestId } = render(
        <EtStory imageSource={mockImageSource} style={customStyle} testID="styled-story">
          <EtStory.Label>{mockLabel}</EtStory.Label>
        </EtStory>,
      );

      const story = getByTestId('styled-story');
      expect(story.props.style).toEqual(expect.arrayContaining([expect.objectContaining(customStyle)]));
    });
  });

  describe('Edge Cases', () => {
    it('handles long label text', () => {
      const longLabel = 'A'.repeat(100);
      const { getAllByText } = render(
        <EtStory imageSource={mockImageSource}>
          <EtStory.Label>{longLabel}</EtStory.Label>
        </EtStory>,
      );

      expect(getAllByText(longLabel).length).toBeGreaterThan(0);
    });

    it('handles invalid image source gracefully', () => {
      expect(() => {
        render(
          <EtStory imageSource="invalid-url">
            <EtStory.Label>{mockLabel}</EtStory.Label>
          </EtStory>,
        );
      }).not.toThrow();
    });

    it('throws error when no children provided', () => {
      expect(() => {
        // @ts-expect-error - Testing runtime validation
        render(<EtStory imageSource={mockImageSource} />);
      }).toThrow('EtStory: Children are required');
    });

    it('throws error when invalid child is provided', () => {
      expect(() => {
        render(
          <EtStory imageSource={mockImageSource}>
            <Text>Invalid</Text>
          </EtStory>,
        );
      }).toThrow('EtStory: Invalid child passed');
    });
  });
});
