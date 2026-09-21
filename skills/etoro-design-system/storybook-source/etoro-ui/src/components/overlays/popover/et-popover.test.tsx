import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { Text, View } from 'react-native';

import { EtPopover } from './et-popover';

// Mock the navigation theme hook
jest.mock('@react-navigation/native', () => ({
  useTheme: () => ({ dark: false }),
  DefaultTheme: {
    colors: {
      primary: '#007AFF',
      background: '#FFFFFF',
      card: '#FFFFFF',
      text: '#000000',
      border: '#E5E5E5',
      notification: '#FF3B30',
    },
  },
  DarkTheme: {
    colors: {
      primary: '#0A84FF',
      background: '#000000',
      card: '#1C1C1E',
      text: '#FFFFFF',
      border: '#38383A',
      notification: '#FF453A',
    },
  },
}));

// Mock the theme hook
jest.mock('../../../core/hooks', () => ({
  useEtoroTheme: () => ({
    colors: {
      textPrimaryNeutral: '#1A1A1A',
      textInvertedPrimaryNeutral: '#FFFFFF',
      bgNeutralPrimary: '#FFFFFF',
    },
  }),
}));

// The inline anchor mode resolves text direction via DI at render time
// (`etInject(LOCALIZATION_LANGUAGE_MANAGER_TOKEN).getCurrentDirection()`).
// Stub the container so the inline path can render in isolation; default to LTR.
const mockGetCurrentDirection = jest.fn(() => 'ltr');
jest.mock('@etoro/common/di/core', () => ({
  etInject: jest.fn(() => ({ getCurrentDirection: mockGetCurrentDirection })),
}));

describe('EtPopover', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Rendering', () => {
    it('should render when visible is true', () => {
      render(
        <EtPopover.Root visible={true} showDelay={0} testID="popover">
          <EtPopover.Target>
            <View testID="target" />
          </EtPopover.Target>
          <EtPopover.Content>
            <EtPopover.Text>Test content</EtPopover.Text>
          </EtPopover.Content>
        </EtPopover.Root>,
      );

      expect(screen.getByTestId('popover')).toBeTruthy();
      expect(screen.getByText('Test content')).toBeTruthy();
    });

    it('should not render content when visible is false', () => {
      render(
        <EtPopover.Root visible={false} showDelay={0} testID="popover">
          <EtPopover.Target>
            <View testID="target" />
          </EtPopover.Target>
          <EtPopover.Content>
            <EtPopover.Text>Test content</EtPopover.Text>
          </EtPopover.Content>
        </EtPopover.Root>,
      );

      // Root should still render (for the target)
      expect(screen.getByTestId('popover')).toBeTruthy();
      // But content should not be visible
      expect(screen.queryByText('Test content')).toBeNull();
    });

    it('should render text content', () => {
      render(
        <EtPopover.Root visible={true} showDelay={0}>
          <EtPopover.Target>
            <View />
          </EtPopover.Target>
          <EtPopover.Content>
            <EtPopover.Text>Hello World</EtPopover.Text>
          </EtPopover.Content>
        </EtPopover.Root>,
      );

      expect(screen.getByText('Hello World')).toBeTruthy();
    });

    it('should render title content', () => {
      render(
        <EtPopover.Root visible={true} showDelay={0}>
          <EtPopover.Target>
            <View />
          </EtPopover.Target>
          <EtPopover.Content>
            <EtPopover.Title>My Title</EtPopover.Title>
          </EtPopover.Content>
        </EtPopover.Root>,
      );

      expect(screen.getByText('My Title')).toBeTruthy();
    });

    it('should render button', () => {
      const onPress = jest.fn();
      render(
        <EtPopover.Root visible={true} showDelay={0}>
          <EtPopover.Target>
            <View />
          </EtPopover.Target>
          <EtPopover.Content>
            <EtPopover.Button onPress={onPress}>Click Me</EtPopover.Button>
          </EtPopover.Content>
        </EtPopover.Root>,
      );

      expect(screen.getByText('Click Me')).toBeTruthy();
    });

    it('should render close button', () => {
      render(
        <EtPopover.Root visible={true} showDelay={0}>
          <EtPopover.Target>
            <View />
          </EtPopover.Target>
          <EtPopover.Content>
            <EtPopover.CloseButton testID="close-btn" />
          </EtPopover.Content>
        </EtPopover.Root>,
      );

      expect(screen.getByTestId('close-btn')).toBeTruthy();
    });

    it('should render arrow by default', () => {
      render(
        <EtPopover.Root visible={true} showDelay={0}>
          <EtPopover.Target>
            <View />
          </EtPopover.Target>
          <EtPopover.Content>
            <EtPopover.Text>Content</EtPopover.Text>
          </EtPopover.Content>
        </EtPopover.Root>,
      );

      // Arrow should be rendered by default even without explicit <EtPopover.Arrow />
      expect(screen.getByText('Content')).toBeTruthy();
    });

    it('should render custom arrow when provided', () => {
      render(
        <EtPopover.Root visible={true} showDelay={0}>
          <EtPopover.Target>
            <View />
          </EtPopover.Target>
          <EtPopover.Content>
            <EtPopover.Text>Content</EtPopover.Text>
            <EtPopover.Arrow testID="et-popover-arrow" />
          </EtPopover.Content>
        </EtPopover.Root>,
      );

      // Verify the custom arrow element is rendered via testID
      expect(screen.getByTestId('et-popover-arrow')).toBeTruthy();
      expect(screen.getByText('Content')).toBeTruthy();
    });

    it('should hide arrow when hideArrow is true', () => {
      render(
        <EtPopover.Root visible={true} showDelay={0} hideArrow>
          <EtPopover.Target>
            <View />
          </EtPopover.Target>
          <EtPopover.Content>
            <EtPopover.Text>Content</EtPopover.Text>
            <EtPopover.Arrow testID="et-popover-arrow" />
          </EtPopover.Content>
        </EtPopover.Root>,
      );

      // Arrow should not be rendered when hideArrow is true
      expect(screen.queryByTestId('et-popover-arrow')).toBeNull();
      expect(screen.getByText('Content')).toBeTruthy();
    });

    it('should render target element', () => {
      render(
        <EtPopover.Root visible={true} showDelay={0}>
          <EtPopover.Target>
            <Text>Target Element</Text>
          </EtPopover.Target>
          <EtPopover.Content>
            <EtPopover.Text>Content</EtPopover.Text>
          </EtPopover.Content>
        </EtPopover.Root>,
      );

      expect(screen.getByText('Target Element')).toBeTruthy();
    });
  });

  describe('Compound Components', () => {
    it('should render all compound children together (arrow is automatic)', () => {
      const onPress = jest.fn();
      render(
        <EtPopover.Root visible={true} showDelay={0}>
          <EtPopover.Target>
            <Text>Target</Text>
          </EtPopover.Target>
          <EtPopover.Content>
            <EtPopover.Title>Title</EtPopover.Title>
            <EtPopover.Text>Description</EtPopover.Text>
            <EtPopover.Button onPress={onPress}>Action</EtPopover.Button>
            <EtPopover.CloseButton testID="close" />
            {/* Arrow is now shown by default - no need to explicitly add it */}
          </EtPopover.Content>
        </EtPopover.Root>,
      );

      expect(screen.getByText('Target')).toBeTruthy();
      expect(screen.getByText('Title')).toBeTruthy();
      expect(screen.getByText('Description')).toBeTruthy();
      expect(screen.getByText('Action')).toBeTruthy();
      expect(screen.getByTestId('close')).toBeTruthy();
    });
  });

  describe('Interactions', () => {
    it('should call onPress when button is pressed', () => {
      const onPress = jest.fn();
      render(
        <EtPopover.Root visible={true} showDelay={0}>
          <EtPopover.Target>
            <View />
          </EtPopover.Target>
          <EtPopover.Content>
            <EtPopover.Button onPress={onPress}>Click</EtPopover.Button>
          </EtPopover.Content>
        </EtPopover.Root>,
      );

      fireEvent.press(screen.getByText('Click'));
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when close button is pressed', () => {
      const onClose = jest.fn();
      render(
        <EtPopover.Root visible={true} showDelay={0} onClose={onClose}>
          <EtPopover.Target>
            <View />
          </EtPopover.Target>
          <EtPopover.Content>
            <EtPopover.CloseButton testID="close" />
          </EtPopover.Content>
        </EtPopover.Root>,
      );

      fireEvent.press(screen.getByTestId('close'));
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should call custom onPress when close button has custom handler', () => {
      const onClose = jest.fn();
      const customOnPress = jest.fn();
      render(
        <EtPopover.Root visible={true} showDelay={0} onClose={onClose}>
          <EtPopover.Target>
            <View />
          </EtPopover.Target>
          <EtPopover.Content>
            <EtPopover.CloseButton testID="close" onPress={customOnPress} />
          </EtPopover.Content>
        </EtPopover.Root>,
      );

      fireEvent.press(screen.getByTestId('close'));
      expect(customOnPress).toHaveBeenCalledTimes(1);
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('Timing', () => {
    it('should show immediately when showDelay is 0', () => {
      render(
        <EtPopover.Root visible={true} showDelay={0} testID="popover">
          <EtPopover.Target>
            <View />
          </EtPopover.Target>
          <EtPopover.Content>
            <EtPopover.Text>Content</EtPopover.Text>
          </EtPopover.Content>
        </EtPopover.Root>,
      );

      expect(screen.getByText('Content')).toBeTruthy();
    });

    it('should delay showing when showDelay is set', async () => {
      render(
        <EtPopover.Root visible={true} showDelay={1000} testID="popover">
          <EtPopover.Target>
            <View />
          </EtPopover.Target>
          <EtPopover.Content>
            <EtPopover.Text>Content</EtPopover.Text>
          </EtPopover.Content>
        </EtPopover.Root>,
      );

      // Should not be visible initially
      expect(screen.queryByText('Content')).toBeNull();

      // Advance timers
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      // Should be visible after delay
      expect(screen.getByText('Content')).toBeTruthy();
    });

    it('should auto-hide when autoHideDelay is set', async () => {
      const onClose = jest.fn();
      render(
        <EtPopover.Root visible={true} showDelay={0} autoHideDelay={2000} onClose={onClose} testID="popover">
          <EtPopover.Target>
            <View />
          </EtPopover.Target>
          <EtPopover.Content>
            <EtPopover.Text>Content</EtPopover.Text>
          </EtPopover.Content>
        </EtPopover.Root>,
      );

      // Should be visible initially
      expect(screen.getByText('Content')).toBeTruthy();

      // Advance timers past auto-hide delay
      act(() => {
        jest.advanceTimersByTime(2000);
      });

      // onClose should have been called
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should not auto-hide when autoHideDelay is 0', () => {
      const onClose = jest.fn();
      render(
        <EtPopover.Root visible={true} showDelay={0} autoHideDelay={0} onClose={onClose} testID="popover">
          <EtPopover.Target>
            <View />
          </EtPopover.Target>
          <EtPopover.Content>
            <EtPopover.Text>Content</EtPopover.Text>
          </EtPopover.Content>
        </EtPopover.Root>,
      );

      // Advance timers significantly
      act(() => {
        jest.advanceTimersByTime(10000);
      });

      // onClose should not have been called
      expect(onClose).not.toHaveBeenCalled();
      expect(screen.getByText('Content')).toBeTruthy();
    });
  });

  describe('Popover Directions', () => {
    const directions = ['above', 'below', 'left', 'right'] as const;

    directions.forEach((direction) => {
      it(`should render with popoverDirection="${direction}" and position arrow correctly`, () => {
        render(
          <EtPopover.Root visible={true} showDelay={0} popoverDirection={direction} testID="popover">
            <EtPopover.Target>
              <View />
            </EtPopover.Target>
            <EtPopover.Content>
              <EtPopover.Text>Content</EtPopover.Text>
              {/* Arrow is now shown by default, but we add testID to verify dimensions */}
              <EtPopover.Arrow testID="et-popover-arrow" />
            </EtPopover.Content>
          </EtPopover.Root>,
        );

        expect(screen.getByTestId('popover')).toBeTruthy();
        expect(screen.getByText('Content')).toBeTruthy();

        // Verify arrow is rendered with correct dimensions based on direction
        // Vertical directions (above/below) have width=14, height=7
        // Horizontal directions (left/right) have width=7, height=14
        const arrow = screen.getByTestId('et-popover-arrow');
        expect(arrow).toBeTruthy();

        const isVertical = direction === 'above' || direction === 'below';
        const expectedDimensions = isVertical ? { width: 14, height: 7 } : { width: 7, height: 14 };

        expect(arrow.props.style).toEqual(expect.arrayContaining([expect.objectContaining(expectedDimensions)]));
      });
    });
  });

  describe('Arrow Alignments', () => {
    const alignments = ['start', 'center', 'end'] as const;

    alignments.forEach((alignment) => {
      it(`should render with arrowAlignment="${alignment}"`, () => {
        render(
          <EtPopover.Root visible={true} showDelay={0} arrowAlignment={alignment} testID="popover">
            <EtPopover.Target>
              <View />
            </EtPopover.Target>
            <EtPopover.Content>
              <EtPopover.Text>Content</EtPopover.Text>
              <EtPopover.Arrow />
            </EtPopover.Content>
          </EtPopover.Root>,
        );

        expect(screen.getByTestId('popover')).toBeTruthy();
      });
    });
  });

  describe('Accessibility', () => {
    it('should apply accessibilityLabel to root', () => {
      render(
        <EtPopover.Root visible={true} showDelay={0} accessibilityLabel="Important notification" testID="popover">
          <EtPopover.Target>
            <View />
          </EtPopover.Target>
          <EtPopover.Content>
            <EtPopover.Text>Content</EtPopover.Text>
          </EtPopover.Content>
        </EtPopover.Root>,
      );

      const popover = screen.getByTestId('popover');
      expect(popover.props.accessibilityLabel).toBe('Important notification');
    });

    it('should have accessibilityLabel on close button', () => {
      render(
        <EtPopover.Root visible={true} showDelay={0}>
          <EtPopover.Target>
            <View />
          </EtPopover.Target>
          <EtPopover.Content>
            <EtPopover.CloseButton testID="close" />
          </EtPopover.Content>
        </EtPopover.Root>,
      );

      const closeButton = screen.getByTestId('close');
      expect(closeButton.props.accessibilityLabel).toBe('Close popover');
    });
  });

  describe('Anchor Mode - inline', () => {
    beforeEach(() => {
      mockGetCurrentDirection.mockReturnValue('ltr');
    });

    it('should render content when visible in inline mode', () => {
      render(
        <EtPopover.Root visible={true} showDelay={0} anchorMode="inline" testID="popover">
          <EtPopover.Target>
            <View testID="target" />
          </EtPopover.Target>
          <EtPopover.Content>
            <EtPopover.Text>Inline content</EtPopover.Text>
          </EtPopover.Content>
        </EtPopover.Root>,
      );

      expect(screen.getByTestId('popover')).toBeTruthy();
      expect(screen.getByTestId('target')).toBeTruthy();
      expect(screen.getByText('Inline content')).toBeTruthy();
    });

    it('should not render content when not visible in inline mode', () => {
      render(
        <EtPopover.Root visible={false} showDelay={0} anchorMode="inline" testID="popover">
          <EtPopover.Target>
            <View testID="target" />
          </EtPopover.Target>
          <EtPopover.Content>
            <EtPopover.Text>Inline content</EtPopover.Text>
          </EtPopover.Content>
        </EtPopover.Root>,
      );

      // Target stays mounted; the bubble itself is gone (inline mode returns null when hidden).
      expect(screen.getByTestId('target')).toBeTruthy();
      expect(screen.queryByText('Inline content')).toBeNull();
    });

    it('should call onClose when close button is pressed in inline mode', () => {
      const onClose = jest.fn();
      render(
        <EtPopover.Root visible={true} showDelay={0} anchorMode="inline" onClose={onClose}>
          <EtPopover.Target>
            <View />
          </EtPopover.Target>
          <EtPopover.Content>
            <EtPopover.Text>Inline content</EtPopover.Text>
            <EtPopover.CloseButton testID="close" />
          </EtPopover.Content>
        </EtPopover.Root>,
      );

      fireEvent.press(screen.getByTestId('close'));
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should render the bubble content in every direction in inline mode', () => {
      const directions = ['above', 'below', 'left', 'right'] as const;

      directions.forEach((direction) => {
        const { unmount } = render(
          <EtPopover.Root visible={true} showDelay={0} anchorMode="inline" popoverDirection={direction} testID="popover">
            <EtPopover.Target>
              <View />
            </EtPopover.Target>
            <EtPopover.Content>
              <EtPopover.Text>Inline content</EtPopover.Text>
            </EtPopover.Content>
          </EtPopover.Root>,
        );

        expect(screen.getByText('Inline content')).toBeTruthy();
        unmount();
      });
    });

    it('should resolve cross-axis alignment via RTL direction without crashing', () => {
      mockGetCurrentDirection.mockReturnValue('rtl');

      render(
        <EtPopover.Root visible={true} showDelay={0} anchorMode="inline" arrowAlignment="start" testID="popover">
          <EtPopover.Target>
            <View />
          </EtPopover.Target>
          <EtPopover.Content>
            <EtPopover.Text>Inline content</EtPopover.Text>
          </EtPopover.Content>
        </EtPopover.Root>,
      );

      expect(screen.getByText('Inline content')).toBeTruthy();
    });
  });
});

describe('usePopoverContext', () => {
  it('should throw error when used outside EtPopover.Root', () => {
    // Suppress console.error for this test
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<EtPopover.Text>Text outside popover</EtPopover.Text>);
    }).toThrow('EtPopover compound components must be used within an EtPopover component');

    consoleError.mockRestore();
  });
});
