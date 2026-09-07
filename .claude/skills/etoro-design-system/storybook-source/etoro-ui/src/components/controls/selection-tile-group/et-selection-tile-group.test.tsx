import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';
import { useState } from 'react';
import { TextInput } from 'react-native';

import type { EtSelectionTileGroupSingleProps } from './api/types';
import { EtSelectionTileGroup } from './et-selection-tile-group';
import { SelectionTileOption } from './subcomponents/selection-tile-option';

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

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
}));

// Mock react-native-reanimated for RadioIndicator
jest.mock('react-native-reanimated', () => {
  const { Text, View } = require('react-native');
  return {
    __esModule: true,
    default: {
      View,
      Text,
      createAnimatedComponent: (Component: unknown) => Component,
    },
    Easing: {
      bezier: jest.fn(() => jest.fn()),
      out: jest.fn((fn: unknown) => fn),
      cubic: jest.fn((t: number) => t),
      ease: jest.fn((v: number) => v),
    },
    useSharedValue: jest.fn((v: number) => {
      let currentValue = v;
      return {
        get value() {
          return currentValue;
        },
        set value(nextValue: number) {
          currentValue = nextValue;
        },
        get: jest.fn(() => currentValue),
        set: jest.fn((nextValue: number) => {
          currentValue = nextValue;
        }),
      };
    }),
    useAnimatedStyle: jest.fn((fn: () => object) => fn()),
    useDerivedValue: jest.fn((fn: () => number) => ({ value: fn() })),
    withTiming: jest.fn((v: number) => v),
    interpolate: jest.fn((v: number, _input: number[], output: number[]) => (v === 0 ? output[0] : output[1])),
    interpolateColor: jest.fn((_v: number, _input: number[], output: string[]) => output[0]),
  };
});

// Mock react-native-gesture-handler Switch for EtToggleSwitch
jest.mock('react-native-gesture-handler', () => {
  const { Switch } = require('react-native');
  return { Switch };
});

describe('EtSelectionTileGroup', () => {
  describe('Types', () => {
    it('should support string | null value types', () => {
      const nullValue: EtSelectionTileGroupSingleProps['value'] = null;
      const stringValue: EtSelectionTileGroupSingleProps['value'] = 'option1';

      expect(nullValue).toBeNull();
      expect(stringValue).toBe('option1');
    });

    it('should have required props', () => {
      const props: EtSelectionTileGroupSingleProps = {
        value: null,
        onChange: () => {},
        children: null,
      };

      expect(props.value).toBeNull();
      expect(typeof props.onChange).toBe('function');
    });

    it('should support optional props', () => {
      const props: EtSelectionTileGroupSingleProps = {
        value: 'opt1',
        onChange: () => {},
        children: null,
        variant: 'toggleInput',
        disabled: true,
        haptics: false,
        testID: 'test',
        accessibilityLabel: 'label',
      };

      expect(props.disabled).toBe(true);
      expect(props.haptics).toBe(false);
      expect(props.variant).toBe('toggleInput');
    });
  });

  describe('Subcomponents', () => {
    it('should be a function component', () => {
      expect(typeof SelectionTileOption).toBe('function');
    });

    it('should have displayName set', () => {
      expect(SelectionTileOption.displayName).toBe('EtSelectionTileGroup.Option');
    });

    it('should be accessible via EtSelectionTileGroup.Option', () => {
      expect(EtSelectionTileGroup.Option).toBe(SelectionTileOption);
    });
  });
});

// ---------------------------------------------------------------------------
// Icon variant (default)
// ---------------------------------------------------------------------------
describe('EtSelectionTileGroup — icon variant (default)', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      const { getByTestId } = render(
        <EtSelectionTileGroup value={null} onChange={mockOnChange} testID="tile-group">
          <EtSelectionTileGroup.Option value="opt1">Option 1</EtSelectionTileGroup.Option>
        </EtSelectionTileGroup>,
      );

      expect(getByTestId('tile-group')).toBeTruthy();
    });

    it('renders options with labels', () => {
      const { getByText } = render(
        <EtSelectionTileGroup value={null} onChange={mockOnChange}>
          <EtSelectionTileGroup.Option value="opt1">First Option</EtSelectionTileGroup.Option>
          <EtSelectionTileGroup.Option value="opt2">Second Option</EtSelectionTileGroup.Option>
        </EtSelectionTileGroup>,
      );

      expect(getByText('First Option')).toBeTruthy();
      expect(getByText('Second Option')).toBeTruthy();
    });

    it('renders multiple options', () => {
      const { getAllByRole } = render(
        <EtSelectionTileGroup value={null} onChange={mockOnChange}>
          <EtSelectionTileGroup.Option value="opt1">Option 1</EtSelectionTileGroup.Option>
          <EtSelectionTileGroup.Option value="opt2">Option 2</EtSelectionTileGroup.Option>
          <EtSelectionTileGroup.Option value="opt3">Option 3</EtSelectionTileGroup.Option>
        </EtSelectionTileGroup>,
      );

      expect(getAllByRole('radio').length).toBe(3);
    });

    it('renders with option testID', () => {
      const { getByTestId } = render(
        <EtSelectionTileGroup value={null} onChange={mockOnChange}>
          <EtSelectionTileGroup.Option value="opt1" testID="option-1">
            Option 1
          </EtSelectionTileGroup.Option>
        </EtSelectionTileGroup>,
      );

      expect(getByTestId('option-1')).toBeTruthy();
    });
  });

  describe('Selection Behavior', () => {
    it('calls onChange when option pressed', () => {
      const handleChange = jest.fn();
      const { getByTestId } = render(
        <EtSelectionTileGroup value={null} onChange={handleChange}>
          <EtSelectionTileGroup.Option value="opt1" testID="option-1">
            Option 1
          </EtSelectionTileGroup.Option>
        </EtSelectionTileGroup>,
      );

      fireEvent.press(getByTestId('option-1'));
      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith('opt1');
    });

    it('does NOT call onChange when clicking already selected option', () => {
      const handleChange = jest.fn();
      const { getByTestId } = render(
        <EtSelectionTileGroup value="opt1" onChange={handleChange}>
          <EtSelectionTileGroup.Option value="opt1" testID="option-1">
            Option 1
          </EtSelectionTileGroup.Option>
        </EtSelectionTileGroup>,
      );

      fireEvent.press(getByTestId('option-1'));
      expect(handleChange).not.toHaveBeenCalled();
    });

    it('correctly shows selected state', () => {
      const { getByTestId } = render(
        <EtSelectionTileGroup value="opt2" onChange={mockOnChange}>
          <EtSelectionTileGroup.Option value="opt1" testID="option-1">
            Option 1
          </EtSelectionTileGroup.Option>
          <EtSelectionTileGroup.Option value="opt2" testID="option-2">
            Option 2
          </EtSelectionTileGroup.Option>
        </EtSelectionTileGroup>,
      );

      expect(getByTestId('option-1').props.accessibilityState.selected).toBe(false);
      expect(getByTestId('option-2').props.accessibilityState.selected).toBe(true);
    });

    it('handles null initial value', () => {
      const { getAllByRole } = render(
        <EtSelectionTileGroup value={null} onChange={mockOnChange}>
          <EtSelectionTileGroup.Option value="opt1">Option 1</EtSelectionTileGroup.Option>
          <EtSelectionTileGroup.Option value="opt2">Option 2</EtSelectionTileGroup.Option>
        </EtSelectionTileGroup>,
      );

      const radios = getAllByRole('radio');
      expect(radios[0].props.accessibilityState.selected).toBe(false);
      expect(radios[1].props.accessibilityState.selected).toBe(false);
    });
  });

  describe('Custom iconName', () => {
    it('renders default icon when iconName is not specified', () => {
      const { getByTestId } = render(
        <EtSelectionTileGroup value={null} onChange={mockOnChange}>
          <EtSelectionTileGroup.Option value="opt1" testID="option-1">
            Option 1
          </EtSelectionTileGroup.Option>
        </EtSelectionTileGroup>,
      );

      expect(getByTestId('option-1')).toBeTruthy();
    });

    it('renders with custom iconName', () => {
      const { getByTestId } = render(
        <EtSelectionTileGroup variant="icon" value={null} onChange={mockOnChange}>
          <EtSelectionTileGroup.Option value="opt1" iconName="check" testID="option-1">
            Option 1
          </EtSelectionTileGroup.Option>
        </EtSelectionTileGroup>,
      );

      expect(getByTestId('option-1')).toBeTruthy();
    });
  });

  describe('Disabled States', () => {
    it('group disabled prevents all option presses', () => {
      const handleChange = jest.fn();
      const { getByTestId } = render(
        <EtSelectionTileGroup value={null} onChange={handleChange} disabled>
          <EtSelectionTileGroup.Option value="opt1" testID="option-1">
            Option 1
          </EtSelectionTileGroup.Option>
          <EtSelectionTileGroup.Option value="opt2" testID="option-2">
            Option 2
          </EtSelectionTileGroup.Option>
        </EtSelectionTileGroup>,
      );

      fireEvent.press(getByTestId('option-1'));
      fireEvent.press(getByTestId('option-2'));
      expect(handleChange).not.toHaveBeenCalled();
    });

    it('individual option disabled prevents that option press', () => {
      const handleChange = jest.fn();
      const { getByTestId } = render(
        <EtSelectionTileGroup value={null} onChange={handleChange}>
          <EtSelectionTileGroup.Option value="opt1" testID="option-1" disabled>
            Option 1
          </EtSelectionTileGroup.Option>
          <EtSelectionTileGroup.Option value="opt2" testID="option-2">
            Option 2
          </EtSelectionTileGroup.Option>
        </EtSelectionTileGroup>,
      );

      fireEvent.press(getByTestId('option-1'));
      expect(handleChange).not.toHaveBeenCalled();

      fireEvent.press(getByTestId('option-2'));
      expect(handleChange).toHaveBeenCalledWith('opt2');
    });

    it('sets accessibility disabled state', () => {
      const { getByTestId } = render(
        <EtSelectionTileGroup value={null} onChange={mockOnChange} disabled>
          <EtSelectionTileGroup.Option value="opt1" testID="option-1">
            Option 1
          </EtSelectionTileGroup.Option>
        </EtSelectionTileGroup>,
      );

      expect(getByTestId('option-1').props.accessibilityState.disabled).toBe(true);
    });
  });

  describe('Haptics', () => {
    it('triggers haptic feedback on selection', () => {
      const Haptics = require('expo-haptics');
      Haptics.impactAsync.mockClear();

      const { getByTestId } = render(
        <EtSelectionTileGroup value={null} onChange={mockOnChange}>
          <EtSelectionTileGroup.Option value="opt1" testID="option-1">
            Option 1
          </EtSelectionTileGroup.Option>
        </EtSelectionTileGroup>,
      );

      fireEvent.press(getByTestId('option-1'));
      expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light);
    });

    it('does NOT trigger haptics when haptics={false}', () => {
      const Haptics = require('expo-haptics');
      Haptics.impactAsync.mockClear();

      const { getByTestId } = render(
        <EtSelectionTileGroup value={null} onChange={mockOnChange} haptics={false}>
          <EtSelectionTileGroup.Option value="opt1" testID="option-1">
            Option 1
          </EtSelectionTileGroup.Option>
        </EtSelectionTileGroup>,
      );

      fireEvent.press(getByTestId('option-1'));
      expect(Haptics.impactAsync).not.toHaveBeenCalled();
    });

    it('does NOT trigger haptics when clicking already-selected option', () => {
      const Haptics = require('expo-haptics');
      Haptics.impactAsync.mockClear();

      const { getByTestId } = render(
        <EtSelectionTileGroup value="opt1" onChange={mockOnChange}>
          <EtSelectionTileGroup.Option value="opt1" testID="option-1">
            Option 1
          </EtSelectionTileGroup.Option>
        </EtSelectionTileGroup>,
      );

      fireEvent.press(getByTestId('option-1'));
      expect(Haptics.impactAsync).not.toHaveBeenCalled();
    });

    it('does not trigger haptics when group disabled', () => {
      const Haptics = require('expo-haptics');
      Haptics.impactAsync.mockClear();

      const { getByTestId } = render(
        <EtSelectionTileGroup value={null} onChange={mockOnChange} disabled>
          <EtSelectionTileGroup.Option value="opt1" testID="option-1">
            Option 1
          </EtSelectionTileGroup.Option>
        </EtSelectionTileGroup>,
      );

      fireEvent.press(getByTestId('option-1'));
      expect(Haptics.impactAsync).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('group has radiogroup role', () => {
      const { getByTestId } = render(
        <EtSelectionTileGroup value={null} onChange={mockOnChange} testID="tile-group">
          <EtSelectionTileGroup.Option value="opt1">Option 1</EtSelectionTileGroup.Option>
        </EtSelectionTileGroup>,
      );

      expect(getByTestId('tile-group').props.role).toBe('radiogroup');
    });

    it('options have radio role', () => {
      const { getAllByRole } = render(
        <EtSelectionTileGroup value={null} onChange={mockOnChange}>
          <EtSelectionTileGroup.Option value="opt1">Option 1</EtSelectionTileGroup.Option>
          <EtSelectionTileGroup.Option value="opt2">Option 2</EtSelectionTileGroup.Option>
        </EtSelectionTileGroup>,
      );

      expect(getAllByRole('radio').length).toBe(2);
    });

    it('group accessibilityLabel works', () => {
      const { getByLabelText } = render(
        <EtSelectionTileGroup value={null} onChange={mockOnChange} accessibilityLabel="Choose gender">
          <EtSelectionTileGroup.Option value="opt1">Option 1</EtSelectionTileGroup.Option>
        </EtSelectionTileGroup>,
      );

      expect(getByLabelText('Choose gender')).toBeTruthy();
    });

    it('option uses children as default accessibilityLabel', () => {
      const { getByLabelText } = render(
        <EtSelectionTileGroup value={null} onChange={mockOnChange}>
          <EtSelectionTileGroup.Option value="opt1">Female</EtSelectionTileGroup.Option>
        </EtSelectionTileGroup>,
      );

      expect(getByLabelText('Female')).toBeTruthy();
    });
  });

  describe('Context', () => {
    it('Option throws when used outside SelectionTileGroup', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<EtSelectionTileGroup.Option value="opt1">Option 1</EtSelectionTileGroup.Option>);
      }).toThrow('EtSelectionTileGroup.Option must be used within an EtSelectionTileGroup');

      consoleSpy.mockRestore();
    });
  });

  describe('Component Structure', () => {
    it('has Option as static property', () => {
      expect(EtSelectionTileGroup.Option).toBeDefined();
    });

    it('EtSelectionTileGroup.Option is the SelectionTileOption component', () => {
      expect(EtSelectionTileGroup.Option).toBe(SelectionTileOption);
    });

    it('has displayName set', () => {
      expect(EtSelectionTileGroup.displayName).toBe('EtSelectionTileGroup');
    });
  });

  describe('Edge Cases', () => {
    it('handles rapid rerenders', () => {
      const { rerender, getByTestId } = render(
        <EtSelectionTileGroup value={null} onChange={mockOnChange} testID="tile-group">
          <EtSelectionTileGroup.Option value="opt1">Option 1</EtSelectionTileGroup.Option>
        </EtSelectionTileGroup>,
      );

      for (let i = 0; i < 10; i++) {
        rerender(
          <EtSelectionTileGroup value={i % 2 === 0 ? 'opt1' : null} onChange={mockOnChange} testID="tile-group">
            <EtSelectionTileGroup.Option value="opt1">Option 1</EtSelectionTileGroup.Option>
          </EtSelectionTileGroup>,
        );
      }

      expect(getByTestId('tile-group')).toBeTruthy();
    });

    it('handles prop changes correctly', () => {
      const { rerender, getByTestId } = render(
        <EtSelectionTileGroup value={null} onChange={mockOnChange}>
          <EtSelectionTileGroup.Option value="opt1" testID="option-1">
            Option 1
          </EtSelectionTileGroup.Option>
        </EtSelectionTileGroup>,
      );

      expect(getByTestId('option-1').props.accessibilityState.selected).toBe(false);

      rerender(
        <EtSelectionTileGroup value="opt1" onChange={mockOnChange}>
          <EtSelectionTileGroup.Option value="opt1" testID="option-1">
            Option 1
          </EtSelectionTileGroup.Option>
        </EtSelectionTileGroup>,
      );

      expect(getByTestId('option-1').props.accessibilityState.selected).toBe(true);
    });

    it('handles many options', () => {
      const options = Array.from({ length: 20 }, (_, i) => `option-${i}`);

      const { getAllByRole } = render(
        <EtSelectionTileGroup value={null} onChange={mockOnChange}>
          {options.map((opt) => (
            <EtSelectionTileGroup.Option key={opt} value={opt}>
              {opt}
            </EtSelectionTileGroup.Option>
          ))}
        </EtSelectionTileGroup>,
      );

      expect(getAllByRole('radio').length).toBe(20);
    });
  });
});

// ---------------------------------------------------------------------------
// Radio variant
// ---------------------------------------------------------------------------
describe('EtSelectionTileGroup — radio variant', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders radio variant options', () => {
    const { getByText } = render(
      <EtSelectionTileGroup variant="radio" value={null} onChange={mockOnChange}>
        <EtSelectionTileGroup.Option value="conservative">Conservative</EtSelectionTileGroup.Option>
        <EtSelectionTileGroup.Option value="moderate">Moderate</EtSelectionTileGroup.Option>
      </EtSelectionTileGroup>,
    );

    expect(getByText('Conservative')).toBeTruthy();
    expect(getByText('Moderate')).toBeTruthy();
  });

  it('renders subtitle text', () => {
    const { getByText } = render(
      <EtSelectionTileGroup variant="radio" value={null} onChange={mockOnChange}>
        <EtSelectionTileGroup.Option value="moderate" subtitle="Balance risk & growth">
          Moderate
        </EtSelectionTileGroup.Option>
      </EtSelectionTileGroup>,
    );

    expect(getByText('Moderate')).toBeTruthy();
    expect(getByText('Balance risk & growth')).toBeTruthy();
  });

  it('calls onChange when option pressed', () => {
    const handleChange = jest.fn();
    const { getByTestId } = render(
      <EtSelectionTileGroup variant="radio" value={null} onChange={handleChange}>
        <EtSelectionTileGroup.Option value="moderate" testID="option-moderate">
          Moderate
        </EtSelectionTileGroup.Option>
      </EtSelectionTileGroup>,
    );

    fireEvent.press(getByTestId('option-moderate'));
    expect(handleChange).toHaveBeenCalledWith('moderate');
  });

  it('does NOT call onChange when clicking already selected option', () => {
    const handleChange = jest.fn();
    const { getByTestId } = render(
      <EtSelectionTileGroup variant="radio" value="moderate" onChange={handleChange}>
        <EtSelectionTileGroup.Option value="moderate" testID="option-moderate">
          Moderate
        </EtSelectionTileGroup.Option>
      </EtSelectionTileGroup>,
    );

    fireEvent.press(getByTestId('option-moderate'));
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('correctly shows selected state', () => {
    const { getByTestId } = render(
      <EtSelectionTileGroup variant="radio" value="moderate" onChange={mockOnChange}>
        <EtSelectionTileGroup.Option value="conservative" testID="option-1">
          Conservative
        </EtSelectionTileGroup.Option>
        <EtSelectionTileGroup.Option value="moderate" testID="option-2">
          Moderate
        </EtSelectionTileGroup.Option>
      </EtSelectionTileGroup>,
    );

    expect(getByTestId('option-1').props.accessibilityState.selected).toBe(false);
    expect(getByTestId('option-2').props.accessibilityState.selected).toBe(true);
  });

  it('has radiogroup accessibility role', () => {
    const { getByTestId } = render(
      <EtSelectionTileGroup variant="radio" value={null} onChange={mockOnChange} testID="radio-group">
        <EtSelectionTileGroup.Option value="opt1">Option 1</EtSelectionTileGroup.Option>
      </EtSelectionTileGroup>,
    );

    expect(getByTestId('radio-group').props.role).toBe('radiogroup');
  });
});

// ---------------------------------------------------------------------------
// Toggle variant — single select
// ---------------------------------------------------------------------------
describe('EtSelectionTileGroup — toggle variant (single)', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders toggle variant options', () => {
    const { getByText } = render(
      <EtSelectionTileGroup variant="toggle" value={null} onChange={mockOnChange}>
        <EtSelectionTileGroup.Option value="opt1">Option 1</EtSelectionTileGroup.Option>
        <EtSelectionTileGroup.Option value="opt2">Option 2</EtSelectionTileGroup.Option>
      </EtSelectionTileGroup>,
    );

    expect(getByText('Option 1')).toBeTruthy();
    expect(getByText('Option 2')).toBeTruthy();
  });

  it('correctly shows selected state', () => {
    const { getByTestId } = render(
      <EtSelectionTileGroup variant="toggle" value="opt2" onChange={mockOnChange}>
        <EtSelectionTileGroup.Option value="opt1" testID="option-1">
          Option 1
        </EtSelectionTileGroup.Option>
        <EtSelectionTileGroup.Option value="opt2" testID="option-2">
          Option 2
        </EtSelectionTileGroup.Option>
      </EtSelectionTileGroup>,
    );

    expect(getByTestId('option-1').props.accessibilityState.selected).toBe(false);
    expect(getByTestId('option-2').props.accessibilityState.selected).toBe(true);
  });

  it('options have switch accessibility role', () => {
    const { getByTestId } = render(
      <EtSelectionTileGroup variant="toggle" value={null} onChange={mockOnChange}>
        <EtSelectionTileGroup.Option value="opt1" testID="option-1">
          Option 1
        </EtSelectionTileGroup.Option>
      </EtSelectionTileGroup>,
    );

    expect(getByTestId('option-1').props.accessibilityRole).toBe('switch');
  });

  it('has radiogroup accessibility role for single select', () => {
    const { getByTestId } = render(
      <EtSelectionTileGroup variant="toggle" value={null} onChange={mockOnChange} testID="toggle-group">
        <EtSelectionTileGroup.Option value="opt1">Option 1</EtSelectionTileGroup.Option>
      </EtSelectionTileGroup>,
    );

    expect(getByTestId('toggle-group').props.role).toBe('radiogroup');
  });
});

// ---------------------------------------------------------------------------
// Toggle + inline input variant
// ---------------------------------------------------------------------------
describe('EtSelectionTileGroup — toggleInput variant', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders inline input when selected and hides it when unselected', () => {
    const { queryByTestId, rerender } = render(
      <EtSelectionTileGroup variant="toggleInput" selectionMode="multi" value={[]} onChange={mockOnChange}>
        <EtSelectionTileGroup.Option value="director" testID="option-director" input={{ fieldProps: { testID: 'director-input' } }}>
          A director or a 10% shareholder of a publicly traded corporation.
        </EtSelectionTileGroup.Option>
      </EtSelectionTileGroup>,
    );

    expect(queryByTestId('director-input')).toBeNull();

    rerender(
      <EtSelectionTileGroup variant="toggleInput" selectionMode="multi" value={['director']} onChange={mockOnChange}>
        <EtSelectionTileGroup.Option value="director" testID="option-director" input={{ fieldProps: { testID: 'director-input' } }}>
          A director or a 10% shareholder of a publicly traded corporation.
        </EtSelectionTileGroup.Option>
      </EtSelectionTileGroup>,
    );

    expect(queryByTestId('director-input')).toBeTruthy();

    rerender(
      <EtSelectionTileGroup variant="toggleInput" selectionMode="multi" value={[]} onChange={mockOnChange}>
        <EtSelectionTileGroup.Option value="director" testID="option-director" input={{ fieldProps: { testID: 'director-input' } }}>
          A director or a 10% shareholder of a publicly traded corporation.
        </EtSelectionTileGroup.Option>
      </EtSelectionTileGroup>,
    );

    expect(queryByTestId('director-input')).toBeNull();
  });

  it('renders default inline input for selected option without custom input config', () => {
    const { rerender, UNSAFE_queryAllByType } = render(
      <EtSelectionTileGroup variant="toggleInput" selectionMode="multi" value={[]} onChange={mockOnChange}>
        <EtSelectionTileGroup.Option value="brokerage" testID="option-brokerage">
          Employed by a brokerage firm or securities exchange.
        </EtSelectionTileGroup.Option>
      </EtSelectionTileGroup>,
    );

    expect(UNSAFE_queryAllByType(TextInput)).toHaveLength(0);

    rerender(
      <EtSelectionTileGroup variant="toggleInput" selectionMode="multi" value={['brokerage']} onChange={mockOnChange}>
        <EtSelectionTileGroup.Option value="brokerage" testID="option-brokerage" input={{}}>
          Employed by a brokerage firm or securities exchange.
        </EtSelectionTileGroup.Option>
      </EtSelectionTileGroup>,
    );

    expect(UNSAFE_queryAllByType(TextInput)).toHaveLength(1);
  });

  it('passes inline input text changes to input field callback', () => {
    const handleInputChange = jest.fn();
    const { getByTestId } = render(
      <EtSelectionTileGroup variant="toggleInput" selectionMode="multi" value={['director']} onChange={mockOnChange}>
        <EtSelectionTileGroup.Option value="director" input={{ fieldProps: { testID: 'director-input', onChangeText: handleInputChange } }}>
          A director or a 10% shareholder of a publicly traded corporation.
        </EtSelectionTileGroup.Option>
      </EtSelectionTileGroup>,
    );

    fireEvent.changeText(getByTestId('director-input'), 'AAPL');

    expect(handleInputChange).toHaveBeenCalledWith('AAPL');
  });

  it('supports untoggling selected option in multi mode', () => {
    const handleChange = jest.fn();
    const { getByTestId } = render(
      <EtSelectionTileGroup variant="toggleInput" selectionMode="multi" value={['director']} onChange={handleChange}>
        <EtSelectionTileGroup.Option value="director" testID="option-director">
          A director or a 10% shareholder of a publicly traded corporation.
        </EtSelectionTileGroup.Option>
      </EtSelectionTileGroup>,
    );

    fireEvent.press(getByTestId('option-director'));

    expect(handleChange).toHaveBeenCalledWith([]);
  });

  it('works as standalone controlled component without FormField (local useState)', () => {
    function StandaloneToggleInputGroup() {
      const [selected, setSelected] = useState<string[]>([]);

      return (
        <EtSelectionTileGroup variant="toggleInput" selectionMode="multi" value={selected} onChange={setSelected}>
          <EtSelectionTileGroup.Option
            value="director"
            testID="standalone-director"
            input={{
              label: 'Please enter stock ticker',
              fieldProps: {
                testID: 'standalone-director-input',
                placeholder: 'AAPL',
              },
            }}
          >
            A director or a 10% shareholder of a publicly traded corporation.
          </EtSelectionTileGroup.Option>
        </EtSelectionTileGroup>
      );
    }

    const { getByTestId, queryByTestId } = render(<StandaloneToggleInputGroup />);

    expect(queryByTestId('standalone-director-input')).toBeNull();

    fireEvent.press(getByTestId('standalone-director'));
    expect(queryByTestId('standalone-director-input')).toBeTruthy();

    fireEvent.press(getByTestId('standalone-director'));
    expect(queryByTestId('standalone-director-input')).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Toggle variant — multi select
// ---------------------------------------------------------------------------
describe('EtSelectionTileGroup — toggle variant (multi)', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders multi-select toggle options', () => {
    const { getByText } = render(
      <EtSelectionTileGroup variant="toggle" selectionMode="multi" value={[]} onChange={mockOnChange}>
        <EtSelectionTileGroup.Option value="opt1">Option 1</EtSelectionTileGroup.Option>
        <EtSelectionTileGroup.Option value="opt2">Option 2</EtSelectionTileGroup.Option>
      </EtSelectionTileGroup>,
    );

    expect(getByText('Option 1')).toBeTruthy();
    expect(getByText('Option 2')).toBeTruthy();
  });

  it('correctly shows selected state for multiple values', () => {
    const { getByTestId } = render(
      <EtSelectionTileGroup variant="toggle" selectionMode="multi" value={['opt1', 'opt3']} onChange={mockOnChange}>
        <EtSelectionTileGroup.Option value="opt1" testID="option-1">
          Option 1
        </EtSelectionTileGroup.Option>
        <EtSelectionTileGroup.Option value="opt2" testID="option-2">
          Option 2
        </EtSelectionTileGroup.Option>
        <EtSelectionTileGroup.Option value="opt3" testID="option-3">
          Option 3
        </EtSelectionTileGroup.Option>
      </EtSelectionTileGroup>,
    );

    expect(getByTestId('option-1').props.accessibilityState.selected).toBe(true);
    expect(getByTestId('option-2').props.accessibilityState.selected).toBe(false);
    expect(getByTestId('option-3').props.accessibilityState.selected).toBe(true);
  });

  it('has group accessibility role for multi select', () => {
    const { getByTestId } = render(
      <EtSelectionTileGroup variant="toggle" selectionMode="multi" value={[]} onChange={mockOnChange} testID="multi-group">
        <EtSelectionTileGroup.Option value="opt1">Option 1</EtSelectionTileGroup.Option>
      </EtSelectionTileGroup>,
    );

    expect(getByTestId('multi-group').props.role).toBe('group');
  });

  it('handles empty initial value', () => {
    const { getByTestId } = render(
      <EtSelectionTileGroup variant="toggle" selectionMode="multi" value={[]} onChange={mockOnChange}>
        <EtSelectionTileGroup.Option value="opt1" testID="option-1">
          Option 1
        </EtSelectionTileGroup.Option>
      </EtSelectionTileGroup>,
    );

    expect(getByTestId('option-1').props.accessibilityState.selected).toBe(false);
  });
});
