import React from 'react';

import { GraphGradient } from './graph-gradient';

// Mock dependencies
jest.mock('@shopify/react-native-skia', () => ({
  LinearGradient: 'MockLinearGradient',
  Path: 'MockPath',
  Skia: {
    Path: {
      MakeFromSVGString: jest.fn(() => ({
        lineTo: jest.fn().mockReturnThis(),
        getPoint: jest.fn(() => ({ y: 100 })),
      })),
    },
  },
}));

jest.mock('react-native', () => ({
  useColorScheme: jest.fn(() => 'light'),
}));

const mockColors = {
  primary: '#00FF00',
  primaryRed: '#FF0000',
  text: '#000000',
  background: '#FFFFFF',
  border: '#CCCCCC',
  success: '#00FF00',
  info: '#0000FF',
  transparent: 'transparent',
  shadow: '#000000',
  overlay: 'rgba(0,0,0,0.5)',
} as any;

describe('GraphGradient', () => {
  const mockAnimationGradient = {
    value: { x: 0, y: 100 },
    get: () => ({ x: 0, y: 100 }),
    set: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
    modify: jest.fn(),
  } as any;

  const defaultProps = {
    chartHeight: 200,
    chartWidth: 300,
    chartMarginVertical: 16,
    curvedLine: 'M0,100L300,100',
    animationGradient: mockAnimationGradient,
    colors: mockColors as any,
    balance: 'positive' as const,
  };

  describe('Basic Functionality', () => {
    it('should instantiate the component function', () => {
      expect(GraphGradient).toBeDefined();
      expect(typeof GraphGradient).toBe('function');
    });

    it('should call the component function without throwing', () => {
      expect(() => GraphGradient(defaultProps)).not.toThrow();
    });

    it('should return a React element when called', () => {
      const result = GraphGradient(defaultProps);
      expect(result).toBeDefined();
      expect(React.isValidElement(result)).toBe(true);
    });
  });

  describe('Props Handling', () => {
    it('should handle positive balance', () => {
      const props = { ...defaultProps, balance: 'positive' as const };
      expect(() => GraphGradient(props)).not.toThrow();
    });

    it('should handle negative balance', () => {
      const props = { ...defaultProps, balance: 'negative' as const };
      expect(() => GraphGradient(props)).not.toThrow();
    });

    it('should handle default balance when not specified', () => {
      const { balance: _balance, ...propsWithoutBalance } = defaultProps;
      expect(() => GraphGradient(propsWithoutBalance as any)).not.toThrow();
    });
  });

  describe('Dimension Handling', () => {
    it('should handle different chart dimensions', () => {
      const props = { ...defaultProps, chartHeight: 150, chartWidth: 250 };
      expect(() => GraphGradient(props)).not.toThrow();
    });

    it('should handle small dimensions', () => {
      const props = { ...defaultProps, chartHeight: 50, chartWidth: 100 };
      expect(() => GraphGradient(props)).not.toThrow();
    });

    it('should handle large dimensions', () => {
      const props = { ...defaultProps, chartHeight: 1000, chartWidth: 2000 };
      expect(() => GraphGradient(props)).not.toThrow();
    });

    it('should handle zero dimensions', () => {
      const props = { ...defaultProps, chartHeight: 0, chartWidth: 0 };
      expect(() => GraphGradient(props)).not.toThrow();
    });

    it('should apply chartMarginVertical to gradient path', () => {
      const { Skia } = require('@shopify/react-native-skia');
      const mockPath = {
        lineTo: jest.fn().mockReturnThis(),
        getPoint: jest.fn(() => ({ y: 100 })),
      };
      Skia.Path.MakeFromSVGString.mockReturnValue(mockPath);

      const props = { ...defaultProps, chartHeight: 200, chartMarginVertical: 20 };
      GraphGradient(props);

      // Verify lineTo was called with height - marginVertical (200 - 20 = 180)
      expect(mockPath.lineTo).toHaveBeenCalledWith(300, 180);
      expect(mockPath.lineTo).toHaveBeenCalledWith(0, 180);
    });

    it('should handle zero margin', () => {
      const props = { ...defaultProps, chartMarginVertical: 0 };
      expect(() => GraphGradient(props)).not.toThrow();
    });

    it('should handle negative margin', () => {
      const props = { ...defaultProps, chartMarginVertical: -10 };
      expect(() => GraphGradient(props)).not.toThrow();
    });
  });

  describe('Curved Line Variations', () => {
    it('should handle simple straight line', () => {
      const props = { ...defaultProps, curvedLine: 'M0,100L300,100' };
      expect(() => GraphGradient(props)).not.toThrow();
    });

    it('should handle complex curved path', () => {
      const props = {
        ...defaultProps,
        curvedLine: 'M10,100C50,50 100,150 150,100C200,50 250,150 290,100',
      };
      expect(() => GraphGradient(props)).not.toThrow();
    });

    it('should handle empty curved line', () => {
      const props = { ...defaultProps, curvedLine: '' };
      expect(() => GraphGradient(props)).not.toThrow();
    });

    it('should handle single point path', () => {
      const props = { ...defaultProps, curvedLine: 'M100,100' };
      expect(() => GraphGradient(props)).not.toThrow();
    });

    it('should handle multi-segment path', () => {
      const props = {
        ...defaultProps,
        curvedLine: 'M0,100L100,50L200,150L300,100',
      };
      expect(() => GraphGradient(props)).not.toThrow();
    });
  });

  describe('Animation Gradient', () => {
    it('should handle different animation gradient values', () => {
      const customGradient = {
        ...mockAnimationGradient,
        value: { x: 50, y: 150 },
      };
      const props = { ...defaultProps, animationGradient: customGradient };
      expect(() => GraphGradient(props)).not.toThrow();
    });

    it('should handle zero animation gradient', () => {
      const customGradient = {
        ...mockAnimationGradient,
        value: { x: 0, y: 0 },
      };
      const props = { ...defaultProps, animationGradient: customGradient };
      expect(() => GraphGradient(props)).not.toThrow();
    });

    it('should handle negative animation gradient values', () => {
      const customGradient = {
        ...mockAnimationGradient,
        value: { x: -10, y: -20 },
      };
      const props = { ...defaultProps, animationGradient: customGradient };
      expect(() => GraphGradient(props)).not.toThrow();
    });

    it('should handle large animation gradient values', () => {
      const customGradient = {
        ...mockAnimationGradient,
        value: { x: 1000, y: 2000 },
      };
      const props = { ...defaultProps, animationGradient: customGradient };
      expect(() => GraphGradient(props)).not.toThrow();
    });
  });

  describe('Color Configuration', () => {
    it('should handle different color themes', () => {
      const customColors = {
        ...mockColors,
        primary: '#FF00FF',
        primaryRed: '#00FFFF',
      } as any;
      const props = { ...defaultProps, colors: customColors };
      expect(() => GraphGradient(props)).not.toThrow();
    });

    it('should handle minimal color configuration', () => {
      const minimalColors = {
        primary: '#000',
        primaryRed: '#FFF',
      } as any;
      const props = { ...defaultProps, colors: minimalColors };
      expect(() => GraphGradient(props)).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should handle all props together', () => {
      const complexGradient = {
        ...mockAnimationGradient,
        value: { x: 150, y: 300 },
      };
      const complexProps = {
        chartHeight: 500,
        chartWidth: 800,
        chartMargin: 25,
        curvedLine: 'M0,250C100,150 200,350 300,250C400,150 500,350 600,250C700,150 800,350 800,250',
        animationGradient: complexGradient,
        colors: mockColors,
        balance: 'negative' as const,
      };
      expect(() => GraphGradient(complexProps)).not.toThrow();
    });

    it('should handle component instantiation multiple times', () => {
      expect(() => {
        GraphGradient(defaultProps);
        GraphGradient(defaultProps);
        GraphGradient(defaultProps);
      }).not.toThrow();
    });
  });
});
