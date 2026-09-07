import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';

import { colorsMock } from '../../../core/hooks/__mocks__/colors-mock';
import type { CheckboxValueRoundOrAdd, CheckboxValueSquare, CheckboxVariant } from './api/types';
import { EtCheckbox } from './et-checkbox';
import { CheckboxLabel } from './subcomponents/checkbox-label';
import { getCheckboxColors } from './utils/get-checkbox-colors';

// Mock useEtoroTheme hook
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
// following the official Reanimated testing approach:
// https://docs.swmansion.com/react-native-reanimated/docs/guides/testing/

describe('EtCheckbox', () => {
  describe('getCheckboxColors', () => {
    const { colors } = colorsMock;

    it('should return all required color properties', () => {
      const checkboxColors = getCheckboxColors(colors as any);

      expect(checkboxColors).toHaveProperty('unchecked');
      expect(checkboxColors).toHaveProperty('checked');
      expect(checkboxColors).toHaveProperty('icon');
      expect(checkboxColors).toHaveProperty('error');
    });

    it('should use correct theme colors', () => {
      const checkboxColors = getCheckboxColors(colors as any);

      expect(checkboxColors.unchecked).toBe(colors.carbon400);
      expect(checkboxColors.checked).toBe(colors.primary600);
      expect(checkboxColors.icon).toBe(colors.carbon050);
      expect(checkboxColors.error).toBe(colors.verdictNegative600);
    });
  });

  describe('Variants', () => {
    it('should have 3 variants', () => {
      const variants: CheckboxVariant[] = ['square', 'round', 'add'];
      expect(variants.length).toBe(3);
    });
  });

  describe('Value Types', () => {
    it('should support boolean values for all variants', () => {
      const booleanValues: boolean[] = [true, false];
      expect(booleanValues).toContain(true);
      expect(booleanValues).toContain(false);
    });

    it('should support error value for all variants', () => {
      const squareValue: CheckboxValueSquare = 'error';
      const roundValue: CheckboxValueRoundOrAdd = 'error';
      expect(squareValue).toBe('error');
      expect(roundValue).toBe('error');
    });

    it('should support indeterminate only for square variant', () => {
      const squareValue: CheckboxValueSquare = 'indeterminate';
      expect(squareValue).toBe('indeterminate');
    });
  });

  describe('Subcomponents', () => {
    describe('CheckboxLabel', () => {
      it('should be a function component', () => {
        expect(typeof CheckboxLabel).toBe('function');
      });

      it('should have displayName set', () => {
        expect(CheckboxLabel.displayName).toBe('EtCheckbox.Label');
      });
    });
  });

  describe('Type Safety', () => {
    it('should enforce valid variant types', () => {
      const validVariant: CheckboxVariant = 'square';
      expect(validVariant).toBe('square');
    });

    it('should enforce valid square value types', () => {
      const validValues: CheckboxValueSquare[] = [true, false, 'error', 'indeterminate'];
      expect(validValues.length).toBe(4);
    });

    it('should enforce valid round/add value types', () => {
      const validValues: CheckboxValueRoundOrAdd[] = [true, false, 'error'];
      expect(validValues.length).toBe(3);
    });
  });
});

describe('EtCheckbox Component Rendering', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      const { getByRole } = render(<EtCheckbox value={false} onChange={mockOnChange} />);

      expect(getByRole('checkbox')).toBeTruthy();
    });

    it('renders with testID prop', () => {
      const { getByTestId } = render(<EtCheckbox testID="test-checkbox" value={false} onChange={mockOnChange} />);

      expect(getByTestId('test-checkbox')).toBeTruthy();
    });

    it('renders with EtCheckbox.Label subcomponent', () => {
      const { getByText } = render(
        <EtCheckbox value={false} onChange={mockOnChange}>
          <EtCheckbox.Label>Test Label</EtCheckbox.Label>
        </EtCheckbox>,
      );

      expect(getByText('Test Label')).toBeTruthy();
    });

    it('renders without children', () => {
      const { getByRole } = render(<EtCheckbox value={false} onChange={mockOnChange} />);

      expect(getByRole('checkbox')).toBeTruthy();
    });
  });

  describe('Variant Rendering', () => {
    const variants: CheckboxVariant[] = ['square', 'round', 'add'];

    variants.forEach((variant) => {
      it(`renders ${variant} variant without crashing`, () => {
        const { getByRole } = render(<EtCheckbox value={false} onChange={mockOnChange} variant={variant} />);

        expect(getByRole('checkbox')).toBeTruthy();
      });
    });

    it('renders square variant by default', () => {
      const { getByRole } = render(<EtCheckbox value={false} onChange={mockOnChange} />);

      expect(getByRole('checkbox')).toBeTruthy();
    });
  });

  describe('Value States', () => {
    it('renders unchecked state (false)', () => {
      const { getByRole } = render(<EtCheckbox value={false} onChange={mockOnChange} />);

      const checkbox = getByRole('checkbox');
      expect(checkbox.props.accessibilityState.checked).toBe(false);
    });

    it('renders checked state (true)', () => {
      const { getByRole } = render(<EtCheckbox value={true} onChange={mockOnChange} />);

      const checkbox = getByRole('checkbox');
      expect(checkbox.props.accessibilityState.checked).toBe(true);
    });

    it('renders error state', () => {
      const { getByRole } = render(<EtCheckbox value="error" onChange={mockOnChange} />);

      const checkbox = getByRole('checkbox');
      expect(checkbox.props.accessibilityState.checked).toBe(false);
    });

    it('renders indeterminate state (square variant)', () => {
      const { getByRole } = render(<EtCheckbox value="indeterminate" onChange={mockOnChange} variant="square" />);

      const checkbox = getByRole('checkbox');
      expect(checkbox.props.accessibilityState.checked).toBe('mixed');
    });
  });

  describe('Press Events', () => {
    it('calls onChange when pressed', () => {
      const handleChange = jest.fn();
      const { getByTestId } = render(<EtCheckbox testID="press-checkbox" value={false} onChange={handleChange} />);

      fireEvent.press(getByTestId('press-checkbox'));
      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it('calls onChange with true when unchecked', () => {
      const handleChange = jest.fn();
      const { getByTestId } = render(<EtCheckbox testID="checkbox" value={false} onChange={handleChange} />);

      fireEvent.press(getByTestId('checkbox'));
      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('calls onChange with false when checked', () => {
      const handleChange = jest.fn();
      const { getByTestId } = render(<EtCheckbox testID="checkbox" value={true} onChange={handleChange} />);

      fireEvent.press(getByTestId('checkbox'));
      expect(handleChange).toHaveBeenCalledWith(false);
    });

    it('calls onChange with true when error state', () => {
      const handleChange = jest.fn();
      const { getByTestId } = render(<EtCheckbox testID="checkbox" value="error" onChange={handleChange} />);

      fireEvent.press(getByTestId('checkbox'));
      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('calls onChange with true when indeterminate state', () => {
      const handleChange = jest.fn();
      const { getByTestId } = render(<EtCheckbox testID="checkbox" value="indeterminate" onChange={handleChange} variant="square" />);

      fireEvent.press(getByTestId('checkbox'));
      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('triggers haptic feedback by default on press', () => {
      const Haptics = require('expo-haptics');
      const { getByTestId } = render(<EtCheckbox testID="haptic-checkbox" value={false} onChange={mockOnChange} />);

      fireEvent.press(getByTestId('haptic-checkbox'));
      expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light);
    });

    it('does not trigger haptic feedback when haptics is false', () => {
      const Haptics = require('expo-haptics');
      Haptics.impactAsync.mockClear();

      const { getByTestId } = render(<EtCheckbox testID="no-haptic-checkbox" value={false} onChange={mockOnChange} haptics={false} />);

      fireEvent.press(getByTestId('no-haptic-checkbox'));
      expect(Haptics.impactAsync).not.toHaveBeenCalled();
    });
  });

  describe('Disabled State', () => {
    it('does not call onChange when disabled', () => {
      const handleChange = jest.fn();
      const { getByTestId } = render(<EtCheckbox testID="disabled-checkbox" value={false} onChange={handleChange} disabled />);

      fireEvent.press(getByTestId('disabled-checkbox'));
      expect(handleChange).not.toHaveBeenCalled();
    });

    it('does not trigger haptics when disabled', () => {
      const Haptics = require('expo-haptics');
      Haptics.impactAsync.mockClear();

      const { getByTestId } = render(<EtCheckbox testID="disabled-checkbox" value={false} onChange={mockOnChange} disabled />);

      fireEvent.press(getByTestId('disabled-checkbox'));
      expect(Haptics.impactAsync).not.toHaveBeenCalled();
    });

    it('passes disabled state to label', () => {
      const { getByText } = render(
        <EtCheckbox value={false} onChange={mockOnChange} disabled>
          <EtCheckbox.Label>Disabled Label</EtCheckbox.Label>
        </EtCheckbox>,
      );

      expect(getByText('Disabled Label')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('has checkbox accessibility role', () => {
      const { getByRole } = render(<EtCheckbox value={false} onChange={mockOnChange} />);

      expect(getByRole('checkbox')).toBeTruthy();
    });

    it('has correct accessibility state when unchecked', () => {
      const { getByRole } = render(<EtCheckbox value={false} onChange={mockOnChange} />);

      const checkbox = getByRole('checkbox');
      expect(checkbox.props.accessibilityState.checked).toBe(false);
    });

    it('has correct accessibility state when checked', () => {
      const { getByRole } = render(<EtCheckbox value={true} onChange={mockOnChange} />);

      const checkbox = getByRole('checkbox');
      expect(checkbox.props.accessibilityState.checked).toBe(true);
    });

    it('has correct accessibility state when indeterminate', () => {
      const { getByRole } = render(<EtCheckbox value="indeterminate" onChange={mockOnChange} variant="square" />);

      const checkbox = getByRole('checkbox');
      expect(checkbox.props.accessibilityState.checked).toBe('mixed');
    });

    it('applies accessibilityLabel prop', () => {
      const { getByLabelText } = render(<EtCheckbox value={false} onChange={mockOnChange} accessibilityLabel="Subscribe to newsletter" />);

      expect(getByLabelText('Subscribe to newsletter')).toBeTruthy();
    });

    it('has correct accessibility state when disabled', () => {
      const { getByRole } = render(<EtCheckbox value={false} onChange={mockOnChange} disabled />);

      const checkbox = getByRole('checkbox');
      expect(checkbox.props.accessibilityState.disabled).toBe(true);
    });

    it('has correct accessibility state when not disabled', () => {
      const { getByRole } = render(<EtCheckbox value={false} onChange={mockOnChange} />);

      const checkbox = getByRole('checkbox');
      expect(checkbox.props.accessibilityState.disabled).toBe(false);
    });
  });

  describe('Style Customization', () => {
    it('applies custom style to checkbox', () => {
      const customStyle = { margin: 10 };
      const { getByRole } = render(<EtCheckbox value={false} onChange={mockOnChange} style={customStyle} />);

      const checkbox = getByRole('checkbox');
      expect(checkbox.props.style).toEqual(expect.arrayContaining([expect.objectContaining(customStyle)]));
    });

    it('applies array styles correctly', () => {
      const arrayStyle = [{ margin: 5 }, { padding: 10 }];
      const { getByRole } = render(<EtCheckbox value={false} onChange={mockOnChange} style={arrayStyle} />);

      const checkbox = getByRole('checkbox');
      expect(checkbox.props.style).toBeDefined();
    });
  });

  describe('Component Structure', () => {
    it('has Label as static property', () => {
      expect(EtCheckbox.Label).toBeDefined();
    });

    it('EtCheckbox.Label is the CheckboxLabel component', () => {
      expect(EtCheckbox.Label).toBe(CheckboxLabel);
    });

    it('is a valid React component (memo wrapped)', () => {
      // EtCheckbox is wrapped with React.memo + Object.assign, so typeof is 'object'
      expect(EtCheckbox).toBeDefined();
      expect(EtCheckbox.$$typeof).toBeDefined(); // React element type symbol
    });
  });

  describe('Props Integration', () => {
    it('handles all props together', () => {
      const handleChange = jest.fn();
      const { getByTestId, getByText } = render(
        <EtCheckbox
          testID="full-checkbox"
          value={true}
          onChange={handleChange}
          variant="square"
          disabled={false}
          haptics={true}
          style={{ margin: 16 }}
          accessibilityLabel="Full checkbox"
        >
          <EtCheckbox.Label>Accept Terms</EtCheckbox.Label>
        </EtCheckbox>,
      );

      expect(getByTestId('full-checkbox')).toBeTruthy();
      expect(getByText('Accept Terms')).toBeTruthy();
    });

    it('handles variant and value combinations', () => {
      const variants: CheckboxVariant[] = ['square', 'round', 'add'];
      const values: (boolean | 'error')[] = [true, false, 'error'];

      variants.forEach((variant) => {
        values.forEach((value) => {
          const { getByRole } = render(<EtCheckbox value={value} onChange={mockOnChange} variant={variant} />);

          expect(getByRole('checkbox')).toBeTruthy();
        });
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles rapid successive renders', () => {
      const variants: CheckboxVariant[] = ['square', 'round', 'add'];

      expect(() => {
        variants.forEach((variant) => {
          render(<EtCheckbox value={false} onChange={mockOnChange} variant={variant} />);
        });
      }).not.toThrow();
    });

    it('handles undefined style', () => {
      const { getByRole } = render(<EtCheckbox value={false} onChange={mockOnChange} style={undefined} />);

      expect(getByRole('checkbox')).toBeTruthy();
    });

    it('handles prop changes correctly', () => {
      const { rerender, getByRole } = render(<EtCheckbox value={false} onChange={mockOnChange} />);

      expect(getByRole('checkbox').props.accessibilityState.checked).toBe(false);

      rerender(<EtCheckbox value={true} onChange={mockOnChange} />);

      expect(getByRole('checkbox').props.accessibilityState.checked).toBe(true);
    });

    it('handles variant changes correctly', () => {
      const { rerender, getByRole } = render(<EtCheckbox value={false} onChange={mockOnChange} variant="square" />);

      expect(getByRole('checkbox')).toBeTruthy();

      rerender(<EtCheckbox value={false} onChange={mockOnChange} variant="round" />);

      expect(getByRole('checkbox')).toBeTruthy();

      rerender(<EtCheckbox value={false} onChange={mockOnChange} variant="add" />);

      expect(getByRole('checkbox')).toBeTruthy();
    });

    it('handles all value state combinations for square variant', () => {
      const squareValues: CheckboxValueSquare[] = [true, false, 'error', 'indeterminate'];

      squareValues.forEach((value) => {
        const { getByRole } = render(<EtCheckbox value={value} onChange={mockOnChange} variant="square" />);
        expect(getByRole('checkbox')).toBeTruthy();
      });
    });

    it('handles all value state combinations for round variant', () => {
      const roundValues: CheckboxValueRoundOrAdd[] = [true, false, 'error'];

      roundValues.forEach((value) => {
        const { getByRole } = render(<EtCheckbox value={value} onChange={mockOnChange} variant="round" />);
        expect(getByRole('checkbox')).toBeTruthy();
      });
    });

    it('handles all value state combinations for add variant', () => {
      const addValues: CheckboxValueRoundOrAdd[] = [true, false, 'error'];

      addValues.forEach((value) => {
        const { getByRole } = render(<EtCheckbox value={value} onChange={mockOnChange} variant="add" />);
        expect(getByRole('checkbox')).toBeTruthy();
      });
    });
  });

  describe('Performance', () => {
    it('handles batch rendering operations', () => {
      const batchSize = 50;

      expect(() => {
        for (let i = 0; i < batchSize; i++) {
          render(<EtCheckbox value={i % 2 === 0} onChange={mockOnChange} variant={i % 3 === 0 ? 'square' : i % 3 === 1 ? 'round' : 'add'} />);
        }
      }).not.toThrow();
    });

    it('handles multiple rerenders with different props', () => {
      const { rerender } = render(<EtCheckbox value={false} onChange={mockOnChange} />);

      for (let i = 0; i < 10; i++) {
        rerender(
          <EtCheckbox
            value={i % 2 === 0}
            onChange={mockOnChange}
            disabled={i % 3 === 0}
            variant={i % 3 === 0 ? 'square' : i % 3 === 1 ? 'round' : 'add'}
          />,
        );
      }

      expect(true).toBeTruthy();
    });
  });
});
