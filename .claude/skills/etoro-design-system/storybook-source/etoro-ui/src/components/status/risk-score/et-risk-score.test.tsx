import { render } from '@testing-library/react-native';
import React from 'react';
import { StyleSheet } from 'react-native';

import { X2 } from '../../../core/styles/spacing';
import { RiskScoreSize, RiskScoreValue, RiskScoreVariant } from './api/types';
import { EtRiskScore } from './et-risk-score';
import { getSegmentColor, TOTAL_SEGMENTS } from './utils';

// Mock etoro-ui/core/hooks
jest.mock('etoro-ui/core/hooks', () => {
  const { colorsMock } = require('etoro-ui/core/hooks/__mocks__/colors-mock');
  return {
    useEtoroTheme: jest.fn(() => ({
      dark: false,
      colors: colorsMock.colors,
      gradients: {},
      fonts: {},
    })),
  };
});

// Mock react-native-svg
jest.mock('react-native-svg', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: ({ children, ...props }: Record<string, unknown>) => (
      <View testID="svg-root" {...props}>
        {children as React.ReactNode}
      </View>
    ),
    Circle: (props: Record<string, unknown>) => <View testID={`circle-${props.stroke}`} {...props} />,
  };
});

describe('EtRiskScore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders with required value prop', () => {
      const { getByText, getByTestId } = render(<EtRiskScore value={5} testID="risk-score" />);

      expect(getByTestId('risk-score')).toBeTruthy();
      expect(getByText('5')).toBeTruthy();
    });

    it('renders the score number as text', () => {
      const { getByText } = render(<EtRiskScore value={7} />);
      expect(getByText('7')).toBeTruthy();
    });

    it('renders value 10 correctly', () => {
      const { getByText } = render(<EtRiskScore value={10} />);
      expect(getByText('10')).toBeTruthy();
    });

    it('renders without testID when not provided', () => {
      const { queryByTestId, getByText } = render(<EtRiskScore value={3} />);

      expect(queryByTestId('risk-score')).toBeNull();
      expect(getByText('3')).toBeTruthy();
    });

    it('renders SVG with correct number of circle segments', () => {
      const { getAllByTestId } = render(<EtRiskScore value={5} testID="risk-score" />);

      // 10 circle segments
      const circles = getAllByTestId(/^circle-/);
      expect(circles.length).toBe(TOTAL_SEGMENTS);
    });
  });

  describe('Size Variants', () => {
    const sizes: RiskScoreSize[] = ['xs', 'sm', 'md', 'lg'];

    it.each(sizes)('renders size %s correctly', (size) => {
      const { getByTestId, getByText } = render(<EtRiskScore value={5} size={size} testID="risk-score" />);

      expect(getByTestId('risk-score')).toBeTruthy();
      expect(getByText('5')).toBeTruthy();
    });

    it('defaults to size md when not specified', () => {
      const { getByTestId } = render(<EtRiskScore value={5} testID="risk-score" />);

      const container = getByTestId('risk-score');
      const flatStyle = StyleSheet.flatten(container.props.style);
      expect(flatStyle.width).toBe(30);
      expect(flatStyle.height).toBe(30);
    });
  });

  describe('Variant Behavior', () => {
    const variants: RiskScoreVariant[] = ['multi', 'single'];

    it.each(variants)('renders %s variant correctly', (variant) => {
      const { getByTestId, getByText } = render(<EtRiskScore value={7} variant={variant} testID="risk-score" />);

      expect(getByTestId('risk-score')).toBeTruthy();
      expect(getByText('7')).toBeTruthy();
    });

    it('defaults to multi variant when not specified', () => {
      const value = 5;
      const { getAllByTestId } = render(<EtRiskScore value={value} testID="risk-score" />);

      const circles = getAllByTestId(/^circle-/);
      expect(circles).toHaveLength(TOTAL_SEGMENTS);

      const activeColor = circles[0].props.stroke;
      const inactiveColor = circles[TOTAL_SEGMENTS - 1].props.stroke;
      expect(activeColor).not.toBe(inactiveColor);

      // Multi variant: segments 0 through value-1 are filled
      circles.forEach((circle, index) => {
        if (index < value) {
          expect(circle.props.stroke).toBe(activeColor);
        } else {
          expect(circle.props.stroke).toBe(inactiveColor);
        }
      });
    });
  });

  describe('All Score Values', () => {
    const values: RiskScoreValue[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    it.each(values)('renders score %i correctly', (value) => {
      const { getByText, getByTestId } = render(<EtRiskScore value={value} testID="risk-score" />);

      expect(getByTestId('risk-score')).toBeTruthy();
      expect(getByText(String(value))).toBeTruthy();
    });
  });

  describe('Combined Props', () => {
    it('renders with all props combined', () => {
      const { getByTestId, getByText } = render(
        <EtRiskScore value={8} size="lg" variant="single" testID="risk-score" accessibilityLabel="High risk score" />,
      );

      expect(getByTestId('risk-score')).toBeTruthy();
      expect(getByText('8')).toBeTruthy();
    });

    it('renders different value and size combinations', () => {
      const values: RiskScoreValue[] = [1, 5, 9];
      const sizes: RiskScoreSize[] = ['xs', 'md', 'lg'];

      values.forEach((value) => {
        sizes.forEach((size) => {
          const { getByTestId, unmount } = render(<EtRiskScore value={value} size={size} testID="risk-score" />);

          expect(getByTestId('risk-score')).toBeTruthy();
          unmount();
        });
      });
    });
  });

  describe('Custom Styles', () => {
    it('applies custom container styles', () => {
      const customStyle = { marginTop: X2 };
      const { getByTestId } = render(<EtRiskScore value={5} style={customStyle} testID="risk-score" />);

      const container = getByTestId('risk-score');
      expect(container).toBeTruthy();

      const style = container.props.style;
      expect(style).toBeDefined();
      expect(Array.isArray(style)).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('has correct accessibility role', () => {
      const { getByTestId } = render(<EtRiskScore value={5} testID="risk-score" />);

      const container = getByTestId('risk-score');
      expect(container.props.accessibilityRole).toBe('text');
    });

    it('generates default accessibility label', () => {
      const { getByTestId } = render(<EtRiskScore value={7} testID="risk-score" />);

      const container = getByTestId('risk-score');
      expect(container.props.accessibilityLabel).toBe('Risk score 7 out of 10');
    });

    it('uses custom accessibility label when provided', () => {
      const { getByTestId } = render(<EtRiskScore value={3} accessibilityLabel="Low risk" testID="risk-score" />);

      const container = getByTestId('risk-score');
      expect(container.props.accessibilityLabel).toBe('Low risk');
    });
  });

  describe('Edge Cases', () => {
    it('handles component unmounting gracefully', () => {
      const { unmount } = render(<EtRiskScore value={5} />);
      expect(() => unmount()).not.toThrow();
    });

    it('handles rapid prop updates', () => {
      const { rerender, getByText } = render(<EtRiskScore value={1} />);

      rerender(<EtRiskScore value={5} />);
      expect(getByText('5')).toBeTruthy();

      rerender(<EtRiskScore value={9} />);
      expect(getByText('9')).toBeTruthy();

      rerender(<EtRiskScore value={3} />);
      expect(getByText('3')).toBeTruthy();
    });

    it('handles size changes', () => {
      const { rerender, getByTestId } = render(<EtRiskScore value={5} size="xs" testID="risk-score" />);

      expect(getByTestId('risk-score')).toBeTruthy();

      rerender(<EtRiskScore value={5} size="lg" testID="risk-score" />);
      expect(getByTestId('risk-score')).toBeTruthy();
    });

    it('handles variant changes', () => {
      const { rerender, getByTestId } = render(<EtRiskScore value={5} variant="multi" testID="risk-score" />);

      expect(getByTestId('risk-score')).toBeTruthy();

      rerender(<EtRiskScore value={5} variant="single" testID="risk-score" />);
      expect(getByTestId('risk-score')).toBeTruthy();
    });
  });
});

describe('Utility Functions', () => {
  describe('getSegmentColor', () => {
    const scoreColor = '#FFA318';
    const inactiveColor = 'rgba(0,0,0,0.1)';

    it('returns score color for segments up to value in multi variant', () => {
      // Value 5: segments 0-4 should be colored
      for (let i = 0; i < 5; i++) {
        const color = getSegmentColor(i, 5, 'multi', scoreColor, inactiveColor);
        expect(color).toBe(scoreColor);
      }
    });

    it('returns inactive color for segments beyond value in multi variant', () => {
      // Value 5: segments 5-9 should be inactive
      for (let i = 5; i < TOTAL_SEGMENTS; i++) {
        const color = getSegmentColor(i, 5, 'multi', scoreColor, inactiveColor);
        expect(color).toBe(inactiveColor);
      }
    });

    it('uses the same color for all active segments in multi variant', () => {
      // Value 5: all active segments (0-4) should share the same color
      const colors = [];
      for (let i = 0; i < 5; i++) {
        colors.push(getSegmentColor(i, 5, 'multi', scoreColor, inactiveColor));
      }
      const uniqueColors = new Set(colors);
      expect(uniqueColors.size).toBe(1);
      expect(colors[0]).toBe(scoreColor);
    });

    it('returns score color only for the matching segment in single variant', () => {
      // Value 5: only segment 4 (0-indexed) should be colored
      for (let i = 0; i < TOTAL_SEGMENTS; i++) {
        const color = getSegmentColor(i, 5, 'single', scoreColor, inactiveColor);
        if (i === 4) {
          expect(color).toBe(scoreColor);
        } else {
          expect(color).toBe(inactiveColor);
        }
      }
    });

    it('colors 9 segments for value 9 in multi variant', () => {
      for (let i = 0; i < 9; i++) {
        const color = getSegmentColor(i, 9, 'multi', scoreColor, inactiveColor);
        expect(color).toBe(scoreColor);
      }
      // Segment 9 (last) should be inactive
      const lastColor = getSegmentColor(9, 9, 'multi', scoreColor, inactiveColor);
      expect(lastColor).toBe(inactiveColor);
    });

    it('handles value 10 in multi variant (all segments colored)', () => {
      for (let i = 0; i < TOTAL_SEGMENTS; i++) {
        const color = getSegmentColor(i, 10, 'multi', scoreColor, inactiveColor);
        expect(color).toBe(scoreColor);
      }
    });

    it('handles value 10 in single variant (last segment colored)', () => {
      for (let i = 0; i < TOTAL_SEGMENTS; i++) {
        const color = getSegmentColor(i, 10, 'single', scoreColor, inactiveColor);
        if (i === 9) {
          expect(color).toBe(scoreColor);
        } else {
          expect(color).toBe(inactiveColor);
        }
      }
    });
  });
});
