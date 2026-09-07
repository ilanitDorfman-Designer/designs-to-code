import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';
import { View } from 'react-native';

import { colorsMock } from '../../../core/hooks/__mocks__/colors-mock';
import type { EtRadioGroupProps } from './api/types';
import { EtRadioGroup } from './et-radio-group';
import { RadioOption } from './subcomponents/radio-option';
import { getRadioColors } from './utils/get-radio-colors';

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

describe('EtRadioGroup', () => {
  describe('getRadioColors', () => {
    const { colors } = colorsMock;

    it('should return all required color properties', () => {
      const radioColors = getRadioColors(colors as any);

      expect(radioColors).toHaveProperty('unchecked');
      expect(radioColors).toHaveProperty('selectedBorder');
      expect(radioColors).toHaveProperty('selectedFill');
      expect(radioColors).toHaveProperty('error');
      expect(radioColors).toHaveProperty('disabledBackground');
      expect(radioColors).toHaveProperty('disabledBorder');
    });

    it('should use correct theme colors', () => {
      const radioColors = getRadioColors(colors as any);

      expect(radioColors.unchecked).toBe(colors.carbon400);
      expect(radioColors.selectedBorder).toBe(colors.carbon600);
      expect(radioColors.selectedFill).toBe(colors.primary600);
      expect(radioColors.error).toBe(colors.verdictNegative600);
      expect(radioColors.disabledBackground).toBe(colors.carbon050);
      expect(radioColors.disabledBorder).toBe(colors.carbon400);
    });
  });

  describe('Types', () => {
    it('should support string | null value types', () => {
      const nullValue: EtRadioGroupProps['value'] = null;
      const stringValue: EtRadioGroupProps['value'] = 'option1';

      expect(nullValue).toBeNull();
      expect(stringValue).toBe('option1');
    });

    it('should have required props', () => {
      const props: EtRadioGroupProps = {
        value: null,
        onChange: () => {},
        children: null,
      };

      expect(props.value).toBeNull();
      expect(typeof props.onChange).toBe('function');
    });

    it('should support optional props', () => {
      const props: EtRadioGroupProps = {
        value: 'opt1',
        onChange: () => {},
        children: null,
        direction: 'horizontal',
        disabled: true,
        error: true,
        haptics: false,
        testID: 'test',
        accessibilityLabel: 'label',
      };

      expect(props.direction).toBe('horizontal');
      expect(props.disabled).toBe(true);
      expect(props.error).toBe(true);
      expect(props.haptics).toBe(false);
    });
  });

  describe('Subcomponents', () => {
    describe('RadioOption', () => {
      it('should be a function component', () => {
        expect(typeof RadioOption).toBe('function');
      });

      it('should have displayName set', () => {
        expect(RadioOption.displayName).toBe('EtRadioGroup.Option');
      });

      it('should be accessible via EtRadioGroup.Option', () => {
        expect(EtRadioGroup.Option).toBe(RadioOption);
      });
    });
  });
});

describe('EtRadioGroup Component Rendering', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      const { getByTestId } = render(
        <EtRadioGroup value={null} onChange={mockOnChange} testID="radio-group">
          <EtRadioGroup.Option value="opt1">Option 1</EtRadioGroup.Option>
        </EtRadioGroup>,
      );

      expect(getByTestId('radio-group')).toBeTruthy();
    });

    it('renders with testID prop', () => {
      const { getByTestId } = render(
        <EtRadioGroup testID="test-radio-group" value={null} onChange={mockOnChange}>
          <EtRadioGroup.Option value="opt1">Option 1</EtRadioGroup.Option>
        </EtRadioGroup>,
      );

      expect(getByTestId('test-radio-group')).toBeTruthy();
    });

    it('renders options with labels', () => {
      const { getByText } = render(
        <EtRadioGroup value={null} onChange={mockOnChange}>
          <EtRadioGroup.Option value="opt1">First Option</EtRadioGroup.Option>
          <EtRadioGroup.Option value="opt2">Second Option</EtRadioGroup.Option>
        </EtRadioGroup>,
      );

      expect(getByText('First Option')).toBeTruthy();
      expect(getByText('Second Option')).toBeTruthy();
    });

    it('renders multiple options', () => {
      const { getAllByRole } = render(
        <EtRadioGroup value={null} onChange={mockOnChange}>
          <EtRadioGroup.Option value="opt1">Option 1</EtRadioGroup.Option>
          <EtRadioGroup.Option value="opt2">Option 2</EtRadioGroup.Option>
          <EtRadioGroup.Option value="opt3">Option 3</EtRadioGroup.Option>
        </EtRadioGroup>,
      );

      expect(getAllByRole('radio').length).toBe(3);
    });

    it('renders with option testID', () => {
      const { getByTestId } = render(
        <EtRadioGroup value={null} onChange={mockOnChange}>
          <EtRadioGroup.Option value="opt1" testID="option-1">
            Option 1
          </EtRadioGroup.Option>
        </EtRadioGroup>,
      );

      expect(getByTestId('option-1')).toBeTruthy();
    });
  });

  describe('Selection Behavior', () => {
    it('calls onChange when option pressed', () => {
      const handleChange = jest.fn();
      const { getByTestId } = render(
        <EtRadioGroup value={null} onChange={handleChange}>
          <EtRadioGroup.Option value="opt1" testID="option-1">
            Option 1
          </EtRadioGroup.Option>
        </EtRadioGroup>,
      );

      fireEvent.press(getByTestId('option-1'));
      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith('opt1');
    });

    it('does NOT call onChange when clicking already selected option', () => {
      const handleChange = jest.fn();
      const { getByTestId } = render(
        <EtRadioGroup value="opt1" onChange={handleChange}>
          <EtRadioGroup.Option value="opt1" testID="option-1">
            Option 1
          </EtRadioGroup.Option>
        </EtRadioGroup>,
      );

      fireEvent.press(getByTestId('option-1'));
      expect(handleChange).not.toHaveBeenCalled();
    });

    it('correctly shows selected state', () => {
      const { getByTestId } = render(
        <EtRadioGroup value="opt2" onChange={mockOnChange}>
          <EtRadioGroup.Option value="opt1" testID="option-1">
            Option 1
          </EtRadioGroup.Option>
          <EtRadioGroup.Option value="opt2" testID="option-2">
            Option 2
          </EtRadioGroup.Option>
        </EtRadioGroup>,
      );

      const option1 = getByTestId('option-1');
      const option2 = getByTestId('option-2');

      expect(option1.props.accessibilityState.selected).toBe(false);
      expect(option2.props.accessibilityState.selected).toBe(true);
    });

    it('allows changing selection between options', () => {
      const handleChange = jest.fn();
      const { getByTestId } = render(
        <EtRadioGroup value="opt1" onChange={handleChange}>
          <EtRadioGroup.Option value="opt1" testID="option-1">
            Option 1
          </EtRadioGroup.Option>
          <EtRadioGroup.Option value="opt2" testID="option-2">
            Option 2
          </EtRadioGroup.Option>
        </EtRadioGroup>,
      );

      fireEvent.press(getByTestId('option-2'));
      expect(handleChange).toHaveBeenCalledWith('opt2');
    });

    it('handles null initial value', () => {
      const { getAllByRole } = render(
        <EtRadioGroup value={null} onChange={mockOnChange}>
          <EtRadioGroup.Option value="opt1">Option 1</EtRadioGroup.Option>
          <EtRadioGroup.Option value="opt2">Option 2</EtRadioGroup.Option>
        </EtRadioGroup>,
      );

      const radios = getAllByRole('radio');
      expect(radios[0].props.accessibilityState.selected).toBe(false);
      expect(radios[1].props.accessibilityState.selected).toBe(false);
    });
  });

  describe('Disabled States', () => {
    it('group disabled prevents all option presses', () => {
      const handleChange = jest.fn();
      const { getByTestId } = render(
        <EtRadioGroup value={null} onChange={handleChange} disabled>
          <EtRadioGroup.Option value="opt1" testID="option-1">
            Option 1
          </EtRadioGroup.Option>
          <EtRadioGroup.Option value="opt2" testID="option-2">
            Option 2
          </EtRadioGroup.Option>
        </EtRadioGroup>,
      );

      fireEvent.press(getByTestId('option-1'));
      fireEvent.press(getByTestId('option-2'));
      expect(handleChange).not.toHaveBeenCalled();
    });

    it('individual option disabled prevents that option press', () => {
      const handleChange = jest.fn();
      const { getByTestId } = render(
        <EtRadioGroup value={null} onChange={handleChange}>
          <EtRadioGroup.Option value="opt1" testID="option-1" disabled>
            Option 1
          </EtRadioGroup.Option>
          <EtRadioGroup.Option value="opt2" testID="option-2">
            Option 2
          </EtRadioGroup.Option>
        </EtRadioGroup>,
      );

      fireEvent.press(getByTestId('option-1'));
      expect(handleChange).not.toHaveBeenCalled();

      fireEvent.press(getByTestId('option-2'));
      expect(handleChange).toHaveBeenCalledWith('opt2');
    });

    it('sets accessibility disabled state', () => {
      const { getByTestId } = render(
        <EtRadioGroup value={null} onChange={mockOnChange} disabled>
          <EtRadioGroup.Option value="opt1" testID="option-1">
            Option 1
          </EtRadioGroup.Option>
        </EtRadioGroup>,
      );

      expect(getByTestId('option-1').props.accessibilityState.disabled).toBe(true);
    });

    it('does not trigger haptics when group disabled', () => {
      const Haptics = require('expo-haptics');
      Haptics.impactAsync.mockClear();

      const { getByTestId } = render(
        <EtRadioGroup value={null} onChange={mockOnChange} disabled>
          <EtRadioGroup.Option value="opt1" testID="option-1">
            Option 1
          </EtRadioGroup.Option>
        </EtRadioGroup>,
      );

      fireEvent.press(getByTestId('option-1'));
      expect(Haptics.impactAsync).not.toHaveBeenCalled();
    });

    it('does not trigger haptics when option disabled', () => {
      const Haptics = require('expo-haptics');
      Haptics.impactAsync.mockClear();

      const { getByTestId } = render(
        <EtRadioGroup value={null} onChange={mockOnChange}>
          <EtRadioGroup.Option value="opt1" testID="option-1" disabled>
            Option 1
          </EtRadioGroup.Option>
        </EtRadioGroup>,
      );

      fireEvent.press(getByTestId('option-1'));
      expect(Haptics.impactAsync).not.toHaveBeenCalled();
    });
  });

  describe('Error State', () => {
    it('renders with error prop', () => {
      const { getByTestId } = render(
        <EtRadioGroup value={null} onChange={mockOnChange} error testID="error-group">
          <EtRadioGroup.Option value="opt1">Option 1</EtRadioGroup.Option>
        </EtRadioGroup>,
      );

      expect(getByTestId('error-group')).toBeTruthy();
    });

    it('error state does not prevent selection', () => {
      const handleChange = jest.fn();
      const { getByTestId } = render(
        <EtRadioGroup value={null} onChange={handleChange} error>
          <EtRadioGroup.Option value="opt1" testID="option-1">
            Option 1
          </EtRadioGroup.Option>
        </EtRadioGroup>,
      );

      fireEvent.press(getByTestId('option-1'));
      expect(handleChange).toHaveBeenCalledWith('opt1');
    });
  });

  describe('Haptics', () => {
    it('triggers haptic feedback on selection', () => {
      const Haptics = require('expo-haptics');
      Haptics.impactAsync.mockClear();

      const { getByTestId } = render(
        <EtRadioGroup value={null} onChange={mockOnChange}>
          <EtRadioGroup.Option value="opt1" testID="option-1">
            Option 1
          </EtRadioGroup.Option>
        </EtRadioGroup>,
      );

      fireEvent.press(getByTestId('option-1'));
      expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light);
    });

    it('does NOT trigger haptics when haptics={false}', () => {
      const Haptics = require('expo-haptics');
      Haptics.impactAsync.mockClear();

      const { getByTestId } = render(
        <EtRadioGroup value={null} onChange={mockOnChange} haptics={false}>
          <EtRadioGroup.Option value="opt1" testID="option-1">
            Option 1
          </EtRadioGroup.Option>
        </EtRadioGroup>,
      );

      fireEvent.press(getByTestId('option-1'));
      expect(Haptics.impactAsync).not.toHaveBeenCalled();
    });

    it('does NOT trigger haptics when clicking already-selected option', () => {
      const Haptics = require('expo-haptics');
      Haptics.impactAsync.mockClear();

      const { getByTestId } = render(
        <EtRadioGroup value="opt1" onChange={mockOnChange}>
          <EtRadioGroup.Option value="opt1" testID="option-1">
            Option 1
          </EtRadioGroup.Option>
        </EtRadioGroup>,
      );

      fireEvent.press(getByTestId('option-1'));
      expect(Haptics.impactAsync).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('group has radiogroup role', () => {
      const { getByTestId } = render(
        <EtRadioGroup value={null} onChange={mockOnChange} testID="radio-group">
          <EtRadioGroup.Option value="opt1">Option 1</EtRadioGroup.Option>
        </EtRadioGroup>,
      );

      const group = getByTestId('radio-group');
      expect(group.props.accessibilityRole).toBe('radiogroup');
    });

    it('options have radio role', () => {
      const { getAllByRole } = render(
        <EtRadioGroup value={null} onChange={mockOnChange}>
          <EtRadioGroup.Option value="opt1">Option 1</EtRadioGroup.Option>
          <EtRadioGroup.Option value="opt2">Option 2</EtRadioGroup.Option>
        </EtRadioGroup>,
      );

      expect(getAllByRole('radio').length).toBe(2);
    });

    it('correct accessibilityState for selected', () => {
      const { getByTestId } = render(
        <EtRadioGroup value="opt1" onChange={mockOnChange}>
          <EtRadioGroup.Option value="opt1" testID="option-1">
            Option 1
          </EtRadioGroup.Option>
        </EtRadioGroup>,
      );

      const option = getByTestId('option-1');
      expect(option.props.accessibilityState.selected).toBe(true);
    });

    it('correct accessibilityState for disabled', () => {
      const { getByTestId } = render(
        <EtRadioGroup value={null} onChange={mockOnChange}>
          <EtRadioGroup.Option value="opt1" testID="option-1" disabled>
            Option 1
          </EtRadioGroup.Option>
        </EtRadioGroup>,
      );

      const option = getByTestId('option-1');
      expect(option.props.accessibilityState.disabled).toBe(true);
    });

    it('group accessibilityLabel works', () => {
      const { getByLabelText } = render(
        <EtRadioGroup value={null} onChange={mockOnChange} accessibilityLabel="Choose payment method">
          <EtRadioGroup.Option value="opt1">Option 1</EtRadioGroup.Option>
        </EtRadioGroup>,
      );

      expect(getByLabelText('Choose payment method')).toBeTruthy();
    });

    it('option accessibilityLabel works', () => {
      const { getByLabelText } = render(
        <EtRadioGroup value={null} onChange={mockOnChange}>
          <EtRadioGroup.Option value="opt1" accessibilityLabel="Credit card option">
            Credit Card
          </EtRadioGroup.Option>
        </EtRadioGroup>,
      );

      expect(getByLabelText('Credit card option')).toBeTruthy();
    });

    it('option uses children as default accessibilityLabel', () => {
      const { getByLabelText } = render(
        <EtRadioGroup value={null} onChange={mockOnChange}>
          <EtRadioGroup.Option value="opt1">Credit Card</EtRadioGroup.Option>
        </EtRadioGroup>,
      );

      expect(getByLabelText('Credit Card')).toBeTruthy();
    });
  });

  describe('Context', () => {
    it('Option throws when used outside RadioGroup', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<EtRadioGroup.Option value="opt1">Option 1</EtRadioGroup.Option>);
      }).toThrow('EtRadioGroup.Option must be used within an EtRadioGroup');

      consoleSpy.mockRestore();
    });
  });

  describe('Direction Prop', () => {
    it('defaults to vertical layout', () => {
      const { getByTestId } = render(
        <EtRadioGroup value={null} onChange={mockOnChange} testID="radio-group">
          <EtRadioGroup.Option value="opt1">Option 1</EtRadioGroup.Option>
          <EtRadioGroup.Option value="opt2">Option 2</EtRadioGroup.Option>
        </EtRadioGroup>,
      );

      const group = getByTestId('radio-group');
      const style = group.props.style;
      expect(style).toEqual(expect.objectContaining({ flexDirection: 'column', gap: 12 }));
    });

    it('applies vertical layout with gap 12', () => {
      const { getByTestId } = render(
        <EtRadioGroup value={null} onChange={mockOnChange} direction="vertical" testID="radio-group">
          <EtRadioGroup.Option value="opt1">Option 1</EtRadioGroup.Option>
          <EtRadioGroup.Option value="opt2">Option 2</EtRadioGroup.Option>
        </EtRadioGroup>,
      );

      const group = getByTestId('radio-group');
      const style = group.props.style;
      expect(style).toEqual(expect.objectContaining({ flexDirection: 'column', gap: 12 }));
    });

    it('applies horizontal layout with gap 24', () => {
      const { getByTestId } = render(
        <EtRadioGroup value={null} onChange={mockOnChange} direction="horizontal" testID="radio-group">
          <EtRadioGroup.Option value="opt1">Option 1</EtRadioGroup.Option>
          <EtRadioGroup.Option value="opt2">Option 2</EtRadioGroup.Option>
        </EtRadioGroup>,
      );

      const group = getByTestId('radio-group');
      const style = group.props.style;
      expect(style).toEqual(expect.objectContaining({ flexDirection: 'row', gap: 24 }));
    });

    it('selection works in horizontal layout', () => {
      const handleChange = jest.fn();
      const { getByTestId } = render(
        <EtRadioGroup value={null} onChange={handleChange} direction="horizontal">
          <EtRadioGroup.Option value="opt1" testID="option-1">
            Option 1
          </EtRadioGroup.Option>
          <EtRadioGroup.Option value="opt2" testID="option-2">
            Option 2
          </EtRadioGroup.Option>
        </EtRadioGroup>,
      );

      fireEvent.press(getByTestId('option-1'));
      expect(handleChange).toHaveBeenCalledWith('opt1');
    });
  });

  describe('Nested View Wrapper', () => {
    it('handles View wrapper between group and options (backwards compat)', () => {
      const handleChange = jest.fn();
      const { getByTestId, getByText } = render(
        <EtRadioGroup value={null} onChange={handleChange}>
          <View style={{ flexDirection: 'row', gap: 24 }}>
            <EtRadioGroup.Option value="opt1" testID="option-1">
              Option 1
            </EtRadioGroup.Option>
            <EtRadioGroup.Option value="opt2" testID="option-2">
              Option 2
            </EtRadioGroup.Option>
          </View>
        </EtRadioGroup>,
      );

      expect(getByText('Option 1')).toBeTruthy();
      expect(getByText('Option 2')).toBeTruthy();

      fireEvent.press(getByTestId('option-1'));
      expect(handleChange).toHaveBeenCalledWith('opt1');
    });
  });

  describe('Style Customization', () => {
    it('applies custom style to option', () => {
      const customStyle = { marginBottom: 16 };
      const { getByTestId } = render(
        <EtRadioGroup value={null} onChange={mockOnChange}>
          <EtRadioGroup.Option value="opt1" testID="option-1" style={customStyle}>
            Option 1
          </EtRadioGroup.Option>
        </EtRadioGroup>,
      );

      const option = getByTestId('option-1');
      expect(option.props.style).toEqual(expect.arrayContaining([expect.objectContaining(customStyle)]));
    });
  });

  describe('Edge Cases', () => {
    it('handles rapid rerenders', () => {
      const { rerender, getByTestId } = render(
        <EtRadioGroup value={null} onChange={mockOnChange} testID="radio-group">
          <EtRadioGroup.Option value="opt1">Option 1</EtRadioGroup.Option>
        </EtRadioGroup>,
      );

      for (let i = 0; i < 10; i++) {
        rerender(
          <EtRadioGroup value={i % 2 === 0 ? 'opt1' : null} onChange={mockOnChange} testID="radio-group">
            <EtRadioGroup.Option value="opt1">Option 1</EtRadioGroup.Option>
          </EtRadioGroup>,
        );
      }

      expect(getByTestId('radio-group')).toBeTruthy();
    });

    it('handles prop changes correctly', () => {
      const { rerender, getByTestId } = render(
        <EtRadioGroup value={null} onChange={mockOnChange}>
          <EtRadioGroup.Option value="opt1" testID="option-1">
            Option 1
          </EtRadioGroup.Option>
        </EtRadioGroup>,
      );

      expect(getByTestId('option-1').props.accessibilityState.selected).toBe(false);

      rerender(
        <EtRadioGroup value="opt1" onChange={mockOnChange}>
          <EtRadioGroup.Option value="opt1" testID="option-1">
            Option 1
          </EtRadioGroup.Option>
        </EtRadioGroup>,
      );

      expect(getByTestId('option-1').props.accessibilityState.selected).toBe(true);
    });

    it('handles disabled prop changes', () => {
      const handleChange = jest.fn();
      const { rerender, getByTestId } = render(
        <EtRadioGroup value={null} onChange={handleChange} disabled>
          <EtRadioGroup.Option value="opt1" testID="option-1">
            Option 1
          </EtRadioGroup.Option>
        </EtRadioGroup>,
      );

      fireEvent.press(getByTestId('option-1'));
      expect(handleChange).not.toHaveBeenCalled();

      rerender(
        <EtRadioGroup value={null} onChange={handleChange} disabled={false}>
          <EtRadioGroup.Option value="opt1" testID="option-1">
            Option 1
          </EtRadioGroup.Option>
        </EtRadioGroup>,
      );

      fireEvent.press(getByTestId('option-1'));
      expect(handleChange).toHaveBeenCalledWith('opt1');
    });

    it('handles many options', () => {
      const options = Array.from({ length: 20 }, (_, i) => `option-${i}`);

      const { getAllByRole } = render(
        <EtRadioGroup value={null} onChange={mockOnChange}>
          {options.map((opt) => (
            <EtRadioGroup.Option key={opt} value={opt}>
              {opt}
            </EtRadioGroup.Option>
          ))}
        </EtRadioGroup>,
      );

      expect(getAllByRole('radio').length).toBe(20);
    });
  });

  describe('Component Structure', () => {
    it('has Option as static property', () => {
      expect(EtRadioGroup.Option).toBeDefined();
    });

    it('EtRadioGroup.Option is the RadioOption component', () => {
      expect(EtRadioGroup.Option).toBe(RadioOption);
    });

    it('has displayName set', () => {
      expect(EtRadioGroup.displayName).toBe('EtRadioGroup');
    });
  });

  describe('Props Integration', () => {
    it('handles all props together', () => {
      const handleChange = jest.fn();
      const { getByTestId, getByText } = render(
        <EtRadioGroup
          testID="full-radio-group"
          value="opt1"
          onChange={handleChange}
          direction="horizontal"
          disabled={false}
          error={false}
          haptics={true}
          accessibilityLabel="Payment options"
        >
          <EtRadioGroup.Option value="opt1" testID="option-1" style={{ margin: 8 }} accessibilityLabel="First option">
            Option 1
          </EtRadioGroup.Option>
          <EtRadioGroup.Option value="opt2" testID="option-2">
            Option 2
          </EtRadioGroup.Option>
        </EtRadioGroup>,
      );

      expect(getByTestId('full-radio-group')).toBeTruthy();
      expect(getByTestId('option-1')).toBeTruthy();
      expect(getByText('Option 1')).toBeTruthy();
      expect(getByText('Option 2')).toBeTruthy();

      // Verify horizontal layout is applied
      const group = getByTestId('full-radio-group');
      const style = group.props.style;
      expect(style).toEqual(expect.objectContaining({ flexDirection: 'row', gap: 24 }));
    });
  });
});
