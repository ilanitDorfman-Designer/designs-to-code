import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { renderHook } from '@testing-library/react-native';

import { colorsMock } from '../../../../core/hooks/__mocks__/colors-mock';
import type { EtCheckboxProps } from '../api/types';
import { useCheckboxConfig } from './use-checkbox-config';

// Mock useEtoroTheme hook
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

describe('useCheckboxConfig', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Return Shape', () => {
    it('should return all expected properties', () => {
      const props: EtCheckboxProps = {
        value: false,
        onChange: jest.fn(),
      };

      const { result } = renderHook(() => useCheckboxConfig(props));

      expect(result.current).toHaveProperty('disabled');
      expect(result.current).toHaveProperty('colors');
      expect(result.current).toHaveProperty('haptics');
      expect(result.current).toHaveProperty('variant');
      expect(result.current).toHaveProperty('size');
      expect(result.current).toHaveProperty('borderRadius');
    });

    it('should return colors with all required properties', () => {
      const props: EtCheckboxProps = {
        value: false,
        onChange: jest.fn(),
      };

      const { result } = renderHook(() => useCheckboxConfig(props));

      expect(result.current.colors).toHaveProperty('unchecked');
      expect(result.current.colors).toHaveProperty('checked');
      expect(result.current.colors).toHaveProperty('icon');
      expect(result.current.colors).toHaveProperty('error');
    });
  });

  describe('Default Values', () => {
    it('should default disabled to false', () => {
      const props: EtCheckboxProps = {
        value: false,
        onChange: jest.fn(),
      };

      const { result } = renderHook(() => useCheckboxConfig(props));

      expect(result.current.disabled).toBe(false);
    });

    it('should default haptics to true', () => {
      const props: EtCheckboxProps = {
        value: false,
        onChange: jest.fn(),
      };

      const { result } = renderHook(() => useCheckboxConfig(props));

      expect(result.current.haptics).toBe(true);
    });

    it('should default variant to "square"', () => {
      const props: EtCheckboxProps = {
        value: false,
        onChange: jest.fn(),
      };

      const { result } = renderHook(() => useCheckboxConfig(props));

      expect(result.current.variant).toBe('square');
    });
  });

  describe('Prop Overrides', () => {
    it('should use disabled=true when provided', () => {
      const props: EtCheckboxProps = {
        value: false,
        onChange: jest.fn(),
        disabled: true,
      };

      const { result } = renderHook(() => useCheckboxConfig(props));

      expect(result.current.disabled).toBe(true);
    });

    it('should use haptics=false when provided', () => {
      const props: EtCheckboxProps = {
        value: false,
        onChange: jest.fn(),
        haptics: false,
      };

      const { result } = renderHook(() => useCheckboxConfig(props));

      expect(result.current.haptics).toBe(false);
    });

    it('should use variant="round" when provided', () => {
      const props: EtCheckboxProps = {
        value: false,
        onChange: jest.fn(),
        variant: 'round',
      };

      const { result } = renderHook(() => useCheckboxConfig(props));

      expect(result.current.variant).toBe('round');
    });

    it('should use variant="add" when provided', () => {
      const props: EtCheckboxProps = {
        value: false,
        onChange: jest.fn(),
        variant: 'add',
      };

      const { result } = renderHook(() => useCheckboxConfig(props));

      expect(result.current.variant).toBe('add');
    });
  });

  describe('Size Calculation', () => {
    it('should return size=24 for square variant', () => {
      const props: EtCheckboxProps = {
        value: false,
        onChange: jest.fn(),
        variant: 'square',
      };

      const { result } = renderHook(() => useCheckboxConfig(props));

      expect(result.current.size).toBe(24);
    });

    it('should return size=30 for round variant', () => {
      const props: EtCheckboxProps = {
        value: false,
        onChange: jest.fn(),
        variant: 'round',
      };

      const { result } = renderHook(() => useCheckboxConfig(props));

      expect(result.current.size).toBe(30);
    });

    it('should return size=30 for add variant', () => {
      const props: EtCheckboxProps = {
        value: false,
        onChange: jest.fn(),
        variant: 'add',
      };

      const { result } = renderHook(() => useCheckboxConfig(props));

      expect(result.current.size).toBe(30);
    });

    it('should return size=24 when variant is not specified (default)', () => {
      const props: EtCheckboxProps = {
        value: false,
        onChange: jest.fn(),
      };

      const { result } = renderHook(() => useCheckboxConfig(props));

      expect(result.current.size).toBe(24);
    });
  });

  describe('Border Radius Calculation', () => {
    it('should return borderRadius=4 for square variant', () => {
      const props: EtCheckboxProps = {
        value: false,
        onChange: jest.fn(),
        variant: 'square',
      };

      const { result } = renderHook(() => useCheckboxConfig(props));

      expect(result.current.borderRadius).toBe(4);
    });

    it('should return borderRadius=15 for round variant', () => {
      const props: EtCheckboxProps = {
        value: false,
        onChange: jest.fn(),
        variant: 'round',
      };

      const { result } = renderHook(() => useCheckboxConfig(props));

      expect(result.current.borderRadius).toBe(15);
    });

    it('should return borderRadius=15 for add variant', () => {
      const props: EtCheckboxProps = {
        value: false,
        onChange: jest.fn(),
        variant: 'add',
      };

      const { result } = renderHook(() => useCheckboxConfig(props));

      expect(result.current.borderRadius).toBe(15);
    });

    it('should return borderRadius=4 when variant is not specified (default)', () => {
      const props: EtCheckboxProps = {
        value: false,
        onChange: jest.fn(),
      };

      const { result } = renderHook(() => useCheckboxConfig(props));

      expect(result.current.borderRadius).toBe(4);
    });
  });

  describe('Colors Derivation', () => {
    it('should derive colors from theme', () => {
      const props: EtCheckboxProps = {
        value: false,
        onChange: jest.fn(),
      };

      const { result } = renderHook(() => useCheckboxConfig(props));
      const { colors } = colorsMock;

      expect(result.current.colors.unchecked).toBe(colors.carbon400);
      expect(result.current.colors.checked).toBe(colors.primary600);
      expect(result.current.colors.icon).toBe(colors.carbon050);
      expect(result.current.colors.error).toBe(colors.verdictNegative600);
    });
  });

  describe('Memoization', () => {
    it('should return stable config object when props do not change', () => {
      const { result, rerender } = renderHook((props: EtCheckboxProps) => useCheckboxConfig(props), {
        initialProps: {
          value: false,
          onChange: jest.fn(),
        } as EtCheckboxProps,
      });
      const firstResult = result.current;

      rerender({
        value: false,
        onChange: jest.fn(),
      });
      const secondResult = result.current;

      expect(firstResult).toBe(secondResult);
    });

    it('should return new config object when props change', () => {
      const { result, rerender } = renderHook(
        ({ disabled }) =>
          useCheckboxConfig({
            value: false,
            onChange: jest.fn(),
            disabled,
          }),
        { initialProps: { disabled: false } },
      );

      const firstResult = result.current;
      expect(firstResult.disabled).toBe(false);

      rerender({ disabled: true });
      const secondResult = result.current;

      expect(secondResult.disabled).toBe(true);
      expect(firstResult).not.toBe(secondResult);
    });
  });

  describe('Edge Cases', () => {
    it('should handle all valid prop combinations', () => {
      const variants = ['square', 'round', 'add'] as const;
      const disabledValues = [true, false, undefined];
      const hapticsValues = [true, false, undefined];

      variants.forEach((variant) => {
        disabledValues.forEach((disabled) => {
          hapticsValues.forEach((haptics) => {
            expect(() => {
              renderHook(() =>
                useCheckboxConfig({
                  value: false,
                  onChange: jest.fn(),
                  variant,
                  disabled,
                  haptics,
                }),
              );
            }).not.toThrow();
          });
        });
      });
    });

    it('should handle explicit undefined props', () => {
      const props: EtCheckboxProps = {
        value: false,
        onChange: jest.fn(),
        disabled: undefined,
        haptics: undefined,
        variant: undefined,
      };

      const { result } = renderHook(() => useCheckboxConfig(props));

      expect(result.current.disabled).toBe(false);
      expect(result.current.haptics).toBe(true);
      expect(result.current.variant).toBe('square');
    });

    it('should handle value types correctly for all variants', () => {
      // Square variant with indeterminate
      const squareProps: EtCheckboxProps = {
        value: 'indeterminate',
        onChange: jest.fn(),
        variant: 'square',
      };
      expect(() => {
        renderHook(() => useCheckboxConfig(squareProps));
      }).not.toThrow();

      // Round variant with error
      const roundProps: EtCheckboxProps = {
        value: 'error',
        onChange: jest.fn(),
        variant: 'round',
      };
      expect(() => {
        renderHook(() => useCheckboxConfig(roundProps));
      }).not.toThrow();

      // Add variant with boolean
      const addProps: EtCheckboxProps = {
        value: true,
        onChange: jest.fn(),
        variant: 'add',
      };
      expect(() => {
        renderHook(() => useCheckboxConfig(addProps));
      }).not.toThrow();
    });
  });
});
