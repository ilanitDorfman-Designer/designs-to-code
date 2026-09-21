import { render } from '@testing-library/react-native';

import { colorsMock } from '../../../../core/hooks/__mocks__/colors-mock';
import { Cursor } from './cursor';

// Mock dependencies
jest.mock('@shopify/react-native-skia', () => ({
  Circle: ({ r, cx, cy, strokeWidth, color, style }: any) =>
    `Circle[r:${r},cx:${cx?.value || cx},cy:${cy?.value || cy},strokeWidth:${strokeWidth},color:${color},style:${style}]`,
  Group: ({ children, opacity }: any) => {
    const opacityValue = opacity?.value !== undefined ? opacity.value : opacity;
    return `Group[opacity:${opacityValue}]${children}`;
  },
  Path: ({ path: _path, color, strokeJoin, strokeWidth }: any) => `Path[color:${color},strokeJoin:${strokeJoin},strokeWidth:${strokeWidth}]`,
  Mask: ({ children }: any) => `Mask${children}`,
  Rect: () => 'Rect',
  LinearGradient: () => 'LinearGradient',
  Skia: {
    Path: {
      Make: () => {
        const pathMock: any = {
          moveTo: jest.fn(() => pathMock),
          lineTo: jest.fn(() => pathMock),
          dash: jest.fn(() => pathMock),
          transform: jest.fn(() => pathMock),
          close: jest.fn(() => pathMock),
        };
        return pathMock;
      },
    },
    Matrix: jest.fn(() => ({
      translate: jest.fn(function (this: any) {
        return this;
      }),
      scale: jest.fn(function (this: any) {
        return this;
      }),
    })),
  },
}));

const mockColors = colorsMock;

describe('Cursor', () => {
  const defaultProps = {
    cx: { value: 100 } as any,
    cy: { value: 50 } as any,
    chartHeight: 200,
    colors: mockColors.colors,
    showCursor: true,
  };

  describe('Basic Rendering', () => {
    it('should render without crashing', () => {
      const { toJSON } = render(<Cursor {...defaultProps} />);
      expect(toJSON()).not.toBeNull();
    });

    it('should render when cursor is visible', () => {
      const { toJSON } = render(<Cursor {...defaultProps} showCursor={true} />);
      expect(toJSON()).not.toBeNull();
    });

    it('should render when cursor is hidden', () => {
      const { toJSON } = render(<Cursor {...defaultProps} showCursor={false} />);
      expect(toJSON()).not.toBeNull();
    });
  });

  describe('Position Handling', () => {
    it('should handle different cx positions', () => {
      const { toJSON } = render(<Cursor {...defaultProps} cx={{ value: 150 } as any} />);
      expect(toJSON()).not.toBeNull();
    });

    it('should handle different cy positions', () => {
      const { toJSON } = render(<Cursor {...defaultProps} cy={{ value: 75 } as any} />);
      expect(toJSON()).not.toBeNull();
    });

    it('should handle zero positions', () => {
      const { toJSON } = render(<Cursor {...defaultProps} cx={{ value: 0 } as any} cy={{ value: 0 } as any} />);
      expect(toJSON()).not.toBeNull();
    });

    it('should handle negative positions', () => {
      const { toJSON } = render(<Cursor {...defaultProps} cx={{ value: -10 } as any} cy={{ value: -20 } as any} />);
      expect(toJSON()).not.toBeNull();
    });

    it('should handle very large positions', () => {
      const { toJSON } = render(<Cursor {...defaultProps} cx={{ value: 10000 } as any} cy={{ value: 5000 } as any} />);
      expect(toJSON()).not.toBeNull();
    });
  });

  describe('Chart Height Variations', () => {
    it('should handle small chart height', () => {
      const { toJSON } = render(<Cursor {...defaultProps} chartHeight={50} />);
      expect(toJSON()).not.toBeNull();
    });

    it('should handle large chart height', () => {
      const { toJSON } = render(<Cursor {...defaultProps} chartHeight={1000} />);
      expect(toJSON()).not.toBeNull();
    });

    it('should handle zero chart height', () => {
      const { toJSON } = render(<Cursor {...defaultProps} chartHeight={0} />);
      expect(toJSON()).not.toBeNull();
    });

    it('should handle chart height smaller than cursor position', () => {
      const { toJSON } = render(<Cursor {...defaultProps} chartHeight={30} cy={{ value: 50 } as any} />);
      expect(toJSON()).not.toBeNull();
    });
  });

  describe('Color Variations', () => {
    it('should handle different primary colors', () => {
      const customColors = {
        ...mockColors.colors,
        primary: '#FF00FF',
      };
      const { toJSON } = render(<Cursor {...defaultProps} colors={customColors} />);
      expect(toJSON()).not.toBeNull();
    });

    it('should handle hex colors with alpha', () => {
      const customColors = {
        ...mockColors.colors,
        primary: '#FF00FF80',
      };
      const { toJSON } = render(<Cursor {...defaultProps} colors={customColors} />);
      expect(toJSON()).not.toBeNull();
    });

    it('should handle RGB colors', () => {
      const customColors = {
        ...mockColors.colors,
        primary: 'rgb(255, 0, 255)',
      };
      const { toJSON } = render(<Cursor {...defaultProps} colors={customColors} />);
      expect(toJSON()).not.toBeNull();
    });

    it('should handle named colors', () => {
      const customColors = {
        ...mockColors.colors,
        primary: 'red',
      };
      const { toJSON } = render(<Cursor {...defaultProps} colors={customColors} />);
      expect(toJSON()).not.toBeNull();
    });
  });

  describe('Visibility States', () => {
    it('should handle visibility toggle', () => {
      const { toJSON: visible } = render(<Cursor {...defaultProps} showCursor={true} />);
      const { toJSON: hidden } = render(<Cursor {...defaultProps} showCursor={false} />);

      expect(visible()).not.toEqual(hidden());
    });

    it('should maintain structure when visibility changes', () => {
      const { toJSON } = render(<Cursor {...defaultProps} showCursor={false} />);
      expect(toJSON()).not.toBeNull();
    });
  });

  describe('Props Integration', () => {
    it('should handle all props together', () => {
      const customColors = {
        ...mockColors.colors,
        primary: '#BLUE',
      };

      const { toJSON } = render(
        <Cursor cx={{ value: 250 } as any} cy={{ value: 125 } as any} chartHeight={300} colors={customColors} showCursor={true} />,
      );
      expect(toJSON()).not.toBeNull();
    });

    it('should render consistently with same props', () => {
      const { toJSON: first } = render(<Cursor {...defaultProps} />);
      const { toJSON: second } = render(<Cursor {...defaultProps} />);

      expect(first()).toEqual(second());
    });
  });

  describe('Edge Cases', () => {
    it('should handle decimal positions', () => {
      const { toJSON } = render(<Cursor {...defaultProps} cx={{ value: 150.5 } as any} cy={{ value: 75.7 } as any} />);
      expect(toJSON()).not.toBeNull();
    });

    it('should handle very precise decimal positions', () => {
      const { toJSON } = render(<Cursor {...defaultProps} cx={{ value: 150.123456 } as any} cy={{ value: 75.987654 } as any} />);
      expect(toJSON()).not.toBeNull();
    });

    it('should handle extreme position combinations', () => {
      const { toJSON } = render(
        <Cursor
          {...defaultProps}
          cx={{ value: Number.MAX_SAFE_INTEGER } as any}
          cy={{ value: Number.MIN_SAFE_INTEGER } as any}
          chartHeight={Number.MAX_SAFE_INTEGER}
        />,
      );
      expect(toJSON()).not.toBeNull();
    });

    it('should handle chart height much larger than cursor position', () => {
      const { toJSON } = render(<Cursor {...defaultProps} chartHeight={10000} cy={{ value: 10 } as any} />);
      expect(toJSON()).not.toBeNull();
    });

    it('should handle cursor position equal to chart height', () => {
      const { toJSON } = render(<Cursor {...defaultProps} chartHeight={200} cy={{ value: 200 } as any} />);
      expect(toJSON()).not.toBeNull();
    });
  });

  describe('Animation Values', () => {
    it('should handle shared values properly', () => {
      const animatedCx = { value: 100 } as any;
      const animatedCy = { value: 50 } as any;

      const { toJSON } = render(<Cursor {...defaultProps} cx={animatedCx} cy={animatedCy} />);
      expect(toJSON()).not.toBeNull();
    });

    it('should handle changing animation values', () => {
      const animatedCx = { value: 100 } as any;
      const animatedCy = { value: 50 } as any;

      const { toJSON: initial } = render(<Cursor {...defaultProps} cx={animatedCx} cy={animatedCy} />);

      // Simulate value change
      animatedCx.value = 200;
      animatedCy.value = 75;

      const { toJSON: updated } = render(<Cursor {...defaultProps} cx={animatedCx} cy={animatedCy} />);

      expect(initial()).not.toBeNull();
      expect(updated()).not.toBeNull();
    });
  });
});
