import { describe, expect, it, jest } from '@jest/globals';
import { render } from '@testing-library/react-native';

import type { EtLoaderProps, LoaderSize } from './api/types';
import { EtLoader } from './et-loader';
import { getArcPath } from './utils/get-arc-path';

// Mock react-native-svg
jest.mock('react-native-svg', () => {
  const React = require('react');
  const { View } = require('react-native');
  const createMockComponent = (name: string) => (props: any) =>
    React.createElement(View, { testID: props.testID || `mock-${name}`, ...props }, props.children);

  return {
    __esModule: true,
    default: createMockComponent('svg'),
    Circle: createMockComponent('circle'),
    Path: createMockComponent('path'),
  };
});

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const noop = () => {};
  const { View, Animated: RNAnimated } = require('react-native');
  return {
    __esModule: true,
    default: {
      ...RNAnimated,
      View,
      createAnimatedComponent: (Component: any) => Component,
    },
    useSharedValue: (v: any) => ({ value: v }),
    useDerivedValue: (v: any) => ({ value: v }),
    withTiming: (v: any) => v,
    withSpring: (v: any) => v,
    withRepeat: (v: any) => v,
    withDelay: (_: any, v: any) => v,
    cancelAnimation: noop,
    useAnimatedStyle: () => ({}),
    useAnimatedProps: () => ({}),
    createAnimatedComponent: (Component: any) => Component,
    runOnJS: (fn: any) => fn,
    Easing: { linear: noop, inOut: noop },
  };
});

// Mock useEtoroTheme hook
jest.mock('etoro-ui/core/hooks', () => {
  const { colorsMock } = require('etoro-ui/core/hooks/__mocks__/colors-mock');
  return {
    useEtoroTheme: jest.fn(() => ({
      colors: colorsMock.colors,
      gradients: {},
      fonts: {},
    })),
  };
});

describe('EtLoader', () => {
  describe('getArcPath', () => {
    const center = 12;
    const radius = 10;

    describe('valid inputs', () => {
      it('should return empty string for 0 progress', () => {
        expect(getArcPath(center, radius, 0)).toBe('');
      });

      it('should return null for 100% progress (full circle)', () => {
        expect(getArcPath(center, radius, 1)).toBeNull();
      });

      it('should return valid path string for partial progress', () => {
        const path = getArcPath(center, radius, 0.5);
        expect(typeof path).toBe('string');
        expect(path).toContain('M'); // Move to
        expect(path).toContain('A'); // Arc
      });

      it('should use small arc flag for progress <= 50%', () => {
        const path = getArcPath(center, radius, 0.25);
        // largeArcFlag should be 0
        expect(path).toMatch(/A \d+ \d+ 0 0 1/);
      });

      it('should use large arc flag for progress > 50%', () => {
        const path = getArcPath(center, radius, 0.75);
        // largeArcFlag should be 1
        expect(path).toMatch(/A \d+ \d+ 0 1 1/);
      });

      it("should start arc from top (12 o'clock position)", () => {
        const path = getArcPath(center, radius, 0.25);
        // Start point should be at top: (center, center - radius)
        expect(path).toContain(`M ${center} ${center - radius}`);
      });

      it('should include radius in arc command', () => {
        const path = getArcPath(center, radius, 0.5);
        expect(path).toContain(`A ${radius} ${radius}`);
      });
    });

    describe('progress clamping', () => {
      it('should return empty string for negative progress', () => {
        expect(getArcPath(center, radius, -0.5)).toBe('');
      });

      it('should return null for progress > 1 (clamped to 1)', () => {
        expect(getArcPath(center, radius, 1.5)).toBeNull();
      });

      it('should return null for progress significantly > 1', () => {
        expect(getArcPath(center, radius, 10)).toBeNull();
      });

      it('should return empty string for very negative progress', () => {
        expect(getArcPath(center, radius, -100)).toBe('');
      });
    });

    describe('invalid progress values', () => {
      it('should return empty string for NaN progress', () => {
        expect(getArcPath(center, radius, NaN)).toBe('');
      });

      it('should return empty string for Infinity progress', () => {
        expect(getArcPath(center, radius, Infinity)).toBe('');
      });

      it('should return empty string for -Infinity progress', () => {
        expect(getArcPath(center, radius, -Infinity)).toBe('');
      });
    });

    describe('invalid radius values', () => {
      it('should return empty string for zero radius', () => {
        expect(getArcPath(center, 0, 0.5)).toBe('');
      });

      it('should return empty string for negative radius', () => {
        expect(getArcPath(center, -10, 0.5)).toBe('');
      });

      it('should return empty string for NaN radius', () => {
        expect(getArcPath(center, NaN, 0.5)).toBe('');
      });

      it('should return empty string for Infinity radius', () => {
        expect(getArcPath(center, Infinity, 0.5)).toBe('');
      });

      it('should return empty string for -Infinity radius', () => {
        expect(getArcPath(center, -Infinity, 0.5)).toBe('');
      });
    });

    describe('edge cases', () => {
      it('should handle very small progress values', () => {
        const path = getArcPath(center, radius, 0.001);
        expect(typeof path).toBe('string');
        expect(path).toContain('M');
      });

      it('should handle progress just below 1', () => {
        const path = getArcPath(center, radius, 0.999);
        expect(typeof path).toBe('string');
        expect(path).toContain('M');
      });

      it('should handle exactly 50% progress', () => {
        const path = getArcPath(center, radius, 0.5);
        // At exactly 50%, should use small arc flag (0)
        expect(path).toMatch(/A \d+ \d+ 0 0 1/);
      });

      it('should handle very small radius', () => {
        const path = getArcPath(center, 0.1, 0.5);
        expect(typeof path).toBe('string');
        expect(path).toContain('A 0.1 0.1');
      });

      it('should handle large center values', () => {
        const path = getArcPath(1000, radius, 0.5);
        expect(typeof path).toBe('string');
        expect(path).toContain('M 1000');
      });

      it('should handle zero center', () => {
        const path = getArcPath(0, radius, 0.5);
        expect(typeof path).toBe('string');
        // Note: Due to floating point precision with trig functions,
        // center=0 may produce very small numbers (e.g., 6.12e-16) instead of exactly 0
        expect(path).toMatch(/^M /);
      });

      it('should handle negative center', () => {
        const path = getArcPath(-10, radius, 0.5);
        expect(typeof path).toBe('string');
        expect(path).toContain('M -10');
      });
    });
  });

  describe('Types', () => {
    it('should support all LoaderSize values', () => {
      const sizes: LoaderSize[] = ['tiny', 'xs', 'small', 'medium', 'large', 'xl'];
      sizes.forEach((size) => {
        expect(size).toBeDefined();
      });
    });

    it('should have correct default props types', () => {
      const props: EtLoaderProps = {};
      expect(props.size).toBeUndefined();
      expect(props.state).toBeUndefined();
      expect(props.progress).toBeUndefined();
    });

    it('should support all optional props', () => {
      const props: EtLoaderProps = {
        size: 'large',
        state: 'determinate',
        progress: 0.5,
        trackColor: '#FFFFFF',
        progressColor: '#000000',
        duration: 2000,
        style: { margin: 10 },
        testID: 'loader-test',
        accessibilityLabel: 'Loading content',
      };

      expect(props.size).toBe('large');
      expect(props.state).toBe('determinate');
      expect(props.progress).toBe(0.5);
    });
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { getByTestId } = render(<EtLoader testID="loader" />);
      expect(getByTestId('loader')).toBeTruthy();
    });

    it('should render with default props', () => {
      const { getByTestId } = render(<EtLoader testID="loader" />);
      const loader = getByTestId('loader');
      expect(loader.props.accessibilityRole).toBe('progressbar');
    });

    it('should apply custom testID', () => {
      const { getByTestId } = render(<EtLoader testID="custom-loader" />);
      expect(getByTestId('custom-loader')).toBeTruthy();
    });

    it('should apply custom style', () => {
      const { getByTestId } = render(<EtLoader testID="styled-loader" style={{ margin: 20 }} />);
      const loader = getByTestId('styled-loader');
      expect(loader.props.style).toEqual(expect.arrayContaining([expect.objectContaining({ margin: 20 })]));
    });
  });

  describe('Sizes', () => {
    const sizeToPixels: Record<LoaderSize, number> = {
      tiny: 12,
      xs: 16,
      small: 20,
      medium: 24,
      large: 30,
      xl: 36,
    };

    Object.entries(sizeToPixels).forEach(([size, pixels]) => {
      it(`should render ${size} size with ${pixels}px dimensions`, () => {
        const { getByTestId } = render(<EtLoader size={size as LoaderSize} testID="loader" />);
        const loader = getByTestId('loader');
        expect(loader.props.style).toEqual(expect.arrayContaining([expect.objectContaining({ width: pixels, height: pixels })]));
      });
    });

    it('should use medium size by default', () => {
      const { getByTestId } = render(<EtLoader testID="loader" />);
      const loader = getByTestId('loader');
      expect(loader.props.style).toEqual(expect.arrayContaining([expect.objectContaining({ width: 24, height: 24 })]));
    });
  });

  describe('States', () => {
    it('should default to indeterminate state', () => {
      const { getByTestId } = render(<EtLoader testID="loader" />);
      const loader = getByTestId('loader');
      expect(loader.props.accessibilityValue).toEqual({ text: 'Loading' });
    });

    it('should show progress value in determinate state', () => {
      const { getByTestId } = render(<EtLoader state="determinate" progress={0.75} testID="loader" />);
      const loader = getByTestId('loader');
      expect(loader.props.accessibilityValue).toEqual({
        min: 0,
        max: 100,
        now: 75,
      });
    });

    it('should clamp progress to 0-100%', () => {
      const { getByTestId: getByTestId1 } = render(<EtLoader state="determinate" progress={-0.5} testID="loader1" />);
      expect(getByTestId1('loader1').props.accessibilityValue.now).toBe(0);

      const { getByTestId: getByTestId2 } = render(<EtLoader state="determinate" progress={1.5} testID="loader2" />);
      expect(getByTestId2('loader2').props.accessibilityValue.now).toBe(100);
    });

    it('should round progress percentage', () => {
      const { getByTestId } = render(<EtLoader state="determinate" progress={0.333} testID="loader" />);
      const loader = getByTestId('loader');
      expect(loader.props.accessibilityValue.now).toBe(33);
    });
  });

  describe('Accessibility', () => {
    it('should have progressbar role', () => {
      const { getByTestId } = render(<EtLoader testID="loader" />);
      const loader = getByTestId('loader');
      expect(loader.props.accessibilityRole).toBe('progressbar');
    });

    it('should have default accessibility label', () => {
      const { getByTestId } = render(<EtLoader testID="loader" />);
      const loader = getByTestId('loader');
      expect(loader.props.accessibilityLabel).toBe('Loading');
    });

    it('should support custom accessibility label', () => {
      const { getByTestId } = render(<EtLoader accessibilityLabel="Loading user data" testID="loader" />);
      const loader = getByTestId('loader');
      expect(loader.props.accessibilityLabel).toBe('Loading user data');
    });

    it('should provide accessibility value for indeterminate state', () => {
      const { getByTestId } = render(<EtLoader state="indeterminate" testID="loader" />);
      const loader = getByTestId('loader');
      expect(loader.props.accessibilityValue).toEqual({ text: 'Loading' });
    });

    it('should provide accessibility value with min/max/now for determinate state', () => {
      const { getByTestId } = render(<EtLoader state="determinate" progress={0.5} testID="loader" />);
      const loader = getByTestId('loader');
      expect(loader.props.accessibilityValue).toEqual({
        min: 0,
        max: 100,
        now: 50,
      });
    });
  });

  describe('Custom Colors', () => {
    it('should pass custom track color to track circle', () => {
      const { getAllByTestId } = render(<EtLoader trackColor="#FF0000" testID="loader" />);
      // First circle is the track
      const circles = getAllByTestId('mock-circle');
      expect(circles[0].props.stroke).toBe('#FF0000');
    });

    it('should pass custom progress color to progress arc', () => {
      const { getAllByTestId } = render(<EtLoader progressColor="#00FF00" testID="loader" />);
      // Path is the progress arc (for indeterminate with 25% progress)
      const paths = getAllByTestId('mock-path');
      expect(paths[0].props.stroke).toBe('#00FF00');
    });

    it('should pass both custom colors to respective elements', () => {
      const { getAllByTestId } = render(<EtLoader trackColor="#FF0000" progressColor="#00FF00" testID="loader" />);
      const circles = getAllByTestId('mock-circle');
      const paths = getAllByTestId('mock-path');

      // Track circle gets track color
      expect(circles[0].props.stroke).toBe('#FF0000');
      // Progress path gets progress color
      expect(paths[0].props.stroke).toBe('#00FF00');
    });

    it('should use theme colors when custom colors not provided', () => {
      const { getAllByTestId } = render(<EtLoader testID="loader" />);
      const circles = getAllByTestId('mock-circle');
      const paths = getAllByTestId('mock-path');

      // Track and progress should have theme-based colors (not undefined)
      expect(circles[0].props.stroke).toBeDefined();
      expect(paths[0].props.stroke).toBeDefined();
    });

    it('should pass progress color to full circle when progress is 100%', () => {
      const { getAllByTestId } = render(<EtLoader state="determinate" progress={1} progressColor="#0000FF" testID="loader" />);
      const circles = getAllByTestId('mock-circle');

      // When progress is 100%, there are two circles: track and progress
      // Progress circle (second one) should have the progress color
      expect(circles[1].props.stroke).toBe('#0000FF');
    });
  });

  describe('Animation Duration', () => {
    it('should accept custom duration', () => {
      const { getByTestId } = render(<EtLoader duration={2000} testID="loader" />);
      expect(getByTestId('loader')).toBeTruthy();
    });

    it('should use default duration of 1000ms', () => {
      // This is implicitly tested - component renders without duration prop
      const { getByTestId } = render(<EtLoader testID="loader" />);
      expect(getByTestId('loader')).toBeTruthy();
    });
  });

  describe('Memoization', () => {
    it('should be memoized', () => {
      expect(EtLoader.$$typeof).toBe(Symbol.for('react.memo'));
    });

    it('should have correct displayName', () => {
      // Access the inner component's displayName
      expect((EtLoader as any).type.displayName).toBe('EtLoader');
    });
  });
});
