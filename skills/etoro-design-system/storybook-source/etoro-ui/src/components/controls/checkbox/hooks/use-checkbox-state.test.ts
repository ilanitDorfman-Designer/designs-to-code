import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, renderHook } from '@testing-library/react-native';

import type { CheckboxValue, CheckboxVariant } from '../api/types';
import type { CheckboxColors } from '../utils/get-checkbox-colors';
import { useCheckboxState, UseCheckboxStateParams } from './use-checkbox-state';

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
}));

// Note: react-native-reanimated is mocked globally in jest.setup.ts

describe('useCheckboxState', () => {
  const mockColors: CheckboxColors = {
    unchecked: '#999999',
    checked: '#00AA00',
    icon: '#FFFFFF',
    error: '#FF0000',
  };

  const defaultParams: UseCheckboxStateParams = {
    value: false,
    disabled: false,
    haptics: true,
    onChange: jest.fn(),
    colors: mockColors,
    variant: 'square',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Return Shape', () => {
    it('should return all expected properties', () => {
      const { result } = renderHook(() => useCheckboxState(defaultParams));

      expect(result.current).toHaveProperty('checkAnimationValue');
      expect(result.current).toHaveProperty('animatedContainerStyle');
      expect(result.current).toHaveProperty('handlePress');
      expect(result.current).toHaveProperty('isChecked');
      expect(result.current).toHaveProperty('isIndeterminate');
    });

    it('should return handlePress as a function', () => {
      const { result } = renderHook(() => useCheckboxState(defaultParams));

      expect(typeof result.current.handlePress).toBe('function');
    });
  });

  describe('State Derivation - isChecked', () => {
    it('should derive isChecked=true when value=true', () => {
      const { result } = renderHook(() => useCheckboxState({ ...defaultParams, value: true }));

      expect(result.current.isChecked).toBe(true);
    });

    it('should derive isChecked=false when value=false', () => {
      const { result } = renderHook(() => useCheckboxState({ ...defaultParams, value: false }));

      expect(result.current.isChecked).toBe(false);
    });

    it('should derive isChecked=false when value="error"', () => {
      const { result } = renderHook(() => useCheckboxState({ ...defaultParams, value: 'error' }));

      expect(result.current.isChecked).toBe(false);
    });

    it('should derive isChecked=false when value="indeterminate"', () => {
      const { result } = renderHook(() => useCheckboxState({ ...defaultParams, value: 'indeterminate' }));

      expect(result.current.isChecked).toBe(false);
    });
  });

  describe('State Derivation - isIndeterminate', () => {
    it('should derive isIndeterminate=true when value="indeterminate" and variant="square"', () => {
      const { result } = renderHook(() =>
        useCheckboxState({
          ...defaultParams,
          value: 'indeterminate',
          variant: 'square',
        }),
      );

      expect(result.current.isIndeterminate).toBe(true);
    });

    it('should derive isIndeterminate=false when value="indeterminate" and variant="round"', () => {
      const { result } = renderHook(() =>
        useCheckboxState({
          ...defaultParams,
          value: 'indeterminate' as CheckboxValue,
          variant: 'round',
        }),
      );

      expect(result.current.isIndeterminate).toBe(false);
    });

    it('should derive isIndeterminate=false when value="indeterminate" and variant="add"', () => {
      const { result } = renderHook(() =>
        useCheckboxState({
          ...defaultParams,
          value: 'indeterminate' as CheckboxValue,
          variant: 'add',
        }),
      );

      expect(result.current.isIndeterminate).toBe(false);
    });

    it('should derive isIndeterminate=false when value=true', () => {
      const { result } = renderHook(() => useCheckboxState({ ...defaultParams, value: true }));

      expect(result.current.isIndeterminate).toBe(false);
    });

    it('should derive isIndeterminate=false when value=false', () => {
      const { result } = renderHook(() => useCheckboxState({ ...defaultParams, value: false }));

      expect(result.current.isIndeterminate).toBe(false);
    });

    it('should derive isIndeterminate=false when value="error"', () => {
      const { result } = renderHook(() => useCheckboxState({ ...defaultParams, value: 'error' }));

      expect(result.current.isIndeterminate).toBe(false);
    });
  });

  describe('Press Handler - Toggle Behavior', () => {
    it('should call onChange with true when value=false', () => {
      const onChange = jest.fn();
      const { result } = renderHook(() => useCheckboxState({ ...defaultParams, value: false, onChange }));

      act(() => {
        result.current.handlePress();
      });

      expect(onChange).toHaveBeenCalledWith(true);
    });

    it('should call onChange with false when value=true', () => {
      const onChange = jest.fn();
      const { result } = renderHook(() => useCheckboxState({ ...defaultParams, value: true, onChange }));

      act(() => {
        result.current.handlePress();
      });

      expect(onChange).toHaveBeenCalledWith(false);
    });

    it('should call onChange with true when value="error"', () => {
      const onChange = jest.fn();
      const { result } = renderHook(() => useCheckboxState({ ...defaultParams, value: 'error', onChange }));

      act(() => {
        result.current.handlePress();
      });

      expect(onChange).toHaveBeenCalledWith(true);
    });

    it('should call onChange with true when value="indeterminate"', () => {
      const onChange = jest.fn();
      const { result } = renderHook(() =>
        useCheckboxState({
          ...defaultParams,
          value: 'indeterminate',
          variant: 'square',
          onChange,
        }),
      );

      act(() => {
        result.current.handlePress();
      });

      expect(onChange).toHaveBeenCalledWith(true);
    });
  });

  describe('Press Handler - Disabled State', () => {
    it('should not call onChange when disabled=true', () => {
      const onChange = jest.fn();
      const { result } = renderHook(() => useCheckboxState({ ...defaultParams, disabled: true, onChange }));

      act(() => {
        result.current.handlePress();
      });

      expect(onChange).not.toHaveBeenCalled();
    });

    it('should call onChange when disabled=false', () => {
      const onChange = jest.fn();
      const { result } = renderHook(() => useCheckboxState({ ...defaultParams, disabled: false, onChange }));

      act(() => {
        result.current.handlePress();
      });

      expect(onChange).toHaveBeenCalledTimes(1);
    });
  });

  describe('Press Handler - Haptic Feedback', () => {
    it('should trigger haptic feedback when haptics=true', () => {
      const Haptics = require('expo-haptics');
      const { result } = renderHook(() => useCheckboxState({ ...defaultParams, haptics: true }));

      act(() => {
        result.current.handlePress();
      });

      expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light);
    });

    it('should not trigger haptic feedback when haptics=false', () => {
      const Haptics = require('expo-haptics');
      const { result } = renderHook(() => useCheckboxState({ ...defaultParams, haptics: false }));

      act(() => {
        result.current.handlePress();
      });

      expect(Haptics.impactAsync).not.toHaveBeenCalled();
    });

    it('should not trigger haptic feedback when disabled=true even if haptics=true', () => {
      const Haptics = require('expo-haptics');
      const { result } = renderHook(() => useCheckboxState({ ...defaultParams, haptics: true, disabled: true }));

      act(() => {
        result.current.handlePress();
      });

      expect(Haptics.impactAsync).not.toHaveBeenCalled();
    });
  });

  describe('Animation Values', () => {
    // Note: The reanimated mock returns animation config objects when withTiming is called
    // in useEffect. We check the toValue property to verify the target animation value.
    it('should target checkAnimationValue of 1 when value=true', () => {
      const { result } = renderHook(() => useCheckboxState({ ...defaultParams, value: true }));

      const animValue = result.current.checkAnimationValue.value;
      // When withTiming is called, the mock stores an object with toValue
      if (typeof animValue === 'object' && animValue !== null) {
        expect((animValue as { toValue: number }).toValue).toBe(1);
      } else {
        expect(animValue).toBe(1);
      }
    });

    it('should target checkAnimationValue of 0 when value=false', () => {
      const { result } = renderHook(() => useCheckboxState({ ...defaultParams, value: false }));

      const animValue = result.current.checkAnimationValue.value;
      if (typeof animValue === 'object' && animValue !== null) {
        expect((animValue as { toValue: number }).toValue).toBe(0);
      } else {
        expect(animValue).toBe(0);
      }
    });

    it('should target checkAnimationValue of 0 when value="error"', () => {
      const { result } = renderHook(() => useCheckboxState({ ...defaultParams, value: 'error' }));

      const animValue = result.current.checkAnimationValue.value;
      if (typeof animValue === 'object' && animValue !== null) {
        expect((animValue as { toValue: number }).toValue).toBe(0);
      } else {
        expect(animValue).toBe(0);
      }
    });

    it('should target checkAnimationValue of 0 when value="indeterminate"', () => {
      const { result } = renderHook(() =>
        useCheckboxState({
          ...defaultParams,
          value: 'indeterminate',
          variant: 'square',
        }),
      );

      const animValue = result.current.checkAnimationValue.value;
      if (typeof animValue === 'object' && animValue !== null) {
        expect((animValue as { toValue: number }).toValue).toBe(0);
      } else {
        expect(animValue).toBe(0);
      }
    });
  });

  describe('Variant Handling', () => {
    const variants: CheckboxVariant[] = ['square', 'round', 'add'];

    variants.forEach((variant) => {
      it(`should work correctly with ${variant} variant`, () => {
        const { result } = renderHook(() => useCheckboxState({ ...defaultParams, variant }));

        expect(result.current.isChecked).toBe(false);
        expect(typeof result.current.handlePress).toBe('function');
      });
    });
  });

  describe('Rerender Behavior', () => {
    it('should update isChecked when value changes', () => {
      const { result, rerender } = renderHook(({ value }) => useCheckboxState({ ...defaultParams, value }), {
        initialProps: { value: false as CheckboxValue },
      });

      expect(result.current.isChecked).toBe(false);

      rerender({ value: true });
      expect(result.current.isChecked).toBe(true);

      rerender({ value: false });
      expect(result.current.isChecked).toBe(false);
    });

    it('should update isIndeterminate when value changes', () => {
      const { result, rerender } = renderHook(({ value }) => useCheckboxState({ ...defaultParams, value, variant: 'square' }), {
        initialProps: { value: false as CheckboxValue },
      });

      expect(result.current.isIndeterminate).toBe(false);

      rerender({ value: 'indeterminate' });
      expect(result.current.isIndeterminate).toBe(true);

      rerender({ value: true });
      expect(result.current.isIndeterminate).toBe(false);
    });

    it('should update handlePress behavior when onChange changes', () => {
      const onChange1 = jest.fn();
      const onChange2 = jest.fn();

      const { result, rerender } = renderHook(({ onChange }) => useCheckboxState({ ...defaultParams, onChange }), {
        initialProps: { onChange: onChange1 },
      });

      act(() => {
        result.current.handlePress();
      });
      expect(onChange1).toHaveBeenCalledTimes(1);
      expect(onChange2).not.toHaveBeenCalled();

      rerender({ onChange: onChange2 });

      act(() => {
        result.current.handlePress();
      });
      expect(onChange1).toHaveBeenCalledTimes(1);
      expect(onChange2).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid successive presses', () => {
      const onChange = jest.fn();
      const { result } = renderHook(() => useCheckboxState({ ...defaultParams, onChange }));

      act(() => {
        for (let i = 0; i < 10; i++) {
          result.current.handlePress();
        }
      });

      expect(onChange).toHaveBeenCalledTimes(10);
    });

    it('should handle all value types for all variants', () => {
      const variants: CheckboxVariant[] = ['square', 'round', 'add'];
      const values: CheckboxValue[] = [true, false, 'error'];

      variants.forEach((variant) => {
        values.forEach((value) => {
          expect(() => {
            renderHook(() => useCheckboxState({ ...defaultParams, variant, value }));
          }).not.toThrow();
        });
      });
    });

    it('should handle indeterminate value for square variant', () => {
      expect(() => {
        renderHook(() =>
          useCheckboxState({
            ...defaultParams,
            variant: 'square',
            value: 'indeterminate',
          }),
        );
      }).not.toThrow();
    });
  });
});
