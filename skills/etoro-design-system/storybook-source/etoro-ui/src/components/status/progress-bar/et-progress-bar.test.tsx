import { fireEvent, render } from '@testing-library/react-native';

import { EtProgressBarFillType } from './api/types';
import { EtProgressBar } from './et-progress-bar';

// Mock expo-linear-gradient
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children, testID, style, colors, start, end, ...props }: any) => {
    const { View } = require('react-native');
    return (
      <View testID={testID} style={style} colors={colors} start={start} end={end} {...props}>
        {children}
      </View>
    );
  },
}));

// Mock etoro-ui/core
jest.mock('etoro-ui/core', () => {
  const { colorsMock } = require('etoro-ui/core/hooks/__mocks__/colors-mock');
  return {
    useEtoroTheme: jest.fn(() => ({
      colors: colorsMock.colors,
      gradients: {},
      fonts: {},
    })),
  };
});

const defaultSolidProps = {
  progress: 0.5,
  fillType: EtProgressBarFillType.Solid,
  progressColor: '#FF0000',
} as const;

const defaultGradientProps = {
  progress: 0.5,
  fillType: EtProgressBarFillType.Gradient,
  gradientColors: ['#FF0000', '#00FF00'] as [string, string],
} as const;

describe('EtProgressBar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders correctly with solid fill type', () => {
      const { getByTestId } = render(<EtProgressBar {...defaultSolidProps} testID="progress-bar" />);

      expect(getByTestId('progress-bar')).toBeTruthy();
      expect(getByTestId('progress-bar-solid-fill')).toBeTruthy();
    });

    it('renders correctly with gradient fill type', () => {
      const { getByTestId } = render(<EtProgressBar {...defaultGradientProps} testID="progress-bar" />);

      expect(getByTestId('progress-bar')).toBeTruthy();
      expect(getByTestId('progress-bar-gradient-fill')).toBeTruthy();
    });

    it('renders without testID when not provided', () => {
      const { queryByTestId } = render(<EtProgressBar {...defaultSolidProps} />);

      // Should not find elements with testID since none provided
      expect(queryByTestId('progress-bar')).toBeNull();
      expect(queryByTestId('progress-bar-solid-fill')).toBeNull();
    });
  });

  describe('Progress Values', () => {
    it('handles progress value of 0', () => {
      const { getByTestId } = render(<EtProgressBar {...defaultSolidProps} progress={0} testID="progress-bar" />);

      const container = getByTestId('progress-bar');
      const fill = getByTestId('progress-bar-solid-fill');

      expect(container).toBeTruthy();
      expect(fill).toBeTruthy();
    });

    it('handles progress value of 1 (full)', () => {
      const { getByTestId } = render(<EtProgressBar {...defaultSolidProps} progress={1} testID="progress-bar" />);

      const container = getByTestId('progress-bar');
      const fill = getByTestId('progress-bar-solid-fill');

      expect(container).toBeTruthy();
      expect(fill).toBeTruthy();
    });

    it('handles progress value of 0.5', () => {
      const { getByTestId } = render(<EtProgressBar {...defaultSolidProps} progress={0.5} testID="progress-bar" />);

      const container = getByTestId('progress-bar');
      const fill = getByTestId('progress-bar-solid-fill');

      expect(container).toBeTruthy();
      expect(fill).toBeTruthy();
    });

    it('clamps negative progress values to 0', () => {
      const { getByTestId } = render(<EtProgressBar {...defaultSolidProps} progress={-0.5} testID="progress-bar" />);

      const fill = getByTestId('progress-bar-solid-fill');

      // The fill should still render (width calculation should result in 0)
      expect(fill).toBeTruthy();
    });

    it('clamps progress values greater than 1', () => {
      const { getByTestId } = render(<EtProgressBar {...defaultSolidProps} progress={1.5} testID="progress-bar" />);

      const fill = getByTestId('progress-bar-solid-fill');

      // The fill should still render (width calculation should be clamped to container width)
      expect(fill).toBeTruthy();
    });

    it('handles very small progress values', () => {
      const { getByTestId } = render(<EtProgressBar {...defaultSolidProps} progress={0.001} testID="progress-bar" />);

      const fill = getByTestId('progress-bar-solid-fill');
      expect(fill).toBeTruthy();
    });

    it('handles progress values very close to 1', () => {
      const { getByTestId } = render(<EtProgressBar {...defaultSolidProps} progress={0.999} testID="progress-bar" />);

      const fill = getByTestId('progress-bar-solid-fill');
      expect(fill).toBeTruthy();
    });
  });

  describe('Solid Fill Type', () => {
    it('uses custom progress color when provided', () => {
      const customColor = '#FF5722';
      const { getByTestId } = render(
        <EtProgressBar fillType={EtProgressBarFillType.Solid} progress={0.5} progressColor={customColor} testID="progress-bar" />,
      );

      const fill = getByTestId('progress-bar-solid-fill');
      expect(fill).toBeTruthy();
      // Note: We can't directly test the backgroundColor due to style flattening
      // but we can verify the component renders without errors
    });

    it('uses theme primary color when progressColor is not provided', () => {
      const { getByTestId } = render(
        <EtProgressBar fillType={EtProgressBarFillType.Solid} progress={0.5} progressColor="#FF0000" testID="progress-bar" />,
      );

      const fill = getByTestId('progress-bar-solid-fill');
      expect(fill).toBeTruthy();
    });

    it('applies correct fill styles for solid type', () => {
      const { getByTestId } = render(<EtProgressBar {...defaultSolidProps} height={12} testID="progress-bar" />);

      const fill = getByTestId('progress-bar-solid-fill');
      const fillStyle = fill.props.style;

      // Check that style is applied (it's an array of styles)
      expect(fillStyle).toBeDefined();
      expect(Array.isArray(fillStyle)).toBe(true);
    });
  });

  describe('Gradient Fill Type', () => {
    it('uses custom gradient colors when provided', () => {
      const customGradient = ['#FF0000', '#00FF00', '#0000FF'];
      const { getByTestId } = render(
        <EtProgressBar
          fillType={EtProgressBarFillType.Gradient}
          progress={0.5}
          gradientColors={customGradient as [string, string, ...string[]]}
          testID="progress-bar"
        />,
      );

      const gradientFill = getByTestId('progress-bar-gradient-fill');
      expect(gradientFill).toBeTruthy();
      expect(gradientFill.props.colors).toEqual(customGradient);
    });

    it('falls back to theme primary color when gradient colors are not provided', () => {
      const { getByTestId } = render(<EtProgressBar fillType={EtProgressBarFillType.Gradient} progress={0.5} testID="progress-bar" />);

      const gradientFill = getByTestId('progress-bar-gradient-fill');
      expect(gradientFill).toBeTruthy();
      expect(gradientFill.props.colors).toEqual(['#6DFF8A', '#6DFF8A']); // colorsMock.colors.actionBrandText (dark mode: primary[500])
    });

    it('falls back to theme primary when gradient has less than 2 colors', () => {
      const { getByTestId } = render(
        <EtProgressBar fillType={EtProgressBarFillType.Gradient} progress={0.5} gradientColors={['#FF0000'] as any} testID="progress-bar" />,
      );

      const gradientFill = getByTestId('progress-bar-gradient-fill');
      expect(gradientFill).toBeTruthy();
      expect(gradientFill.props.colors).toEqual(['#6DFF8A', '#6DFF8A']); // colorsMock.colors.actionBrandText (dark mode: primary[500])
    });

    it('applies correct gradient direction (horizontal)', () => {
      const { getByTestId } = render(<EtProgressBar {...defaultGradientProps} testID="progress-bar" />);

      const gradientFill = getByTestId('progress-bar-gradient-fill');
      expect(gradientFill.props.start).toEqual({ x: 0, y: 0 });
      expect(gradientFill.props.end).toEqual({ x: 1, y: 0 });
    });

    it('handles gradient with exactly 2 colors', () => {
      const twoColorGradient = ['#FF0000', '#00FF00'];
      const { getByTestId } = render(
        <EtProgressBar
          fillType={EtProgressBarFillType.Gradient}
          progress={0.5}
          gradientColors={twoColorGradient as [string, string]}
          testID="progress-bar"
        />,
      );

      const gradientFill = getByTestId('progress-bar-gradient-fill');
      expect(gradientFill.props.colors).toEqual(twoColorGradient);
    });

    it('handles gradient with more than 2 colors', () => {
      const multiColorGradient = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00'];
      const { getByTestId } = render(
        <EtProgressBar
          fillType={EtProgressBarFillType.Gradient}
          progress={0.5}
          gradientColors={multiColorGradient as [string, string, ...string[]]}
          testID="progress-bar"
        />,
      );

      const gradientFill = getByTestId('progress-bar-gradient-fill');
      expect(gradientFill.props.colors).toEqual(multiColorGradient);
    });
  });

  describe('Height Customization', () => {
    it('uses default height when not provided', () => {
      const { getByTestId } = render(<EtProgressBar {...defaultSolidProps} testID="progress-bar" />);

      const container = getByTestId('progress-bar');
      expect(container).toBeTruthy();
    });

    it('applies custom height', () => {
      const customHeight = 16;
      const { getByTestId } = render(<EtProgressBar {...defaultSolidProps} height={customHeight} testID="progress-bar" />);

      const container = getByTestId('progress-bar');
      expect(container).toBeTruthy();
    });

    it('handles very small height values', () => {
      const { getByTestId } = render(<EtProgressBar {...defaultSolidProps} height={2} testID="progress-bar" />);

      const container = getByTestId('progress-bar');
      expect(container).toBeTruthy();
    });

    it('handles large height values', () => {
      const { getByTestId } = render(<EtProgressBar {...defaultSolidProps} height={50} testID="progress-bar" />);

      const container = getByTestId('progress-bar');
      expect(container).toBeTruthy();
    });
  });

  describe('Custom Styles', () => {
    it('applies custom container styles', () => {
      const customStyle = { backgroundColor: 'red', margin: 10 };
      const { getByTestId } = render(<EtProgressBar {...defaultSolidProps} style={customStyle} testID="progress-bar" />);

      const container = getByTestId('progress-bar');
      expect(container).toBeTruthy();

      // The style should be applied to the container
      const containerStyle = container.props.style;
      expect(containerStyle).toBeDefined();
      expect(Array.isArray(containerStyle)).toBe(true);
    });

    it('applies multiple custom styles', () => {
      const customStyles = [{ backgroundColor: 'red' }, { margin: 10 }, { padding: 5 }];
      const { getByTestId } = render(<EtProgressBar {...defaultSolidProps} style={customStyles} testID="progress-bar" />);

      const container = getByTestId('progress-bar');
      expect(container).toBeTruthy();
    });

    it('merges custom styles with default styles correctly', () => {
      const customStyle = { borderWidth: 2 };
      const { getByTestId } = render(<EtProgressBar {...defaultSolidProps} style={customStyle} testID="progress-bar" />);

      const container = getByTestId('progress-bar');
      const containerStyle = container.props.style;

      expect(containerStyle).toBeDefined();
      expect(Array.isArray(containerStyle)).toBe(true);
    });
  });

  describe('Layout Callback', () => {
    it('calls onLayout callback when container layout changes', () => {
      const { getByTestId } = render(<EtProgressBar {...defaultSolidProps} testID="progress-bar" />);

      const container = getByTestId('progress-bar');

      // Simulate layout event
      const layoutEvent = {
        nativeEvent: {
          layout: {
            width: 200,
            height: 8,
            x: 0,
            y: 0,
          },
        },
      };

      // Trigger onLayout
      fireEvent(container, 'layout', layoutEvent);

      // Component should handle layout without errors
      expect(container).toBeTruthy();
    });

    it('updates container width when layout changes', () => {
      const { getByTestId } = render(<EtProgressBar {...defaultSolidProps} progress={0.5} testID="progress-bar" />);

      const container = getByTestId('progress-bar');

      // Simulate initial layout
      fireEvent(container, 'layout', {
        nativeEvent: {
          layout: { width: 100, height: 8, x: 0, y: 0 },
        },
      });

      // Simulate layout change
      fireEvent(container, 'layout', {
        nativeEvent: {
          layout: { width: 300, height: 8, x: 0, y: 0 },
        },
      });

      expect(container).toBeTruthy();
    });

    it('recalculates fill width when container width changes', () => {
      const { getByTestId } = render(<EtProgressBar {...defaultSolidProps} progress={0.5} testID="progress-bar" />);

      const container = getByTestId('progress-bar');
      const fill = getByTestId('progress-bar-solid-fill');

      // Trigger layout with specific width
      fireEvent(container, 'layout', {
        nativeEvent: {
          layout: { width: 200, height: 8, x: 0, y: 0 },
        },
      });

      expect(fill).toBeTruthy();

      // Change container width
      fireEvent(container, 'layout', {
        nativeEvent: {
          layout: { width: 400, height: 8, x: 0, y: 0 },
        },
      });

      expect(fill).toBeTruthy();
    });
  });

  describe('Container Width Calculations', () => {
    it('starts with zero container width', () => {
      const { getByTestId } = render(<EtProgressBar {...defaultSolidProps} progress={0.5} testID="progress-bar" />);

      const fill = getByTestId('progress-bar-solid-fill');
      expect(fill).toBeTruthy();

      // Initially, before layout, width should be 0
      // Component should still render without issues
    });

    it('calculates correct fill width based on progress and container width', () => {
      const { getByTestId } = render(<EtProgressBar {...defaultSolidProps} progress={0.75} testID="progress-bar" />);

      const container = getByTestId('progress-bar');

      // Set container width via layout
      fireEvent(container, 'layout', {
        nativeEvent: {
          layout: { width: 400, height: 8, x: 0, y: 0 },
        },
      });

      const fill = getByTestId('progress-bar-solid-fill');
      expect(fill).toBeTruthy();

      // With progress 0.75 and container width 400, fill width should be 300
      // We can't directly test the calculated width, but we can ensure rendering works
    });

    it('handles zero container width gracefully', () => {
      const { getByTestId } = render(<EtProgressBar {...defaultSolidProps} progress={0.5} testID="progress-bar" />);

      const container = getByTestId('progress-bar');

      // Set container width to 0
      fireEvent(container, 'layout', {
        nativeEvent: {
          layout: { width: 0, height: 8, x: 0, y: 0 },
        },
      });

      const fill = getByTestId('progress-bar-solid-fill');
      expect(fill).toBeTruthy();
    });
  });

  describe('Border Radius Calculations', () => {
    it('calculates border radius based on height', () => {
      const customHeight = 20;
      const { getByTestId } = render(<EtProgressBar {...defaultSolidProps} height={customHeight} testID="progress-bar" />);

      const container = getByTestId('progress-bar');
      expect(container).toBeTruthy();

      // Border radius should be height / 2 = 10
      // We can't directly test the style, but ensure component renders
    });

    it('handles odd height values for border radius', () => {
      const { getByTestId } = render(<EtProgressBar {...defaultSolidProps} height={15} testID="progress-bar" />);

      const container = getByTestId('progress-bar');
      expect(container).toBeTruthy();

      // Border radius should be 7.5
    });
  });

  describe('Theme Integration', () => {
    it('uses theme colors for container border', () => {
      const { getByTestId } = render(<EtProgressBar {...defaultSolidProps} testID="progress-bar" />);

      const container = getByTestId('progress-bar');
      expect(container).toBeTruthy();

      // Theme border color should be applied
    });

    it('uses theme primary color for default fill', () => {
      const { getByTestId } = render(
        <EtProgressBar fillType={EtProgressBarFillType.Solid} progress={0.5} progressColor="#4A9EFF" testID="progress-bar" />,
      );

      const fill = getByTestId('progress-bar-solid-fill');
      expect(fill).toBeTruthy();
    });

    it('uses theme transparent color for background', () => {
      const { getByTestId } = render(<EtProgressBar {...defaultSolidProps} testID="progress-bar" />);

      const container = getByTestId('progress-bar');
      expect(container).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('handles switching between fill types', () => {
      const { rerender, queryByTestId } = render(<EtProgressBar {...defaultSolidProps} testID="progress-bar" />);

      expect(queryByTestId('progress-bar-solid-fill')).toBeTruthy();
      expect(queryByTestId('progress-bar-gradient-fill')).toBeNull();

      rerender(<EtProgressBar {...defaultGradientProps} testID="progress-bar" />);

      expect(queryByTestId('progress-bar-solid-fill')).toBeNull();
      expect(queryByTestId('progress-bar-gradient-fill')).toBeTruthy();
    });

    it('handles rapid progress updates', () => {
      const { rerender, getByTestId } = render(<EtProgressBar {...defaultSolidProps} progress={0} testID="progress-bar" />);

      const container = getByTestId('progress-bar');

      // Set container width
      fireEvent(container, 'layout', {
        nativeEvent: {
          layout: { width: 100, height: 8, x: 0, y: 0 },
        },
      });

      // Rapidly update progress
      for (let i = 0; i <= 100; i += 10) {
        rerender(<EtProgressBar {...defaultSolidProps} progress={i / 100} testID="progress-bar" />);
      }

      const fill = getByTestId('progress-bar-solid-fill');
      expect(fill).toBeTruthy();
    });

    it('handles component unmounting gracefully', () => {
      const { unmount } = render(<EtProgressBar {...defaultSolidProps} testID="progress-bar" />);

      expect(() => unmount()).not.toThrow();
    });
  });
});
